import React from "react";
import type { FormatStats, OpponentStats } from "../utils/types";

interface Props {
  formatName: string;
  stats: FormatStats;
}

const OpponentStatsTable: React.FC<{
  data: OpponentStats[] | undefined;
  title: string;
  type: "batting" | "bowling";
}> = ({ data, title, type }) => {
  if (!data || data.length === 0) return null;

  const showBatting = type === "batting";
  const showBowling = type === "bowling";

  return (
    <div className="overflow-x-auto mt-6 mb-8">
      <h5 className="text-xl font-semibold mb-2 text-gray-800">{title}</h5>
      <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-3 py-2 border-b border-gray-300 font-semibold">Opponent</th>
            <th className="px-3 py-2 border-b border-gray-300 font-semibold">Matches</th>
            {showBatting && (
              <>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Runs</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Average</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Fifties</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Hundreds</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">High Score</th>
              </>
            )}
            {showBowling && (
              <>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Wickets</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Best Bowling</th>
                <th className="px-3 py-2 border-b border-gray-300 font-semibold">Economy</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((opponent, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-3 py-2 border-b border-gray-200">{opponent.opponent}</td>
              <td className="px-3 py-2 border-b border-gray-200">{opponent.matches}</td>
              {showBatting && (
                <>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.runs ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.average ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.fifties ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.hundreds ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.high_score ?? "-"}</td>
                </>
              )}
              {showBowling && (
                <>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.wickets ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.best ?? "-"}</td>
                  <td className="px-3 py-2 border-b border-gray-200">{opponent.economy ?? "-"}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export const FormatStatsComponent: React.FC<Props> = ({
  formatName,
  stats,
}) => {
  const { batting, bowling, fielding } = stats;

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 my-8">
      <h3 className="text-3xl font-bold mb-6 text-gray-900">
        {formatName} Stats
      </h3>

      {/* Batting Section */}
      <div className="mb-8">
        <h4 className="text-2xl font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
          Batting
        </h4>
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Matches:</span> {batting.matches},{" "}
          <span className="font-semibold">Innings:</span> {batting.innings},{" "}
          <span className="font-semibold">Runs:</span> {batting.runs}
        </p>
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Average:</span> {batting.average},{" "}
          <span className="font-semibold">Strike Rate:</span>{" "}
          {batting.strike_rate ?? "-"}
        </p>
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">50s:</span> {batting.fifties},{" "}
          <span className="font-semibold">100s:</span> {batting.hundreds},{" "}
          <span className="font-semibold">High Score:</span>{" "}
          {batting.high_score}
        </p>

        {/* Batting vs Opponents */}
        <OpponentStatsTable title="Batting vs Opponents" data={stats.batting_vs_opponents} type="batting" />

      </div>

      {/* Bowling Section */}
      <div className="mb-8">
        <h4 className="text-2xl font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
          Bowling
        </h4>
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Matches:</span> {bowling.matches},{" "}
          <span className="font-semibold">Innings Bowled:</span>{" "}
          {bowling.innings_bowled},{" "}
          <span className="font-semibold">Wickets:</span> {bowling.wickets}
        </p>
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Average:</span> {bowling.average},{" "}
          <span className="font-semibold">Economy:</span> {bowling.economy}
        </p>
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">Best:</span> {bowling.best}
        </p>

        {/* Bowling vs Opponents */}
        <OpponentStatsTable title="Bowling vs Opponents" data={stats.bowling_vs_opponents} type="bowling" />

      </div>

      {/* Fielding Section */}
      <div>
        <h4 className="text-2xl font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
          Fielding
        </h4>
        <p className="text-gray-700">
          <span className="font-semibold">Catches:</span> {fielding.catches},{" "}
          <span className="font-semibold">Stumpings:</span> {fielding.stumpings}
        </p>
      </div>
    </section>
  );
};
