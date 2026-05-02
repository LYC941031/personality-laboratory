"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DIMENSIONS, type DimensionKey } from "@/../data/dimensions";
import { getPersonalityBySlug } from "@/../data/personalities";

interface ResultChartProps {
  dimensionScores: Record<DimensionKey, number>;
  primaryType: string;
}

export function ResultRadarChart({
  dimensionScores,
  primaryType,
}: ResultChartProps) {
  const personality = getPersonalityBySlug(primaryType);

  const data = DIMENSIONS.map((dim) => ({
    dimension: dim.label,
    yourScore: Math.round(dimensionScores[dim.key] * 100),
    typicalScore: personality
      ? Math.round(personality.dimensions[dim.key] * 100)
      : 0,
  }));

  return (
    <div className="w-full h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <Radar
            name="你的得分"
            dataKey="yourScore"
            stroke="#6C5CE7"
            fill="#6C5CE7"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {personality && (
            <Radar
              name={`${personality.name}典型画像`}
              dataKey="typicalScore"
              stroke="#9ca3af"
              fill="#9ca3af"
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DimensionBars({
  dimensionScores,
}: {
  dimensionScores: Record<DimensionKey, number>;
}) {
  const data = DIMENSIONS.map((dim) => ({
    name: dim.label,
    score: Math.round(dimensionScores[dim.key] * 100),
    color: dim.color,
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            width={70}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "维度得分"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <rect key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
