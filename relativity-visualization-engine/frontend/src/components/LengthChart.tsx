import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LengthCurvePoint } from "../api/relativityApi";

interface LengthChartProps {
  data: LengthCurvePoint[];
  selectedBeta: number;
  selectedLength: number | null;
}

export default function LengthChart({
  data,
  selectedBeta,
  selectedLength,
}: LengthChartProps): React.ReactElement {
  return (
    <div className="chart-panel">
      <h2>Contracted Length vs Velocity</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="beta"
              type="number"
              domain={[0, 1]}
              tickCount={11}
              label={{ value: "β = v/c", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              domain={[0, "auto"]}
              label={{ value: "L", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="length"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
            {selectedLength !== null ? (
              <ReferenceDot
                x={selectedBeta}
                y={selectedLength}
                r={6}
                ifOverflow="visible"
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}