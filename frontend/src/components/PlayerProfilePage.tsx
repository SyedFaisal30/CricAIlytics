import React, { useState } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { PlayerInfoComponent } from "./PlayerInfo";
import { Achievements } from "./Achievements";
import { Summary } from "./Summary";
import { FormatStatsComponent } from "./FormatStats";

export const PlayerProfilePage: React.FC = () => {
  const [inputName, setInputName] = useState(""); 
  const [playerName, setPlayerName] = useState(""); 

  const { data, loading, error } = usePlayer(playerName);

  const handleSubmit = () => {
    if (inputName.trim()) {
      setPlayerName(inputName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900 text-white font-sans p-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-tr from-indigo-700 via-blue-600 to-slate-700 rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide drop-shadow-lg">
          Player Info Lookup
        </h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter player name"
            className="w-full max-w-md rounded-md px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputName.trim()}
            className={`ml-4 px-6 py-3 rounded-md font-semibold text-indigo-900 transition 
              ${inputName.trim() ? 'bg-yellow-400 hover:bg-yellow-300 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Search
          </button>
        </div>

        {/* Status Messages */}
        {loading && (
          <p className="text-center text-yellow-200 font-semibold animate-pulse">
            Loading player data...
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 font-semibold">
            Error: {error}
          </p>
        )}
        {!loading && !error && !data && playerName && (
          <p className="text-center text-gray-300 font-medium">
            No player data found.
          </p>
        )}

        {/* Player Data Display */}
        {data && (
          <div className="space-y-10">
            <PlayerInfoComponent profile={data.player_profile} info={data.player_info} />
            <Achievements achievements={data.achievements} />
            <Summary summary={data.summary} />

            <h2 className="text-3xl font-bold border-b border-yellow-400 pb-2 text-yellow-300">
              Stats by Format
            </h2>
            <div className="space-y-8">
              {Object.entries(data.formats).map(([formatName, stats]) => (
                <FormatStatsComponent
                  key={formatName}
                  formatName={formatName}
                  stats={stats}
                />
              ))}
            </div>

            <footer className="mt-12 text-center text-gray-300 italic text-sm">
              {data.note}
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};
