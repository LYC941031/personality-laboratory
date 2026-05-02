"use client";

import { useRef, useEffect, useCallback } from "react";
import type { DimensionKey } from "@/../data/dimensions";
import { getPersonalityBySlug } from "@/../data/personalities";

// ─── Types ──────────────────────────────────────────────────────────

export interface PortraitProps {
  dimensionScores: Record<DimensionKey, number>;
  primaryType: string;
  secondaryType?: string;
  confidence: number;
  size?: number;
}

// ─── Color helpers ───────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

// ─── Drawing helpers ─────────────────────────────────────────────────

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  fill?: string, stroke?: string, lineWidth?: number
) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(r, 0), 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth ?? 1; ctx.stroke(); }
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  startAngle: number, endAngle: number,
  stroke: string, lineWidth: number
) {
  ctx.beginPath();
  ctx.arc(x, y, r, startAngle, endAngle);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  stroke: string, lineWidth: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number, sides: number,
  rotation: number, fill?: string, stroke?: string, lineWidth?: number
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (Math.PI * 2 * i) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth ?? 1; ctx.stroke(); }
}

function drawBezier(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  stroke: string, lineWidth: number, fill?: string
) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 2) {
    if (i + 1 < points.length) {
      ctx.quadraticCurveTo(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }
  }
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// ─── Generative Portrait ─────────────────────────────────────────────

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  size: number,
  scores: Record<DimensionKey, number>,
  primaryType: string,
  secondaryType: string | undefined,
  confidence: number
) {
  const W = size;
  const H = size;
  const cx = W / 2;
  const cy = H / 2;
  const R = size * 0.38;

  const personality = getPersonalityBySlug(primaryType);
  const secondary = secondaryType ? getPersonalityBySlug(secondaryType) : undefined;
  const color = personality?.color ?? "#6C5CE7";
  const color2 = secondary?.color ?? color;

  // dimension score shortcuts
  const sa = scores.socialAnxiety;      // social anxiety
  const se = scores.sensitivity;        // sensitivity
  const es = scores.selfEsteem;         // self-esteem (higher = lower)
  const dp = scores.dependency;         // dependency
  const av = scores.avoidance;          // avoidance
  const er = scores.emotionalRegulation; // emotional regulation (higher = worse)

  // Clear
  ctx.clearRect(0, 0, W, H);

  // ── Background ──
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
  bgGrad.addColorStop(0, rgba(color, 0.08));
  bgGrad.addColorStop(0.7, rgba(color, 0.03));
  bgGrad.addColorStop(1, rgba(color, 0.0));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Confidence Ring ──
  const ringAlpha = 0.12 + confidence * 0.25;
  const ringWidth = 1.5 + confidence * 3.5;
  drawCircle(ctx, cx, cy, R + 12, undefined, rgba(color, ringAlpha), ringWidth);
  if (confidence > 0.6) {
    drawCircle(ctx, cx, cy, R + 18, undefined, rgba(color, ringAlpha * 0.5), ringWidth * 0.5);
  }

  // ── Draw based on personality type ──

  // Shared: core face circle size from self-esteem
  const coreR = R * (0.45 + es * 0.55 * 0.7); // lower self-esteem = smaller core

  switch (primaryType) {
    case "avoidant": drawAvoidant(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "borderline": drawBorderline(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "dependent": drawDependent(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "obsessive": drawObsessive(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "paranoid": drawParanoid(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "histrionic": drawHistrionic(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "schizoid": drawSchizoid(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "narcissistic": drawNarcissistic(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "antisocial": drawAntisocial(ctx, cx, cy, R, coreR, scores, color, color2); break;
    default: drawDefault(ctx, cx, cy, R, coreR, scores, color); break;
  }
}

// ─── Type-specific drawing functions ─────────────────────────────────

function drawAvoidant(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Concentric protective layers, elements recede inward
  const layers = 3 + Math.round(s.avoidance * 3);
  for (let i = layers; i >= 1; i--) {
    const r = coreR + (R - coreR) * (i / layers) * 0.8;
    const alpha = 0.06 + 0.04 * i;
    drawCircle(ctx, cx, cy, r, undefined, rgba(c, alpha), 1);
  }

  // Small, inward-facing eye dots
  const eyeSpacing = coreR * (0.35 - s.socialAnxiety * 0.2);
  const eyeY = cy - coreR * 0.15;
  const eyeR = 3 + (1 - s.socialAnxiety) * 5;
  drawCircle(ctx, cx - eyeSpacing, eyeY, eyeR, rgba(c, 0.7));
  drawCircle(ctx, cx + eyeSpacing, eyeY, eyeR, rgba(c, 0.7));

  // Thin, tentative mouth line
  const mouthY = cy + coreR * 0.35;
  const mouthW = coreR * (0.2 + s.emotionalRegulation * 0.15);
  drawArc(ctx, cx, mouthY, mouthW, Math.PI * 0.15, Math.PI * 0.85, rgba(c, 0.5), 1);

  // Scattered distant dots (avoidance)
  const dotCount = 4 + Math.round(s.avoidance * 12);
  for (let i = 0; i < dotCount; i++) {
    const angle = (Math.PI * 2 * i) / dotCount + Math.random() * 0.3;
    const dist = R * (0.75 + s.avoidance * 0.35);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    drawCircle(ctx, x, y, 1.5 + Math.random(), rgba(c, 0.2 + s.sensitivity * 0.2));
  }
}

function drawBorderline(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Swirling dynamic curves — asymmetry is key
  const waveAmp = R * (0.15 + s.emotionalRegulation * 0.35);
  const waveCount = 3 + Math.round(s.sensitivity * 4);

  for (let i = 0; i < waveCount; i++) {
    const baseAngle = (Math.PI * 2 * i) / waveCount;
    const points: [number, number][] = [];
    const segments = 8;
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const angle = baseAngle + t * Math.PI * 0.7;
      const r = coreR + waveAmp * Math.sin(t * Math.PI * 2 + i);
      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
    const alpha = 0.3 + s.emotionalRegulation * 0.4;
    drawBezier(ctx, points, rgba(c, alpha), 1.5 + s.emotionalRegulation * 2);
  }

  // Asymmetric eyes
  const eyeY = cy - coreR * 0.15;
  const eyeSpacing = coreR * 0.38;
  const leftEyeR = 4 + s.sensitivity * 6;
  const rightEyeR = 4 + s.emotionalRegulation * 6;
  drawCircle(ctx, cx - eyeSpacing, eyeY - s.emotionalRegulation * 8, leftEyeR, rgba(c, 0.7));
  drawCircle(ctx, cx + eyeSpacing, eyeY + s.emotionalRegulation * 6, rightEyeR, rgba(c2, 0.6));

  // Wavy mouth
  const mouthY = cy + coreR * 0.35;
  const mouthW = coreR * 0.35;
  const mouthPts: [number, number][] = [
    [cx - mouthW, mouthY],
    [cx - mouthW * 0.5, mouthY + s.emotionalRegulation * 12],
    [cx, mouthY - s.emotionalRegulation * 8],
    [cx + mouthW * 0.5, mouthY + s.emotionalRegulation * 10],
    [cx + mouthW, mouthY],
  ];
  drawBezier(ctx, mouthPts, rgba(c, 0.6), 2);

  // Intense scattered particles
  const partCount = 6 + Math.round(s.sensitivity * 12);
  for (let i = 0; i < partCount; i++) {
    const angle = (Math.PI * 2 * i) / partCount;
    const dist = R * (0.4 + Math.random() * 0.5);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    drawCircle(ctx, x, y, 1 + Math.random() * 2.5, rgba(c, 0.25 + Math.random() * 0.35));
  }
}

function drawDependent(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Interlocking circles — elements clustered together
  const mainR = coreR * 0.85;

  // Central cluster of overlapping circles
  const clusterCount = 3 + Math.round(s.dependency * 4);
  for (let i = 0; i < clusterCount; i++) {
    const angle = (Math.PI * 2 * i) / clusterCount;
    const dist = s.dependency * coreR * 0.4;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const cr = mainR * (0.5 + 0.5 / (i + 1));
    drawCircle(ctx, x, y, cr, rgba(c, 0.06 + i * 0.04), rgba(c, 0.3), 1);
  }

  // Connection lines between circles (dependency)
  const connCount = 4 + Math.round(s.dependency * 8);
  for (let i = 0; i < connCount; i++) {
    const a1 = (Math.PI * 2 * i) / connCount;
    const a2 = (Math.PI * 2 * (i + 0.5)) / connCount;
    const d1 = coreR * (0.3 + s.dependency * 0.25);
    const d2 = R * (0.5 + s.dependency * 0.4);
    drawLine(
      ctx,
      cx + Math.cos(a1) * d1, cy + Math.sin(a1) * d1,
      cx + Math.cos(a2) * d2, cy + Math.sin(a2) * d2,
      rgba(c, 0.15 + s.dependency * 0.2), 1
    );
  }

  // Soft, rounded eyes
  const eyeSpacing = coreR * 0.38;
  const eyeY = cy - coreR * 0.12;
  const eyeR = 5 + (1 - s.selfEsteem) * 4;
  drawCircle(ctx, cx - eyeSpacing, eyeY, eyeR, rgba(c, 0.65));
  drawCircle(ctx, cx + eyeSpacing, eyeY, eyeR, rgba(c, 0.65));

  // Gentle smile
  const mouthY = cy + coreR * 0.32;
  drawArc(ctx, cx, mouthY, coreR * 0.28, Math.PI * 0.2, Math.PI * 0.8, rgba(c, 0.5), 1.5);
}

function drawObsessive(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Grid-based geometric precision
  const gridSize = 3 + Math.round(s.emotionalRegulation * 2);
  const cellSize = R * 0.55;
  const step = cellSize / gridSize;

  // Dot grid
  for (let r = 0; r <= gridSize; r++) {
    for (let col = 0; col <= gridSize; col++) {
      const x = cx - cellSize / 2 + col * step;
      const y = cy - cellSize / 2 + r * step;
      const dotR = 1 + (1 - s.avoidance) * 2;
      drawCircle(ctx, x, y, dotR, rgba(c, 0.15 + (r + col) % 3 * 0.1));
    }
  }

  // Central precise polygon
  const sides = 4 + Math.round((1 - s.emotionalRegulation) * 4);
  drawPolygon(ctx, cx, cy, coreR * 0.6, sides, Math.PI / sides, undefined, rgba(c, 0.4), 2);

  // Symmetric eyes — perfectly aligned
  const eyeSpacing = coreR * 0.42;
  const eyeY = cy - coreR * 0.1;
  const eyeSize = 3 + s.emotionalRegulation * 3;
  // Square-ish eyes
  drawPolygon(ctx, cx - eyeSpacing, eyeY, eyeSize, 4, Math.PI / 4, rgba(c, 0.6), rgba(c, 0.7), 1.5);
  drawPolygon(ctx, cx + eyeSpacing, eyeY, eyeSize, 4, Math.PI / 4, rgba(c, 0.6), rgba(c, 0.7), 1.5);

  // Straight mouth
  const mouthY = cy + coreR * 0.35;
  drawLine(ctx, cx - coreR * 0.25, mouthY, cx + coreR * 0.25, mouthY, rgba(c, 0.5), 1.5);

  // Concentric outer rings
  for (let i = 0; i < 3; i++) {
    drawCircle(ctx, cx, cy, R * (0.72 + i * 0.08), undefined, rgba(c, 0.08 + i * 0.04), 0.5);
  }
}

function drawParanoid(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Sharp triangular defensive elements
  const triCount = 6 + Math.round(s.sensitivity * 8);
  for (let i = 0; i < triCount; i++) {
    const angle = (Math.PI * 2 * i) / triCount - Math.PI / 2;
    const dist = R * (0.5 + s.sensitivity * 0.4);
    drawPolygon(
      ctx,
      cx + Math.cos(angle) * dist,
      cy + Math.sin(angle) * dist,
      6 + s.sensitivity * 10,
      3,
      angle + Math.PI,
      rgba(c, 0.1 + s.sensitivity * 0.15),
      rgba(c, 0.35),
      1.5
    );
  }

  // Defensive outer ring
  drawCircle(ctx, cx, cy, R * 0.85, undefined, rgba(c, 0.25), 2 + s.sensitivity * 2);

  // Small, wary eyes
  const eyeSpacing = coreR * 0.35;
  const eyeY = cy - coreR * 0.15;
  drawCircle(ctx, cx - eyeSpacing, eyeY, 2.5 + s.socialAnxiety * 2, rgba(c, 0.8));
  drawCircle(ctx, cx + eyeSpacing, eyeY, 2.5 + s.socialAnxiety * 2, rgba(c, 0.8));

  // Taut mouth line
  const mouthY = cy + coreR * 0.35;
  drawLine(ctx, cx - coreR * 0.2, mouthY, cx + coreR * 0.2, mouthY, rgba(c, 0.55), 1.5);

  // Angular periphery
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const r1 = R * 0.78;
    const r2 = R * (0.82 + s.sensitivity * 0.15);
    drawLine(
      ctx,
      cx + Math.cos(a) * r1, cy + Math.sin(a) * r1,
      cx + Math.cos(a + 0.1) * r2, cy + Math.sin(a + 0.1) * r2,
      rgba(c, 0.18), 1
    );
  }
}

function drawHistrionic(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Radiating starburst — expansive outward energy
  const rayCount = 12 + Math.round(s.dependency * 8);
  for (let i = 0; i < rayCount; i++) {
    const angle = (Math.PI * 2 * i) / rayCount;
    const len1 = coreR * 0.5;
    const len2 = R * (0.65 + s.dependency * 0.4);
    const grad = ctx.createLinearGradient(
      cx + Math.cos(angle) * len1, cy + Math.sin(angle) * len1,
      cx + Math.cos(angle) * len2, cy + Math.sin(angle) * len2
    );
    grad.addColorStop(0, rgba(c, 0.5));
    grad.addColorStop(1, rgba(c, 0.02));
    drawLine(ctx,
      cx + Math.cos(angle) * len1, cy + Math.sin(angle) * len1,
      cx + Math.cos(angle) * len2, cy + Math.sin(angle) * len2,
      rgba(c, 0.2), 1.5
    );
  }

  // Large, expressive eyes
  const eyeSpacing = coreR * 0.4;
  const eyeY = cy - coreR * 0.15;
  const eyeR = 6 + s.sensitivity * 5;
  drawCircle(ctx, cx - eyeSpacing, eyeY, eyeR, rgba(c, 0.65));
  drawCircle(ctx, cx + eyeSpacing, eyeY, eyeR, rgba(c, 0.65));
  // Eye highlights
  drawCircle(ctx, cx - eyeSpacing, eyeY - 1, eyeR * 0.4, rgba(c, 0.4));
  drawCircle(ctx, cx + eyeSpacing, eyeY - 1, eyeR * 0.4, rgba(c, 0.4));

  // Wide, open mouth
  const mouthY = cy + coreR * 0.3;
  drawArc(ctx, cx, mouthY, coreR * 0.32, Math.PI * 0.1, Math.PI * 0.9, rgba(c, 0.5), 2);

  // Floating sparkles
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.3;
    const d = R * (0.55 + Math.random() * 0.35);
    drawCircle(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5 + Math.random() * 2, rgba(c2, 0.3));
  }
}

function drawSchizoid(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Sparse, distant elements — large negative space
  const coreAlpha = 0.15 + (1 - s.avoidance) * 0.15;
  drawCircle(ctx, cx, cy, coreR, undefined, rgba(c, coreAlpha), 1);

  // Small, isolated core
  drawCircle(ctx, cx, cy, coreR * 0.2, rgba(c, 0.35));

  // Distant orbiting dots
  const orbitCount = 3 + Math.round(s.avoidance * 4);
  for (let i = 0; i < orbitCount; i++) {
    const orbitR = R * (0.6 + i * 0.12);
    const dotAngle = (Math.PI * 2 * i) / orbitCount + Math.PI * 0.25;
    drawCircle(ctx,
      cx + Math.cos(dotAngle) * orbitR,
      cy + Math.sin(dotAngle) * orbitR,
      2.5,
      rgba(c, 0.25 + (1 - s.avoidance) * 0.2),
      rgba(c, 0.15), 0.5
    );
  }

  // Eyes — distant, small
  const eyeSpacing = coreR * 0.4;
  const eyeY = cy - coreR * 0.1;
  drawCircle(ctx, cx - eyeSpacing, eyeY, 2, rgba(c, 0.4));
  drawCircle(ctx, cx + eyeSpacing, eyeY, 2, rgba(c, 0.4));

  // Flat mouth
  const mouthY = cy + coreR * 0.38;
  drawLine(ctx, cx - coreR * 0.2, mouthY, cx + coreR * 0.2, mouthY, rgba(c, 0.3), 0.8);

  // Thin, sparse rings
  if (s.avoidance > 0.5) {
    drawCircle(ctx, cx, cy, R * 0.7, undefined, rgba(c, 0.08), 0.5);
    drawCircle(ctx, cx, cy, R * 0.9, undefined, rgba(c, 0.05), 0.3);
  }
}

function drawNarcissistic(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Central dominating shape with mirror symmetry
  const mainR = coreR * (0.7 + (1 - s.selfEsteem) * 0.3);

  // Large central circle
  const centerGrad = ctx.createRadialGradient(cx, cy, mainR * 0.3, cx, cy, mainR);
  centerGrad.addColorStop(0, rgba(c, 0.45));
  centerGrad.addColorStop(1, rgba(c, 0.05));
  drawCircle(ctx, cx, cy, mainR, undefined, rgba(c, 0.4), 2.5);
  drawCircle(ctx, cx, cy, mainR, rgba(c, 0.08));

  // Mirror-symmetric side elements
  const sideCount = 4 + Math.round(s.sensitivity * 3);
  for (let side = 0; side < 2; side++) {
    const sign = side === 0 ? -1 : 1;
    for (let i = 0; i < sideCount; i++) {
      const angle = -Math.PI / 2 + (Math.PI * i) / (sideCount - 1);
      const dist = mainR * (0.35 + s.dependency * 0.25);
      const x = cx + Math.cos(angle) * dist * sign;
      const y = cy + Math.sin(angle) * dist - mainR * 0.15;
      const cr = 3 + s.sensitivity * 4;
      drawCircle(ctx, x, y, cr, rgba(c, 0.25), rgba(c, 0.35), 1);
    }
  }

  // Dominant eyes — centered and prominent
  const eyeSpacing = mainR * 0.3;
  const eyeY = cy - mainR * 0.15;
  drawCircle(ctx, cx - eyeSpacing, eyeY, 5, rgba(c, 0.7));
  drawCircle(ctx, cx + eyeSpacing, eyeY, 5, rgba(c, 0.7));

  // Confident half-smile
  const mouthY = cy + mainR * 0.3;
  drawArc(ctx, cx + mainR * 0.08, mouthY, mainR * 0.22, Math.PI * 0.15, Math.PI * 0.6, rgba(c, 0.5), 2);

  // Outer radiating lines (admiration)
  const rayCount = 10;
  for (let i = 0; i < rayCount; i++) {
    const a = (Math.PI * 2 * i) / rayCount;
    drawLine(ctx,
      cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR,
      cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85,
      rgba(c, 0.08), 0.8
    );
  }
}

function drawAntisocial(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string, c2: string
) {
  // Fragmented angular shapes, broken symmetry
  const fragCount = 6 + Math.round(s.emotionalRegulation * 6);
  for (let i = 0; i < fragCount; i++) {
    const angle = (Math.PI * 2 * i) / fragCount;
    const dist = R * (0.3 + Math.random() * 0.45);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const sz = 8 + Math.random() * 18;
    const rot = Math.random() * Math.PI;
    drawPolygon(ctx, x, y, sz, 3 + Math.floor(Math.random() * 3), rot,
      undefined, rgba(c, 0.2 + Math.random() * 0.3), 1.5);
  }

  // Broken central shape
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * coreR * 0.7, Math.sin(angle) * coreR * 0.7);
    ctx.strokeStyle = rgba(c, 0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Jagged periphery
  const jagCount = 14;
  ctx.beginPath();
  for (let i = 0; i <= jagCount; i++) {
    const a = (Math.PI * 2 * i) / jagCount;
    const r = R * (0.65 + (i % 3 === 0 ? 0.18 : 0.05));
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = rgba(c, 0.2);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Small, cold eyes
  const eyeSpacing = coreR * 0.35;
  const eyeY = cy - coreR * 0.15;
  drawPolygon(ctx, cx - eyeSpacing, eyeY, 4, 4, Math.PI / 4, rgba(c, 0.55), rgba(c, 0.7), 1);
  drawPolygon(ctx, cx + eyeSpacing, eyeY, 4, 4, Math.PI / 4, rgba(c, 0.55), rgba(c, 0.7), 1);

  // Asymmetric mouth
  const mouthY = cy + coreR * 0.35;
  drawLine(ctx, cx - coreR * 0.15, mouthY - 2, cx + coreR * 0.25, mouthY + 2, rgba(c, 0.4), 1.5);
}

function drawDefault(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, coreR: number,
  s: Record<DimensionKey, number>, c: string
) {
  drawCircle(ctx, cx, cy, coreR, undefined, rgba(c, 0.3), 2);
  drawCircle(ctx, cx, cy, coreR * 0.3, rgba(c, 0.2));
  const eyeSpacing = coreR * 0.38;
  const eyeY = cy - coreR * 0.12;
  drawCircle(ctx, cx - eyeSpacing, eyeY, 4, rgba(c, 0.6));
  drawCircle(ctx, cx + eyeSpacing, eyeY, 4, rgba(c, 0.6));
  const mouthY = cy + coreR * 0.35;
  drawLine(ctx, cx - coreR * 0.22, mouthY, cx + coreR * 0.22, mouthY, rgba(c, 0.4), 1.5);
}

// ─── React Component ──────────────────────────────────────────────────

export function PersonalityPortrait({
  dimensionScores,
  primaryType,
  secondaryType,
  confidence,
  size = 400,
}: PortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    drawPortrait(ctx, size, dimensionScores, primaryType, secondaryType, confidence);
  }, [dimensionScores, primaryType, secondaryType, confidence, size]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto"
      aria-label="人格抽象画像"
    />
  );
}

// ─── Export helper ───────────────────────────────────────────────────

export function exportPortrait(
  canvas: HTMLCanvasElement
): string | null {
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export function downloadPortrait(
  canvas: HTMLCanvasElement,
  filename: string = "personality-portrait.png"
) {
  const url = exportPortrait(canvas);
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
