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

// ─── Helpers ─────────────────────────────────────────────────────────

type C = CanvasRenderingContext2D;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgba(h: string, a: number) {
  const [r, g, b] = hexToRgb(h);
  return `rgba(${r},${g},${b},${a})`;
}

function lerpC(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
}

// ─── Drawing primitives ──────────────────────────────────────────────

function circ(ctx: C, x: number, y: number, r: number, fill?: string, stroke?: string, lw?: number) {
  ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0), 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw ?? 1; ctx.stroke(); }
}

function line(ctx: C, x1: number, y1: number, x2: number, y2: number, stroke: string, lw: number) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}

function arc(ctx: C, x: number, y: number, r: number, s: number, e: number, stroke: string, lw: number) {
  ctx.beginPath(); ctx.arc(x, y, r, s, e);
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}

function poly(ctx: C, cx: number, cy: number, r: number, sides: number, rot: number, fill?: string, stroke?: string, lw?: number) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rot + (Math.PI * 2 * i) / sides;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw ?? 1; ctx.stroke(); }
}

function bezier(ctx: C, pts: [number, number][], stroke: string, lw: number, fill?: string) {
  if (pts.length < 2) return;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 2) {
    if (i + 1 < pts.length) ctx.quadraticCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  }
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}

function glow(ctx: C, x: number, y: number, r: number, color: string, intensity: number) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, rgba(color, intensity));
  grad.addColorStop(0.4, rgba(color, intensity * 0.4));
  grad.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = grad; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Seeded pseudo-random for consistent shapes
function srand(seed: number) { return ((seed * 16807 + 0) % 2147483647) / 2147483647; }

// ─── Type-specific draw functions ────────────────────────────────────

function drawAvoidant(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const av = s.avoidance, sa = s.socialAnxiety, se = s.sensitivity;

  // Protective layered shells — many concentric rings fading outward
  const shells = 8 + Math.round(av * 10);
  for (let i = 0; i < shells; i++) {
    const r = cr * 0.4 + (R * 1.3 - cr * 0.4) * (i / shells);
    const alpha = 0.15 - (i / shells) * 0.12;
    circ(ctx, cx, cy, r, undefined, rgba(c, Math.max(alpha, 0.02)), 0.5 + (se * 1.5 * (1 - i / shells)));
  }

  // Inward-pointing delicate lines — like a sea anemone retreating
  const spines = 20 + Math.round(sa * 16);
  for (let i = 0; i < spines; i++) {
    const angle = (Math.PI * 2 * i) / spines + srand(i * 7) * 0.3;
    const outer = R * (0.7 + srand(i * 13) * 0.4);
    const inner = cr * (0.3 + srand(i * 17) * 0.3);
    line(ctx, cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer,
      cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner,
      rgba(c, 0.06 + av * 0.1), 0.5 + srand(i * 3) * 1);
  }

  // Small clustered eyes — close together, inward
  const eyeGap = cr * (0.2 - sa * 0.1);
  const eyeY = cy - cr * 0.2;
  circ(ctx, cx - eyeGap, eyeY, 3 + sa * 2, rgba(c, 0.6));
  circ(ctx, cx + eyeGap, eyeY, 3 + sa * 2, rgba(c, 0.6));

  // Tentative mouth — a faint broken arc
  const my = cy + cr * 0.35;
  arc(ctx, cx, my, cr * 0.15, Math.PI * 0.2, Math.PI * 0.8, rgba(c, 0.3 + sa * 0.2), 1);

  // Scattered distant particles — like people kept at arm's length
  const particles = 15 + Math.round(av * 20);
  for (let i = 0; i < particles; i++) {
    const a = (Math.PI * 2 * i) / particles + srand(i) * 0.5;
    const d = R * (0.75 + av * 0.4 + srand(i * 11) * 0.3);
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5 + srand(i) * 2.5, rgba(c, 0.1 + srand(i * 5) * 0.15));
  }
}

function drawBorderline(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const er = s.emotionalRegulation, se = s.sensitivity;

  // Intense swirling vortex of emotions
  const swirls = 5 + Math.round(er * 6);
  for (let sw = 0; sw < swirls; sw++) {
    const baseA = (Math.PI * 2 * sw) / swirls;
    const pts: [number, number][] = [];
    const segs = 16;
    for (let j = 0; j <= segs; j++) {
      const t = j / segs;
      const a = baseA + t * Math.PI * (0.6 + er * 0.5);
      const r = cr * 0.3 + R * 0.7 * t + Math.sin(t * Math.PI * 3 + sw) * R * 0.2 * er;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    bezier(ctx, pts, rgba(c, 0.15 + er * 0.3), 1 + er * 3, undefined);
  }

  // Emotional burst particles — scattered intensely
  const burst = 20 + Math.round(se * 20);
  for (let i = 0; i < burst; i++) {
    const a = (Math.PI * 2 * i) / burst + srand(i * 19) * 0.4;
    const d = R * (0.2 + srand(i * 7) * 0.8);
    const sz = 1 + srand(i * 3) * 5 * se;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, rgba(c2, 0.1 + srand(i * 11) * 0.35));
  }

  // Asymmetric eyes — emotional turbulence
  const eyeGap = cr * 0.35;
  const lEyeY = cy - cr * 0.2 - er * 12;
  const rEyeY = cy - cr * 0.15 + er * 8;
  circ(ctx, cx - eyeGap, lEyeY, 5 + se * 5, rgba(c, 0.7));
  circ(ctx, cx + eyeGap, rEyeY, 4 + er * 5, rgba(c2, 0.55));

  // Wavy expressive mouth
  const my = cy + cr * 0.3;
  const mw = cr * 0.35;
  bezier(ctx, [
    [cx - mw, my], [cx - mw * 0.5, my + er * 14], [cx, my - er * 10],
    [cx + mw * 0.5, my + er * 12], [cx + mw, my],
  ], rgba(c, 0.6), 2.5);

  // Intense glow core
  glow(ctx, cx, cy, cr * 0.5, c, 0.2 + er * 0.25);
}

function drawDependent(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const dp = s.dependency, es = s.selfEsteem;

  // Interlocking orbiting nodes — like a molecule
  const nodes = 5 + Math.round(dp * 6);
  const nodePos: [number, number, number][] = [];
  for (let i = 0; i < nodes; i++) {
    const a = (Math.PI * 2 * i) / nodes;
    const d = cr * (0.3 + dp * 0.4);
    const nr = cr * (0.2 + 0.25 / (i + 2));
    nodePos.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d, nr]);
  }

  // Draw connection web between all nodes
  for (let i = 0; i < nodePos.length; i++) {
    for (let j = i + 1; j < nodePos.length; j++) {
      line(ctx, nodePos[i][0], nodePos[i][1], nodePos[j][0], nodePos[j][1],
        rgba(c, 0.08 + dp * 0.15), 0.6 + dp * 1.5);
    }
  }

  // Draw the nodes themselves
  for (const [nx, ny, nr] of nodePos) {
    circ(ctx, nx, ny, nr, rgba(c, 0.08), rgba(c, 0.3 + dp * 0.2), 1.5);
  }

  // Central warm core
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 0.3);
  coreGrad.addColorStop(0, rgba(c, 0.4));
  coreGrad.addColorStop(1, rgba(c, 0.02));
  circ(ctx, cx, cy, cr * 0.3, undefined, rgba(c, 0.3), 2);
  ctx.fillStyle = coreGrad; circ(ctx, cx, cy, cr * 0.3, undefined, undefined, 0);

  // Soft trusting eyes
  const eyeGap = cr * 0.35;
  const eyeY = cy - cr * 0.1;
  circ(ctx, cx - eyeGap, eyeY, 5 + (1 - es) * 4, rgba(c, 0.55));
  circ(ctx, cx + eyeGap, eyeY, 5 + (1 - es) * 4, rgba(c, 0.55));

  // Gentle smile arc
  arc(ctx, cx, cy + cr * 0.3, cr * 0.22, Math.PI * 0.2, Math.PI * 0.8, rgba(c, 0.4), 2);

  // Outer orbiting particles — connections reaching out
  const outer = 8 + Math.round(dp * 8);
  for (let i = 0; i < outer; i++) {
    const a = (Math.PI * 2 * i) / outer;
    const d = R * (0.5 + dp * 0.4);
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 2, rgba(c2, 0.2), rgba(c, 0.15), 0.8);
  }
}

function drawObsessive(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const er = s.emotionalRegulation;

  // Mandala-like geometric grid
  const rings = 5;
  for (let r = 0; r < rings; r++) {
    const radius = cr * 0.3 + (R * 0.8) * (r / rings);
    circ(ctx, cx, cy, radius, undefined, rgba(c, 0.06 + r * 0.04), 0.5 + r * 0.3);
  }

  // Radial symmetry lines
  const radials = 12 + Math.round((1 - er) * 8);
  for (let i = 0; i < radials; i++) {
    const a = (Math.PI * 2 * i) / radials;
    line(ctx, cx + Math.cos(a) * cr * 0.2, cy + Math.sin(a) * cr * 0.2,
      cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8, rgba(c, 0.05), 0.5);
  }

  // Central crystalline polygon
  poly(ctx, cx, cy, cr * 0.55, 8, Math.PI / 8, undefined, rgba(c, 0.35), 2.5);

  // Inner precision dots at grid intersections
  const grid = 5;
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const x = cx - R * 0.45 + (R * 0.9 * col) / (grid - 1);
      const y = cy - R * 0.45 + (R * 0.9 * row) / (grid - 1);
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < R * 0.6) {
        circ(ctx, x, y, 1.2, rgba(c, 0.2 + (row + col) % 3 * 0.08));
      }
    }
  }

  // Perfectly symmetric square eyes
  const eyeGap = cr * 0.38;
  const eyeY = cy - cr * 0.1;
  poly(ctx, cx - eyeGap, eyeY, 4 + er * 2, 4, Math.PI / 4, rgba(c, 0.15), rgba(c, 0.6), 1.5);
  poly(ctx, cx + eyeGap, eyeY, 4 + er * 2, 4, Math.PI / 4, rgba(c, 0.15), rgba(c, 0.6), 1.5);

  // Precise straight mouth
  line(ctx, cx - cr * 0.22, cy + cr * 0.35, cx + cr * 0.22, cy + cr * 0.35, rgba(c, 0.45), 1.8);
}

function drawParanoid(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const se = s.sensitivity, sa = s.socialAnxiety;

  // Defensive perimeter — multiple watchful rings
  for (let i = 0; i < 3; i++) {
    const r = R * (0.65 + i * 0.13);
    const dashes = 20 + i * 8;
    for (let j = 0; j < dashes; j++) {
      const a = (Math.PI * 2 * j) / dashes;
      const a2 = a + Math.PI / dashes;
      arc(ctx, cx, cy, r, a, a2, rgba(c, 0.15 + i * 0.08), 1.5 + i);
    }
  }

  // Sharp triangular sentinel elements
  const tris = 8 + Math.round(se * 14);
  for (let i = 0; i < tris; i++) {
    const a = (Math.PI * 2 * i) / tris - Math.PI / 2;
    const d = R * (0.5 + se * 0.35);
    const sz = 8 + se * 14;
    poly(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, 3, a + Math.PI,
      rgba(c, 0.04), rgba(c, 0.25 + se * 0.2), 1.8);
  }

  // Scanning radar lines
  const scans = 3;
  for (let i = 0; i < scans; i++) {
    const a = Math.PI * 0.25 + i * Math.PI * 0.4;
    line(ctx, cx, cy, cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85, rgba(c, 0.1), 1);
  }

  // Small vigilant eyes
  const eyeGap = cr * 0.32;
  const eyeY = cy - cr * 0.18;
  circ(ctx, cx - eyeGap, eyeY, 3 + sa * 3, rgba(c, 0.7));
  circ(ctx, cx + eyeGap, eyeY, 3 + sa * 3, rgba(c, 0.7));

  // Taut suspicious mouth
  line(ctx, cx - cr * 0.2, cy + cr * 0.38, cx + cr * 0.2, cy + cr * 0.38, rgba(c, 0.45), 1.5);

  // Watchful dots around perimeter
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16;
    circ(ctx, cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82, 1.8, rgba(c, 0.3));
  }
}

function drawHistrionic(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const dp = s.dependency, se = s.sensitivity;

  // Radiant starburst — dramatic outward energy
  const rays = 16 + Math.round(dp * 10);
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    const inner = cr * 0.4;
    const outer = R * (0.6 + dp * 0.45);
    const grad = ctx.createLinearGradient(
      cx + Math.cos(a) * inner, cy + Math.sin(a) * inner,
      cx + Math.cos(a) * outer, cy + Math.sin(a) * outer
    );
    grad.addColorStop(0, rgba(c, 0.5));
    grad.addColorStop(0.5, rgba(c2, 0.2));
    grad.addColorStop(1, rgba(c, 0));
    line(ctx, cx + Math.cos(a) * inner, cy + Math.sin(a) * inner,
      cx + Math.cos(a) * outer, cy + Math.sin(a) * outer, rgba(c, 0.2 + dp * 0.2), 1.5);
  }

  // Spotlight glow
  glow(ctx, cx, cy, R * 0.9, c, 0.1 + dp * 0.15);

  // Big expressive eyes
  const eyeGap = cr * 0.38;
  const eyeY = cy - cr * 0.12;
  circ(ctx, cx - eyeGap, eyeY, 7 + se * 4, rgba(c, 0.5));
  circ(ctx, cx + eyeGap, eyeY, 7 + se * 4, rgba(c, 0.5));
  // eye highlights
  circ(ctx, cx - eyeGap - 1, eyeY - 1, 2, rgba(c, 0.3));
  circ(ctx, cx + eyeGap - 1, eyeY - 1, 2, rgba(c, 0.3));

  // Wide dramatic mouth
  arc(ctx, cx, cy + cr * 0.28, cr * 0.3, Math.PI * 0.1, Math.PI * 0.9, rgba(c, 0.5), 2.5);

  // Sparkle particles — like stage glitter
  const sparkles = 20;
  for (let i = 0; i < sparkles; i++) {
    const a = (Math.PI * 2 * i) / sparkles + srand(i * 23) * 0.3;
    const d = R * (0.3 + srand(i * 7) * 0.65);
    const sz = 1 + srand(i * 3) * 3;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, rgba(c2, 0.2 + srand(i * 5) * 0.3));
  }
}

function drawSchizoid(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const av = s.avoidance;

  // Vast empty space — minimalism
  // Single small core
  circ(ctx, cx, cy, cr * 0.15, rgba(c, 0.3), rgba(c, 0.15), 1);

  // Very thin distant ring
  circ(ctx, cx, cy, R * 0.75, undefined, rgba(c, 0.06), 0.5);

  // Sparse orbiting elements — very far apart
  const orbits = 3 + Math.round(av * 3);
  for (let i = 0; i < orbits; i++) {
    const orbitR = R * (0.55 + i * 0.15);
    const a = (Math.PI * 2 * i) / orbits + Math.PI * 0.3;
    circ(ctx, cx + Math.cos(a) * orbitR, cy + Math.sin(a) * orbitR, 2.5, rgba(c, 0.2));
    // Very thin orbit trails
    arc(ctx, cx, cy, orbitR, 0, Math.PI * 2, rgba(c, 0.03), 0.3);
  }

  // Distant tiny eyes
  const eyeGap = cr * 0.42;
  circ(ctx, cx - eyeGap, cy - cr * 0.08, 2, rgba(c, 0.3));
  circ(ctx, cx + eyeGap, cy - cr * 0.08, 2, rgba(c, 0.3));

  // Flat emotionless line
  line(ctx, cx - cr * 0.18, cy + cr * 0.4, cx + cr * 0.18, cy + cr * 0.4, rgba(c, 0.2), 0.8);

  // Faint constellation dots — isolated stars
  for (let i = 0; i < 5; i++) {
    const a = srand(i * 31) * Math.PI * 2;
    const d = R * (0.5 + srand(i * 17) * 0.45);
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1, rgba(c, 0.12));
  }
}

function drawNarcissistic(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const es = s.selfEsteem, se = s.sensitivity;

  // Large dominating central circle
  const mainR = cr * (0.5 + (1 - es) * 0.35);
  const coreGrad = ctx.createRadialGradient(cx, cy, mainR * 0.2, cx, cy, mainR);
  coreGrad.addColorStop(0, rgba(c, 0.5));
  coreGrad.addColorStop(0.5, rgba(c, 0.15));
  coreGrad.addColorStop(1, rgba(c, 0.02));
  circ(ctx, cx, cy, mainR, undefined, rgba(c, 0.45), 3);
  ctx.fillStyle = coreGrad; circ(ctx, cx, cy, mainR, undefined, undefined, 0);

  // Crown-like radiating spikes
  const spikes = 8 + Math.round(se * 6);
  for (let i = 0; i < spikes; i++) {
    const a = (Math.PI * 2 * i) / spikes - Math.PI / 2;
    const inner = mainR * 0.85;
    const outer = mainR * 1.4 + se * 20;
    line(ctx, cx + Math.cos(a) * inner, cy + Math.sin(a) * inner,
      cx + Math.cos(a) * outer, cy + Math.sin(a) * outer, rgba(c, 0.25), 2 + se * 3);
  }

  // Mirror-symmetric side elements
  for (let side = 0; side < 2; side++) {
    const sx = side === 0 ? -1 : 1;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / 4;
      const d = mainR * 0.45;
      circ(ctx, cx + Math.cos(a) * d * sx, cy + Math.sin(a) * d * 1.3, 4 + se * 3,
        rgba(c, 0.15), rgba(c, 0.3), 1);
    }
  }

  // Confident prominent eyes
  const eyeGap = mainR * 0.28;
  const eyeY = cy - mainR * 0.15;
  circ(ctx, cx - eyeGap, eyeY, 6, rgba(c, 0.6));
  circ(ctx, cx + eyeGap, eyeY, 6, rgba(c, 0.6));

  // Superior half-smile
  arc(ctx, cx + mainR * 0.08, cy + mainR * 0.28, mainR * 0.2, Math.PI * 0.12, Math.PI * 0.55, rgba(c, 0.5), 2.5);

  // Admiration rays
  for (let i = 0; i < 24; i++) {
    const a = (Math.PI * 2 * i) / 24;
    line(ctx, cx + Math.cos(a) * mainR, cy + Math.sin(a) * mainR,
      cx + Math.cos(a) * R * 0.9, cy + Math.sin(a) * R * 0.9, rgba(c, 0.04), 0.6);
  }
}

function drawAntisocial(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const er = s.emotionalRegulation;

  // Shattered glass effect — fragmentation
  const frags = 14 + Math.round(er * 12);
  for (let i = 0; i < frags; i++) {
    const a = (Math.PI * 2 * i) / frags + srand(i * 13) * 0.5;
    const d = R * (0.25 + srand(i * 7) * 0.6);
    const sz = 6 + srand(i * 3) * 22;
    const sides = 3 + Math.floor(srand(i * 19) * 3);
    const rot = srand(i * 11) * Math.PI;
    const alpha = 0.08 + srand(i * 5) * 0.25;
    poly(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, sides, rot,
      undefined, rgba(c, alpha), 1.5 + srand(i) * 1.5);
  }

  // Broken central asymmetry
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 + srand(i * 31) * 0.4;
    const len = cr * (0.3 + srand(i * 17) * 0.5);
    const endX = Math.cos(a) * len;
    const endY = Math.sin(a) * len;
    line(ctx, 0, 0, endX, endY, rgba(c, 0.3), 1.5);
    // Fragmented end pieces
    circ(ctx, endX, endY, 2 + srand(i * 7) * 3, undefined, rgba(c, 0.3), 1);
  }
  ctx.restore();

  // Jagged outer boundary — irregular broken ring
  ctx.beginPath();
  const jagPts = 16;
  for (let i = 0; i <= jagPts; i++) {
    const a = (Math.PI * 2 * i) / jagPts;
    const r = R * (0.6 + (i % 2 === 0 ? 0.2 : -0.05) + srand(i * 23) * 0.1);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = rgba(c, 0.2); ctx.lineWidth = 1.5; ctx.stroke();

  // Cold angular eyes
  const eyeGap = cr * 0.33;
  const eyeY = cy - cr * 0.15;
  poly(ctx, cx - eyeGap, eyeY, 5, 4, Math.PI / 4, rgba(c, 0.5), rgba(c, 0.6), 1.2);
  poly(ctx, cx + eyeGap, eyeY, 5, 4, Math.PI / 4, rgba(c, 0.5), rgba(c, 0.6), 1.2);

  // Asymmetric sneer
  line(ctx, cx - cr * 0.12, cy + cr * 0.32, cx + cr * 0.28, cy + cr * 0.4, rgba(c, 0.35), 1.8);
}

function drawAnxious(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const sa = s.socialAnxiety, er = s.emotionalRegulation;

  // Trembling vibration rings — concentric but irregular
  const rings = 6 + Math.round(er * 5);
  for (let i = 0; i < rings; i++) {
    const baseR = cr * 0.3 + (R * 0.85) * (i / rings);
    // Jittery irregular ring
    ctx.beginPath();
    const pts = 40;
    for (let j = 0; j <= pts; j++) {
      const a = (Math.PI * 2 * j) / pts;
      const jitter = srand(j * 37 + i * 13) * R * 0.06 * er;
      const r = baseR + jitter;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = rgba(c, 0.08 + i * 0.04); ctx.lineWidth = 0.7; ctx.stroke();
  }

  // Busy scattered particles — anxious energy
  const busy = 30 + Math.round(sa * 25);
  for (let i = 0; i < busy; i++) {
    const a = srand(i * 41) * Math.PI * 2;
    const d = R * (0.3 + srand(i * 17) * 0.7);
    const sz = 0.8 + srand(i * 3) * 3;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, rgba(c, 0.08 + srand(i * 7) * 0.2));
  }

  // Tightly clustered eye area — worry lines around eyes
  const eyeGap = cr * 0.28 - sa * 0.12;
  const eyeY = cy - cr * 0.2;
  for (let s = -1; s <= 1; s += 2) {
    // Worry lines around each eye
    for (let w = 0; w < 3; w++) {
      arc(ctx, cx + s * eyeGap, eyeY, 4 + w * 2.5, -Math.PI * 0.4, Math.PI * 0.4, rgba(c, 0.2), 0.5);
    }
    circ(ctx, cx + s * eyeGap, eyeY, 3.5 + sa * 2, rgba(c, 0.55));
    // Eye glow — alert
    circ(ctx, cx + s * eyeGap, eyeY, 2, rgba(c, 0.7));
  }

  // Tense tight mouth
  line(ctx, cx - cr * 0.15, cy + cr * 0.33, cx + cr * 0.15, cy + cr * 0.33, rgba(c, 0.4), 1.2);

  // Jitter lines — quick tense strokes around the composition
  for (let i = 0; i < 12; i++) {
    const a1 = srand(i * 53) * Math.PI * 2;
    const a2 = a1 + srand(i * 59) * 0.4 - 0.2;
    const d1 = R * (0.55 + srand(i * 23) * 0.3);
    const d2 = R * (0.6 + srand(i * 29) * 0.25);
    line(ctx, cx + Math.cos(a1) * d1, cy + Math.sin(a1) * d1,
      cx + Math.cos(a2) * d2, cy + Math.sin(a2) * d2, rgba(c, 0.1), 0.6);
  }
}

function drawDepressive(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const es = s.selfEsteem;

  // Heavy descending shapes — gravitational pull downward
  const drops = 6 + Math.round(es * 8);
  for (let i = 0; i < drops; i++) {
    const x = cx + (srand(i * 31) - 0.5) * R * 1.2;
    const y = cy + srand(i * 17) * R * 0.8;
    const sz = cr * (0.05 + srand(i * 7) * 0.2 * es);
    // Teardrop-like shapes falling down
    const grad = ctx.createRadialGradient(x, y - sz * 0.3, 0, x, y + sz, sz * 1.5);
    grad.addColorStop(0, rgba(c, 0.25));
    grad.addColorStop(1, rgba(c, 0));
    circ(ctx, x, y, sz, undefined, rgba(c, 0.15 + es * 0.15), 1);
    circ(ctx, x, y + sz * 0.7, sz * 0.6, rgba(c, 0.12));
  }

  // Low heavy core — weighted and sunken
  const coreY = cy + R * 0.08 * es;
  circ(ctx, cx, coreY, cr * 0.35, rgba(c, 0.1), rgba(c, 0.25), 2);

  // Drooping curves — like wilting plants
  for (let side = -1; side <= 1; side += 2) {
    const pts: [number, number][] = [];
    for (let j = 0; j <= 6; j++) {
      const t = j / 6;
      const x = cx + side * cr * 0.3 * (1 - t * 0.6);
      const y = cy - cr * 0.2 + t * cr * 0.7 + t * t * R * 0.3 * es;
      pts.push([x, y]);
    }
    bezier(ctx, pts, rgba(c, 0.3 + es * 0.2), 1.5);
  }

  // Downcast eyes — looking down and heavy
  const eyeGap = cr * 0.38;
  const eyeY = cy - cr * 0.05;
  // Heavy lids
  arc(ctx, cx - eyeGap, eyeY, 6, -Math.PI * 0.15, Math.PI * 0.15, rgba(c, 0.55), 2);
  arc(ctx, cx + eyeGap, eyeY, 6, -Math.PI * 0.15, Math.PI * 0.15, rgba(c, 0.55), 2);

  // Downturned mouth
  arc(ctx, cx, cy + cr * 0.42, cr * 0.18, Math.PI * 1.1, Math.PI * 1.9, rgba(c, 0.4), 1.8);

  // Faint gray overlay haze
  const haze = ctx.createRadialGradient(cx, cy - R * 0.15, 0, cx, cy, R);
  haze.addColorStop(0, rgba(c, 0.03));
  haze.addColorStop(1, rgba(c, 0.08));
  ctx.fillStyle = haze; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
}

function drawImpulsive(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const er = s.emotionalRegulation;

  // Explosive burst — chaotic energy radiating from center
  const explosions = 6 + Math.round(er * 8);
  for (let e = 0; e < explosions; e++) {
    const baseA = srand(e * 47) * Math.PI * 2;
    const pts: [number, number][] = [];
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      const a = baseA + (srand(e * 13 + j) - 0.5) * 1.2;
      const r = cr * 0.15 + t * R * (0.5 + er * 0.5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    bezier(ctx, pts, rgba(c, 0.2 + er * 0.3), 2 + er * 4, undefined);
  }

  // Splatter particles — like paint thrown
  const splats = 25 + Math.round(er * 20);
  for (let i = 0; i < splats; i++) {
    const a = srand(i * 39) * Math.PI * 2;
    const d = R * (0.15 + srand(i * 11) * 0.85);
    const sz = 2 + srand(i * 7) * 8 * er;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, rgba(c2, 0.15 + srand(i * 3) * 0.35));
  }

  // No containment — elements break through boundaries
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8 + srand(i * 29) * 0.5;
    line(ctx, cx, cy, cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * 1.05, rgba(c, 0.2), 2);
  }

  // Wide intense eyes — dilated
  const eyeGap = cr * 0.35;
  const eyeY = cy - cr * 0.18;
  circ(ctx, cx - eyeGap, eyeY, 6 + er * 4, rgba(c, 0.55));
  circ(ctx, cx + eyeGap, eyeY, 6 + er * 4, rgba(c, 0.55));
  // Dilated pupils
  circ(ctx, cx - eyeGap, eyeY, 3 + er * 2, rgba(c, 0.7));
  circ(ctx, cx + eyeGap, eyeY, 3 + er * 2, rgba(c, 0.7));

  // Open shouting mouth
  const my = cy + cr * 0.3;
  circ(ctx, cx, my, cr * 0.15 + er * 0.15, rgba(c, 0.2), rgba(c, 0.5), 2);
}

function drawPassiveAggressive(ctx: C, cx: number, cy: number, R: number, cr: number,
  s: Record<DimensionKey, number>, c: string, c2: string) {
  const se = s.sensitivity, es = s.selfEsteem;

  // Sweet exterior — soft rounded shapes
  circ(ctx, cx, cy, cr * 0.65, rgba(c, 0.04), rgba(c, 0.2), 2);
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const d = cr * 0.5;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, cr * 0.12, rgba(c, 0.06), rgba(c, 0.12), 1);
  }

  // But hidden sharp elements underneath — barbed wire coils
  const coils = 5 + Math.round(se * 8);
  for (let i = 0; i < coils; i++) {
    const baseA = (Math.PI * 2 * i) / coils;
    const d = R * (0.4 + se * 0.35);
    const pts: [number, number][] = [];
    for (let j = 0; j <= 10; j++) {
      const t = j / 10;
      const a = baseA + t * Math.PI * 1.5;
      const r = d * (0.6 + t * 0.4);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    bezier(ctx, pts, rgba(c2, 0.15 + se * 0.2), 1.5 + se * 2);
  }

  // Thorn-like spikes hidden among soft shapes
  const thorns = 8 + Math.round(se * 10);
  for (let i = 0; i < thorns; i++) {
    const a = (Math.PI * 2 * i) / thorns;
    const inner = R * (0.4 + srand(i * 13) * 0.15);
    const outer = inner + 12 + se * 20;
    line(ctx, cx + Math.cos(a) * inner, cy + Math.sin(a) * inner,
      cx + Math.cos(a) * outer, cy + Math.sin(a) * outer, rgba(c, 0.1 + se * 0.15), 1);
  }

  // Smiling eyes — curved but tight
  const eyeGap = cr * 0.36;
  const eyeY = cy - cr * 0.15;
  arc(ctx, cx - eyeGap, eyeY - 2, 5, -Math.PI * 0.5, Math.PI * 0.1, rgba(c, 0.5), 2);
  arc(ctx, cx + eyeGap, eyeY - 2, 5, -Math.PI * 0.1, Math.PI * 0.5, rgba(c, 0.5), 2);

  // Sweet smile on surface
  arc(ctx, cx, cy + cr * 0.3, cr * 0.2, Math.PI * 0.18, Math.PI * 0.82, rgba(c, 0.4), 2);

  // But with hidden sharp corners underneath
  poly(ctx, cx, cy + cr * 0.42, cr * 0.12 + se * 0.1, 3, Math.PI, undefined, rgba(c, 0.2 + se * 0.2), 1.2);

  // Passive resistance "bubbles" — like trapped frustration
  for (let i = 0; i < 6; i++) {
    const a = srand(i * 61) * Math.PI * 2;
    const d = R * (0.5 + srand(i * 19) * 0.35);
    const sz = 3 + srand(i * 13) * 5;
    circ(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, sz, undefined, rgba(c2, 0.12 + se * 0.15), 1);
  }
}

// ─── Default fallback ────────────────────────────────────────────────

function drawDefault(ctx: C, cx: number, cy: number, R: number, cr: number,
  _s: Record<DimensionKey, number>, c: string) {
  circ(ctx, cx, cy, cr, undefined, rgba(c, 0.3), 2);
  circ(ctx, cx, cy, cr * 0.3, rgba(c, 0.2));
  const eg = cr * 0.38;
  circ(ctx, cx - eg, cy - cr * 0.12, 4, rgba(c, 0.6));
  circ(ctx, cx + eg, cy - cr * 0.12, 4, rgba(c, 0.6));
  line(ctx, cx - cr * 0.22, cy + cr * 0.35, cx + cr * 0.22, cy + cr * 0.35, rgba(c, 0.4), 1.5);
}

// ─── Main orchestrator ───────────────────────────────────────────────

function drawPortrait(
  ctx: C, size: number,
  scores: Record<DimensionKey, number>,
  primaryType: string,
  secondaryType: string | undefined,
  confidence: number
) {
  const W = size, H = size, cx = W / 2, cy = H / 2, R = size * 0.38;
  const personality = getPersonalityBySlug(primaryType);
  const secondary = secondaryType ? getPersonalityBySlug(secondaryType) : undefined;
  const color = personality?.color ?? "#6C5CE7";
  const color2 = secondary?.color ?? color;

  const es = scores.selfEsteem;
  const coreR = R * (0.5 + es * 0.45);

  ctx.clearRect(0, 0, W, H);

  // Background atmosphere
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
  bgGrad.addColorStop(0, rgba(color, 0.06));
  bgGrad.addColorStop(0.6, rgba(color, 0.02));
  bgGrad.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  // Subtle secondary color influence in background
  if (secondary) {
    const secGrad = ctx.createRadialGradient(cx + R * 0.3, cy - R * 0.2, 0, cx, cy, R * 1.5);
    secGrad.addColorStop(0, rgba(color2, 0.03));
    secGrad.addColorStop(1, rgba(color2, 0));
    ctx.fillStyle = secGrad; ctx.fillRect(0, 0, W, H);
  }

  // Confidence ring
  if (confidence > 0.4) {
    const ringAlpha = 0.1 + confidence * 0.2;
    const ringWidth = 1.5 + confidence * 3;
    circ(ctx, cx, cy, R + 14, undefined, rgba(color, ringAlpha), ringWidth);
  }
  if (confidence > 0.65) {
    circ(ctx, cx, cy, R + 20, undefined, rgba(color2, 0.06 + confidence * 0.1), 1 + confidence * 1.5);
  }

  // Dispatch to type-specific renderer
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
    case "anxious": drawAnxious(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "depressive": drawDepressive(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "impulsive": drawImpulsive(ctx, cx, cy, R, coreR, scores, color, color2); break;
    case "passive-aggressive": drawPassiveAggressive(ctx, cx, cy, R, coreR, scores, color, color2); break;
    default: drawDefault(ctx, cx, cy, R, coreR, scores, color); break;
  }
}

// ─── React Component ──────────────────────────────────────────────────

export function PersonalityPortrait({
  dimensionScores, primaryType, secondaryType, confidence, size = 400,
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

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} width={size} height={size} className="mx-auto" aria-label="人格抽象画像" />
  );
}

// ─── Export helpers ───────────────────────────────────────────────────

export function exportPortrait(canvas: HTMLCanvasElement): string | null {
  try { return canvas.toDataURL("image/png"); } catch { return null; }
}

export function downloadPortrait(canvas: HTMLCanvasElement, filename = "personality-portrait.png") {
  const url = exportPortrait(canvas);
  if (!url) return;
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
