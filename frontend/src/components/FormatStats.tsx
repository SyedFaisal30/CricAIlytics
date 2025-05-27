import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { FormatStats, OpponentStats } from "../utils/types";

interface Props {
  formatName: string;
  stats: FormatStats;
}

const COLORS = ["#4f46e5", "#3b82f6", "#06b6d4", "#22c55e", "#facc15", "#ef4444"];

const OpponentStatsBarChart: React.FC<{
  data: OpponentStats[] | undefined;
  title: string;
  type: "batting" | "bowling";
}> = ({ data, title, type }) => {
  if (!data || data.length === 0) return null;

  // Prepare data for grouped bar chart
  const keysBatting = ["runs", "average", "fifties", "hundreds"];
  const keysBowling = ["wickets", "economy"];
  const keys = type === "batting" ? keysBatting : keysBowling;

  return (
    <div className="mt-8 p-4 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white max-w-full overflow-x-auto">
      <h5 className="text-2xl font-bold mb-4">{title}</h5>
      <BarChart
        width={700}
        height={350}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="opponent" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px" }}
          labelStyle={{ color: "#facc15" }}
        />
        <Legend wrapperStyle={{ color: "#facc15" }} />
        {keys.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            fill={COLORS[idx % COLORS.length]}
            barSize={25}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </div>
  );
};

export const FormatStatsComponent: React.FC<Props> = ({ formatName, stats }) => {
  const { batting, bowling, fielding } = stats;

  // Batting summary for BarChart
  const battingSummaryData = [
    { name: "Matches", value: batting.matches },
    { name: "Innings", value: batting.innings },
    { name: "Runs", value: batting.runs },
    { name: "50s", value: batting.fifties },
    { name: "100s", value: batting.hundreds },
  ];

  // Bowling summary for RadarChart
  const bowlingSummaryData = [
    { subject: "Matches", A: bowling.matches, fullMark: Math.max(bowling.matches, 50) },
    { subject: "Wickets", A: bowling.wickets, fullMark: Math.max(bowling.wickets, 50) },
    { subject: "Economy", A: bowling.economy, fullMark: Math.max(bowling.economy, 10) },
    { subject: "Average", A: bowling.average, fullMark: Math.max(bowling.average, 100) },
  ];

  // Fielding summary for PieChart
  const fieldingData = [
    { name: "Catches", value: fielding.catches },
    { name: "Stumpings", value: fielding.stumpings },
  ];

  return (
    <section className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-xl shadow-xl border border-gray-300 my-10">
      <h3 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600">
        {formatName} Stats
      </h3>

      {/* Batting Summary Bar Chart */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-3xl font-semibold mb-5 text-indigo-700 border-b border-indigo-300 pb-2">
          Batting Summary
        </h4>
        <BarChart
          width={700}
          height={300}
          data={battingSummaryData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#4f46e5" />
          <YAxis stroke="#4f46e5" />
          <Tooltip
            contentStyle={{ backgroundColor: "#eef2ff", borderRadius: "8px" }}
            labelStyle={{ color: "#4338ca" }}
          />
          <Bar dataKey="value" fill="url(#battingGradient)" radius={[6, 6, 0, 0]} barSize={40} />
          <defs>
            <linearGradient id="battingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4338ca" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </div>

      {/* Bowling Radar Chart */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md flex justify-center">
        <div>
          <h4 className="text-3xl font-semibold mb-5 text-purple-700 border-b border-purple-300 pb-2">
            Bowling Summary
          </h4>
          <RadarChart
            cx={350}
            cy={180}
            outerRadius={130}
            width={700}
            height={360}
            data={bowlingSummaryData}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" stroke="#7c3aed" />
            <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} stroke="#a78bfa" />
            <Radar
              name="Bowling"
              dataKey="A"
              stroke="#7c3aed"
              fill="url(#bowlingGradient)"
              fillOpacity={0.7}
            />
            <defs>
              <linearGradient id="bowlingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <Legend />
          </RadarChart>
        </div>
      </div>

      {/* Fielding Pie Chart */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h4 className="text-3xl font-semibold mb-5 text-pink-700 border-b border-pink-300 pb-2">
          Fielding Summary
        </h4>
        <PieChart width={400} height={300}>
          <Pie
            data={fieldingData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#f43f5e"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            isAnimationActive={true}
          >
            {fieldingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Batting vs Opponents Chart */}
      <OpponentStatsBarChart
        title="Batting vs Opponents"
        data={stats.batting_vs_opponents}
        type="batting"
      />

      {/* Bowling vs Opponents Chart */}
      <OpponentStatsBarChart
        title="Bowling vs Opponents"
        data={stats.bowling_vs_opponents}
        type="bowling"
      />
    </section>
  );
};
