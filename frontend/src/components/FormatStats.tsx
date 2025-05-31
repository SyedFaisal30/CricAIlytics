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

// Color palette for bars
const COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#06b6d4",
  "#22c55e",
  "#facc15",
  "#ef4444",
];

// Helper to parse string scores (e.g. '105*') safely to number
const parseHighScore = (score: string) => {
  const numeric = parseInt(score.replace("*", ""), 10);
  return isNaN(numeric) ? 0 : numeric;
};
// Tile component for a single stat
const StatTile: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="bg-slate-700 rounded-md p-4 shadow-md flex flex-col items-center justify-center">
    <span className="text-indigo-400 font-semibold text-sm">{label}</span>
    <span className="text-white text-xl font-bold">{value}</span>
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

  // Transform data for 'high_score' or 'best_numeric' bars
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

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md">
      <h5 className="text-lg font-semibold text-center text-slate-200 mb-3">
        {title}
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="opponent" tick={{ fill: "#cbd5e1" }} />
          <YAxis tick={{ fill: "#cbd5e1" }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={dataKey}
            fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FormatStatsComponent: React.FC<Props> = ({
  formatName,
  stats,
}) => {
  return (
    <div className="w-full px-6 py-10 bg-slate-900 rounded-lg shadow-lg">
      <h3 className="text-4xl font-bold text-center mb-10 text-white">
        {formatName} Stats
      </h3>

      {/* Batting Overall Summary */}
      <div className="mb-12 text-slate-300">
        <h4 className="text-3xl font-bold mb-6 border-b border-indigo-400 pb-2">
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
      </div>

      {/* Batting vs Opponents Charts */}
      <div className="mb-16">
        <h4 className="text-3xl font-bold mb-6 text-slate-100 border-b-2 border-indigo-300 pb-2">
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
      </div>

      {/* Bowling Overall Summary */}
      <div className="mb-12 text-slate-300">
        <h4 className="text-3xl font-bold mb-6 border-b border-purple-400 pb-2">
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
      </div>

      {/* Bowling vs Opponents Charts */}
      <div className="mb-16">
        <h4 className="text-3xl font-bold mb-6 text-slate-200 border-b-2 border-purple-300 pb-2">
          Bowling vs Opponents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            title="Best Bowling (Wickets count)"
            data={stats.bowling_vs_opponents}
            dataKey="best_numeric"
          />
          <IndividualOpponentChart
            title="4-Wicket Hauls"
            data={stats.bowling_vs_opponents}
            dataKey="four_wicket_hauls"
          />
          <IndividualOpponentChart
            title="5-Wicket Hauls"
            data={stats.bowling_vs_opponents}
            dataKey="five_wicket_hauls"
          />
        </div>
      </div>
    </div>
  );
};
