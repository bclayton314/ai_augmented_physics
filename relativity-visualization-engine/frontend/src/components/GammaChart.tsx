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
import type { GammaCurvePoint } from "../api/relativityApi";

interface GammaChartProps {
  data: GammaCurvePoint[];
  selectedBeta: number;
  selectedGamma: number | null;
}

export default function GammaChart({
  data,
  selectedBeta,
  selectedGamma,
}: GammaChartProps): React.ReactElement {
  return (
    <div className="chart-panel">
      <h2>Gamma vs Velocity</h2>
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
              domain={[1, "auto"]}
              label={{ value: "γ", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="gamma"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
            {selectedGamma !== null ? (
              <ReferenceDot
                x={selectedBeta}
                y={selectedGamma}
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