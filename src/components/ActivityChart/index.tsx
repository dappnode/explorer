import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./activity-chart.scss";

const maxHeight = 200;
const mainColor = "#2fbcb2";
const bColor = "#bc7a2f";
const softColor = "#767e86";
const packagesName = "new packages";
const versionsName = "new versions";
const fontSize = 12.8;

interface RechartsTooltipPayload {
  fill: string; // "#bc7a2f";
  dataKey: string; // "packages";
  name: string; // "packages";
  color: string; // "#bc7a2f";
  value: number; // 0;
}

function renderColorfulLegendText(value: string) {
  return <span style={{ color: softColor, fontSize }}>{value}</span>;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: RechartsTooltipPayload[];
  label: string;
}) {
  if (!active) return null;
  return (
    <div className="custom-recharts-tooltip">
      <div>{label}</div>
      <table>
        <tbody>
          {payload.reverse().map(({ name, color, value }) => (
            <tr key={name} style={{ color }}>
              <td>{value}</td>
              <td>{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ActivityData {
  month: string; // "Jan";
  versions: number; // 13;
  packages: number; // 2;
}

export default function ActivityChart({ data }: { data: ActivityData[] }) {
  return (
    <div className="activity-chart">
      <div className="header">
        <div className="time">LAST 12 MONTHS</div>
        <div className="name">ACTIVITY</div>
      </div>

      <ResponsiveContainer height={maxHeight}>
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            stroke={softColor}
            tick={{ fill: softColor, fontSize }}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={{ fill: "transparent" }}
            content={CustomTooltip}
          />
          <Legend formatter={renderColorfulLegendText} />
          <Bar
            isAnimationActive={false}
            maxBarSize={20}
            dataKey="packages"
            name={packagesName}
            stackId="a"
            fill={bColor}
          />
          <Bar
            isAnimationActive={false}
            maxBarSize={20}
            dataKey="versions"
            name={versionsName}
            stackId="a"
            fill={mainColor}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
