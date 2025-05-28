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

const COLORS = ["#4f46e5", "#3b82f6", "#06b6d4", "#22c55e", "#facc15", "#ef4444"];

// Custom tick component for vertical opponent names
const VerticalTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="start"
      fill="#fff"
      transform={`rotate(-90, ${x}, ${y + 10})`}
      style={{ fontSize: 12 }}
    >
      {payload.value}
    </text>
  );
};

const IndividualOpponentChart: React.FC<{
  data: OpponentStats[] | undefined;
  dataKey: string;
  title: string;
}> = ({ data, dataKey, title }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-[full] mb-8 p-4 rounded-2xl shadow-lg bg-gradient-to-r from-[#c2d2f9] via-[#6f9eff] to-[#66a6ff] text-white">
      <h5 className="text-xl font-semibold mb-3">{title}</h5>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 15, right: 20, left: 15, bottom: 5 }}
          barGap={8} // Add gap between bars
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
          {/* Remove tick labels on XAxis to hide country names */}
          <XAxis dataKey="opponent" stroke="#fff" tick={false} height={30} />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px" }}
            labelStyle={{ color: "#facc15" }}
          />
          <Legend wrapperStyle={{ color: "#facc15" }} />
          <Bar
            dataKey={dataKey}
            fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
            barSize={25}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#c2d2f9] via-[#6f9eff] to-[#66a6ff] text-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow duration-300">
    <span className="text-sm font-medium text-slate-100">{label}</span>
    <span className="text-3xl font-bold text-slate-200 mt-1">{value}</span>
  </div>
);

export const FormatStatsComponent: React.FC<Props> = ({ formatName, stats }) => {
  const { batting, bowling, fielding } = stats;

  return (
    <section className="w-[95vw] mx-auto p-10 rounded-2xl bg-gradient-to-br from-[#5792ff] via-[#5792ff] to-[#4d94ff] shadow-2xl border border-gray-200 my-12">
      <h3 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300">
        {formatName} Stats Dashboard
      </h3>

      {/* Overall Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-14">
        <StatCard label="Matches" value={batting.matches} />
        <StatCard label="Innings" value={batting.innings} />
        <StatCard label="Runs" value={batting.runs} />
        <StatCard label="Batting Avg" value={batting.average} />
        <StatCard label="Wickets" value={bowling.wickets} />
      </div>

      {/* Batting Overview */}
      <div className="mb-20">
        <h4 className="text-3xl font-bold mb-6 text-slate-100 border-b-2 border-indigo-300 pb-2">
          Batting Overview
        </h4>

        {/* Batting opponent charts in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <IndividualOpponentChart
            title="Runs vs Opponents"
            data={stats.batting_vs_opponents}
            dataKey="runs"
          />
          <IndividualOpponentChart
            title="Average vs Opponents"
            data={stats.batting_vs_opponents}
            dataKey="average"
          />
          <IndividualOpponentChart
            title="50s vs Opponents"
            data={stats.batting_vs_opponents}
            dataKey="fifties"
          />
          <IndividualOpponentChart
            title="100s vs Opponents"
            data={stats.batting_vs_opponents}
            dataKey="hundreds"
          />
        </div>
      </div>

      {/* Bowling Overview */}
      <div className="mb-20">
        <h4 className="text-3xl font-bold mb-6 text-slate-200 border-b-2 border-purple-300 pb-2">
          Bowling Overview
        </h4>

        {/* Bowling opponent charts in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <IndividualOpponentChart
            title="Wickets vs Opponents"
            data={stats.bowling_vs_opponents}
            dataKey="wickets"
          />
          <IndividualOpponentChart
            title="Economy vs Opponents"
            data={stats.bowling_vs_opponents}
            dataKey="economy"
          />
        </div>
      </div>

      {/* Fielding Summary as Cards */}
      <div className="mb-10 max-w-md mx-auto grid grid-cols-2 gap-6">
        <StatCard label="Catches" value={fielding.catches} />
        <StatCard label="Stumpings" value={fielding.stumpings} />
      </div>
    </section>
  );
};
