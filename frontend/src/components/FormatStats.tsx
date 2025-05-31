import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { FormatStats, OpponentStats } from "../utils/types";

interface Props {
  formatName: string;
  stats: FormatStats;
}

const COLORS = [
  "#2563eb",
  "#1e40af",
  "#14b8a6",
  "#22c55e",
  "#eab308",
  "#dc2626",
];

// Safely parse high score strings like "105*" to numbers
const parseHighScore = (score: string) => {
  const numeric = parseInt(score.replace("*", ""), 10);
  return isNaN(numeric) ? 0 : numeric;
};

// Tile for displaying individual stat value
const StatTile: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-5 shadow-lg flex flex-col items-center justify-center hover:scale-[1.03] transition-transform duration-300 cursor-default">
    <span className="text-blue-700 font-semibold text-sm mb-1">{label}</span>
    <span className="text-blue-900 text-2xl font-extrabold">{value}</span>
  </div>
);

const IndividualOpponentChart: React.FC<{
  data: OpponentStats[] | undefined;
  dataKey:
    | keyof Omit<OpponentStats, "opponent" | "best" | "high_score">
    | "high_score"
    | "best_numeric";
  title: string;
}> = ({ data, dataKey, title }) => {
  if (!data || data.length === 0) return null;

  const processedData =
    dataKey === "high_score"
      ? data.map((o) => ({
          ...o,
          high_score: parseHighScore(o.high_score),
        }))
      : dataKey === "best_numeric"
      ? data.map((o) => ({
          ...o,
          best_numeric: parseInt(o.best.split("/")[0]) || 0,
        }))
      : data;

  const baseColor = React.useMemo(() => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  const gradientId = `grad-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const gradientStart = baseColor + "33"; // 20% opacity
  const gradientEnd = baseColor + "cc"; // 80% opacity

  // Use window width hook to adjust XAxis angle dynamically
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust height and angle for small widths
  const isSmallScreen = windowWidth < 640;
  const xAxisAngle = isSmallScreen ? -45 : -30;
  const chartHeight = isSmallScreen ? 220 : 280;

  return (
    <div className="p-4 rounded-xl shadow-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 overflow-x-auto">
      <h5 className="text-xl font-semibold text-center text-blue-700 mb-4">
        {title}
      </h5>
      <div style={{ minWidth: 350 }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={processedData}
            margin={{ top: 5, right: 15, bottom: 40, left: 10 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="opponent"
              tick={{ fill: "#3b82f6", fontWeight: "600", fontSize: 12 }}
              axisLine={{ stroke: "#60a5fa" }}
              interval={0}
              angle={xAxisAngle}
              textAnchor="end"
              height={isSmallScreen ? 80 : 60}
              minTickGap={10}
              tickFormatter={(text) =>
                text.length > 12 ? text.slice(0, 12) + "…" : text
              }
            />
            <YAxis tick={{ fill: "#3b82f6", fontWeight: "600" }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-blue-50 p-3 rounded-md shadow-md text-blue-800 max-w-xs">
                      <p className="font-bold mb-1">Opponent: {label}</p>
                      <p>
                        {title}:{" "}
                        <span className="font-extrabold">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ color: "#3b82f6", fontWeight: "700" }} />
            <Bar
              dataKey={dataKey}
              fill={`url(#${gradientId})`}
              fillOpacity={0.9}
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const FormatStatsComponent: React.FC<Props> = ({
  formatName,
  stats,
}) => {
  return (
    <div className="w-[95vw] max-w-[1200px] mx-auto p-6 rounded-2xl shadow-2xl border border-blue-300 mt-10 bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-500 text-gray-800">
      <h3 className="text-3xl font-extrabold mb-6 pb-2 border-b-2 border-blue-300 text-blue-800 drop-shadow-sm text-center">
        {formatName} Stats
      </h3>

      {/* Batting Summary */}
      <section className="mb-10 text-gray-900">
        <h4 className="text-2xl font-bold mb-5 border-b-2 border-blue-300 pb-2 text-blue-700">
          Batting Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
          <StatTile label="Matches" value={stats.batting.matches} />
          <StatTile label="Innings" value={stats.batting.innings} />
          <StatTile label="Runs" value={stats.batting.runs} />
          <StatTile label="Average" value={stats.batting.average.toFixed(2)} />
          <StatTile
            label="Strike Rate"
            value={stats.batting.strike_rate.toFixed(2)}
          />
          <StatTile label="50s" value={stats.batting.fifties} />
          <StatTile label="100s" value={stats.batting.hundreds} />
          <StatTile label="High Score" value={stats.batting.high_score} />
        </div>
      </section>

      {/* Batting vs Opponents */}
      <section className="mb-10">
        <h4 className="text-2xl font-bold mb-5 text-blue-700 border-b-2 border-blue-300 pb-2">
          Batting vs Opponents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <IndividualOpponentChart
            title="Matches"
            data={stats.batting_vs_opponents}
            dataKey="matches"
          />
          <IndividualOpponentChart
            title="Runs"
            data={stats.batting_vs_opponents}
            dataKey="runs"
          />
          <IndividualOpponentChart
            title="Average"
            data={stats.batting_vs_opponents}
            dataKey="average"
          />
          <IndividualOpponentChart
            title="50s"
            data={stats.batting_vs_opponents}
            dataKey="fifties"
          />
          <IndividualOpponentChart
            title="100s"
            data={stats.batting_vs_opponents}
            dataKey="hundreds"
          />
          <IndividualOpponentChart
            title="High Score"
            data={stats.batting_vs_opponents}
            dataKey="high_score"
          />
        </div>
      </section>

      {/* Bowling Summary */}
      <section className="mb-10 text-gray-900">
        <h4 className="text-2xl font-bold mb-5 border-b-2 border-blue-300 pb-2 text-blue-700">
          Bowling Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
          <StatTile label="Matches" value={stats.bowling.matches} />
          <StatTile
            label="Innings Bowled"
            value={stats.bowling.innings_bowled}
          />
          <StatTile label="Wickets" value={stats.bowling.wickets} />
          <StatTile label="Average" value={stats.bowling.average.toFixed(2)} />
          <StatTile label="Economy" value={stats.bowling.economy.toFixed(2)} />
          <StatTile label="Best Bowling" value={stats.bowling.best} />
          <StatTile
            label="4-Wicket Hauls"
            value={stats.bowling.four_wicket_hauls}
          />
          <StatTile
            label="5-Wicket Hauls"
            value={stats.bowling.five_wicket_hauls}
          />
        </div>
      </section>

      {/* Bowling vs Opponents */}
      <section>
        <h4 className="text-2xl font-bold mb-5 text-blue-700 border-b-2 border-blue-300 pb-2">
          Bowling vs Opponents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <IndividualOpponentChart
            title="Matches"
            data={stats.bowling_vs_opponents}
            dataKey="matches"
          />
          <IndividualOpponentChart
            title="Wickets"
            data={stats.bowling_vs_opponents}
            dataKey="wickets"
          />
          <IndividualOpponentChart
            title="Average"
            data={stats.bowling_vs_opponents}
            dataKey="average"
          />
          <IndividualOpponentChart
            title="Economy"
            data={stats.bowling_vs_opponents}
            dataKey="economy"
          />
          <IndividualOpponentChart
            title="Best Bowling"
            data={stats.bowling_vs_opponents}
            dataKey="best_numeric"
          />
        </div>
      </section>
    </div>
  );
};
