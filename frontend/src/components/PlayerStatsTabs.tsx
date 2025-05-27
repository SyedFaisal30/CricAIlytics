import { useState } from "react";

type Format = "Test" | "ODI" | "T20I" | "IPL";

interface OpponentStats {
  opponent: string;
  matches: number;
  runs?: number;
  average: number;
  fifties?: number;
  hundreds?: number;
  high_score?: string;
  wickets?: number;
  best?: string;
  economy?: number;
}

interface FormatStats {
  batting: {
    matches: number;
    innings: number;
    runs: number;
    average: number;
    strike_rate: number;
    fifties: number;
    hundreds: number;
    high_score: string;
  };
  bowling: {
    matches: number;
    innings_bowled: number;
    wickets: number;
    average: number;
    economy: number;
    best: string;
    four_wicket_hauls: number;
    five_wicket_hauls: number;
  };
  fielding: {
    catches: number;
    stumpings: number;
  };
  batting_vs_opponents: OpponentStats[];
  bowling_vs_opponents: OpponentStats[];
}

interface PlayerStatsTabsProps {
  data: Record<Format, FormatStats>;
}

const FORMATS: Format[] = ["Test", "ODI", "T20I", "IPL"];

const PlayerStatsTabs = ({ data }: PlayerStatsTabsProps) => {
  const [activeTab, setActiveTab] = useState<Format>("Test");

  const stat = data[activeTab];

  // Helper to display optional numeric/text fields or fallback
  const displayValue = (value: number | string | undefined) =>
    value !== undefined && value !== null ? value : "-";

  return (
    <div className="w-full p-4 rounded-xl bg-gray-800 text-white shadow-lg">
      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        {FORMATS.map((format) => (
          <button
            key={format}
            onClick={() => setActiveTab(format)}
            aria-pressed={activeTab === format}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === format
                ? "bg-blue-500 text-white"
                : "bg-gray-600 hover:bg-blue-400"
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      {/* Batting */}
      <div>
        <h3 className="text-xl font-bold text-blue-400 mb-2">Batting</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(stat.batting).map(([k, v]) => (
            <div key={k} className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 capitalize">{k.replace(/_/g, " ")}</p>
              <p className="text-white font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bowling */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Bowling</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(stat.bowling).map(([k, v]) => (
            <div key={k} className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 capitalize">{k.replace(/_/g, " ")}</p>
              <p className="text-white font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fielding */}
      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Fielding</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(stat.fielding).map(([k, v]) => (
            <div key={k} className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 capitalize">{k}</p>
              <p className="text-white font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Batting vs Opponents */}
      <div>
        <h3 className="text-xl font-bold text-purple-400 mb-2">
          Batting vs Opponents
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-2">Opponent</th>
                <th className="px-4 py-2">Matches</th>
                <th className="px-4 py-2">Runs</th>
                <th className="px-4 py-2">Avg</th>
                <th className="px-4 py-2">50s</th>
                <th className="px-4 py-2">100s</th>
                <th className="px-4 py-2">HS</th>
              </tr>
            </thead>
            <tbody>
              {stat.batting_vs_opponents.map((bvo) => (
                <tr key={bvo.opponent} className="border-b border-gray-700">
                  <td className="px-4 py-2">{bvo.opponent}</td>
                  <td className="px-4 py-2">{bvo.matches}</td>
                  <td className="px-4 py-2">{displayValue(bvo.runs)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.average)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.fifties)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.hundreds)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.high_score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bowling vs Opponents */}
      <div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Bowling vs Opponents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-2">Opponent</th>
                <th className="px-4 py-2">Matches</th>
                <th className="px-4 py-2">Wickets</th>
                <th className="px-4 py-2">Avg</th>
                <th className="px-4 py-2">Best</th>
                <th className="px-4 py-2">Economy</th>
              </tr>
            </thead>
            <tbody>
              {stat.bowling_vs_opponents.map((bvo) => (
                <tr key={bvo.opponent} className="border-b border-gray-700">
                  <td className="px-4 py-2">{bvo.opponent}</td>
                  <td className="px-4 py-2">{bvo.matches}</td>
                  <td className="px-4 py-2">{displayValue(bvo.wickets)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.average)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.best)}</td>
                  <td className="px-4 py-2">{displayValue(bvo.economy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsTabs;
