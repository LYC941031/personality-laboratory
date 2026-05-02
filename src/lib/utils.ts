import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTypeColor(slug: string): string {
  const colorMap: Record<string, string> = {
    avoidant: "var(--color-avoidant)",
    borderline: "var(--color-borderline)",
    dependent: "var(--color-dependent)",
    obsessive: "var(--color-obsessive)",
    paranoid: "var(--color-paranoid)",
    histrionic: "var(--color-histrionic)",
    schizoid: "var(--color-schizoid)",
    narcissistic: "var(--color-narcissistic)",
    antisocial: "var(--color-antisocial)",
  };
  return colorMap[slug] || "var(--color-primary)";
}

export function getTypeColorClass(slug: string): string {
  const classMap: Record<string, string> = {
    avoidant: "bg-[var(--color-avoidant)]",
    borderline: "bg-[var(--color-borderline)]",
    dependent: "bg-[var(--color-dependent)]",
    obsessive: "bg-[var(--color-obsessive)]",
    paranoid: "bg-[var(--color-paranoid)]",
    histrionic: "bg-[var(--color-histrionic)]",
    schizoid: "bg-[var(--color-schizoid)]",
    narcissistic: "bg-[var(--color-narcissistic)]",
    antisocial: "bg-[var(--color-antisocial)]",
  };
  return classMap[slug] || "bg-[var(--color-primary)]";
}

export function getTypeBorderClass(slug: string): string {
  const classMap: Record<string, string> = {
    avoidant: "border-[var(--color-avoidant)]",
    borderline: "border-[var(--color-borderline)]",
    dependent: "border-[var(--color-dependent)]",
    obsessive: "border-[var(--color-obsessive)]",
    paranoid: "border-[var(--color-paranoid)]",
    histrionic: "border-[var(--color-histrionic)]",
    schizoid: "border-[var(--color-schizoid)]",
    narcissistic: "border-[var(--color-narcissistic)]",
    antisocial: "border-[var(--color-antisocial)]",
  };
  return classMap[slug] || "border-[var(--color-primary)]";
}

export function getTypeTextClass(slug: string): string {
  const classMap: Record<string, string> = {
    avoidant: "text-[var(--color-avoidant)]",
    borderline: "text-[var(--color-borderline)]",
    dependent: "text-[var(--color-dependent)]",
    obsessive: "text-[var(--color-obsessive)]",
    paranoid: "text-[var(--color-paranoid)]",
    histrionic: "text-[var(--color-histrionic)]",
    schizoid: "text-[var(--color-schizoid)]",
    narcissistic: "text-[var(--color-narcissistic)]",
    antisocial: "text-[var(--color-antisocial)]",
  };
  return classMap[slug] || "text-[var(--color-primary)]";
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}秒`;
  return `${mins}分${secs}秒`;
}
