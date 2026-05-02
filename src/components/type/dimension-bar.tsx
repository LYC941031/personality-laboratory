"use client";

import { motion } from "framer-motion";
import { DIMENSIONS, type DimensionKey } from "@/../data/dimensions";

interface DimensionBarProps {
  dimensionKey: DimensionKey;
  userScore: number;
  typicalScore: number;
  index: number;
}

export function DimensionBar({
  dimensionKey,
  userScore,
  typicalScore,
  index,
}: DimensionBarProps) {
  const dim = DIMENSIONS.find((d) => d.key === dimensionKey);
  if (!dim) return null;

  const userPercent = Math.round(userScore * 100);
  const typicalPercent = Math.round(typicalScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">
            {dim.label}
          </span>
          <span className="text-xs text-muted ml-2">{dim.labelEn}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {userPercent}%
        </span>
      </div>

      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: dim.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${userPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
        />
        {/* Typical marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
          style={{ left: `${typicalPercent}%` }}
        />
      </div>

      <p className="text-xs text-muted">{dim.description}</p>
    </motion.div>
  );
}
