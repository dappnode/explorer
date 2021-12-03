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
const bColor = "#bc7a2f"; // Alternative strong color
const softColor = "#767e86"; // soft
const borderColor = "#2c3034"; // Very very soft
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
  payload = [],
  label,
}: {
  active: boolean;
  payload: RechartsTooltipPayload[];
  label: string;
}) {
  if (!active || !payload) return null;
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

interface ActivityByMonth {
  month: number;
  count: number;
}

interface ActivityData {
  month: string; // "Jan";
  versions: number; // 13;
  packages: number; // 2;
}

interface Activity {
  versions: ActivityByMonth[];
  packages: ActivityByMonth[];
}

/**
 * Parses a numeric month to its short english name
 * @param month 0
 * @returns Jan
 */
function monthNumToShort(month: number) {
  const mockDate = new Date(new Date(`2020/${month + 1}/1`).getTime()); // UTC date - Safari bug /-
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(mockDate);
}

function parseActivity(activity?: Activity): ActivityData[] {
  if (!activity) return [];
  return activity.versions.map((v, i) => ({
    month: monthNumToShort(v.month),
    versions: (activity.versions[i] || {}).count || 0,
    packages: (activity.packages[i] || {}).count || 0,
  }));
}

export default function ActivityChart({ activity }: { activity?: Activity }) {
  const data = parseActivity(activity);
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
            stroke={borderColor}
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
