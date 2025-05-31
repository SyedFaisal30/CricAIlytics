import React, { useState } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { PlayerInfoComponent } from "./PlayerInfo";
import { Achievements } from "./Achievements";
import { Summary } from "./Summary";
import { FormatStatsComponent } from "./FormatStats";
import type { PlayerFormats } from "../utils/types";

export const PlayerProfilePage: React.FC = () => {
  const [inputName, setInputName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<keyof PlayerFormats>("ODI");

  const { data, loading, error } = usePlayer(playerName);

  const handleSubmit = () => {
    if (inputName.trim()) {
      setPlayerName(inputName.trim());
      setSelectedFormat("Test"); // Reset to default format when searching new player
    }
  };

  // Get format keys in consistent order if data available
  const formatKeys: (keyof PlayerFormats)[] = data
    ? (Object.keys(data.formats) as (keyof PlayerFormats)[])
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5792ff] via-[#5792ff] to-[#4d94ff] text-white font-sans pt-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide drop-shadow-lg">
        Player Info Lookup
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter player name"
          className="w-full max-w-md rounded-md px-4 py-3 text-slate-100 font-medium focus:outline-none focus:ring-4 focus:ring-slate-100"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputName.trim()}
          className={`ml-4 px-6 py-3 rounded-md font-semibold text-indigo-900 transition 
            ${
              inputName.trim()
                ? "bg-yellow-400 hover:bg-yellow-300 shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
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
        <p className="text-center text-gray-300 font-medium">No player data found.</p>
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

          {/* Format selection buttons */}
          <div className="flex space-x-4 justify-center mb-6">
            {formatKeys.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors
                  ${
                    selectedFormat === format
                      ? "bg-yellow-400 text-indigo-900 shadow-lg"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
              >
                {format}
              </button>
            ))}
          </div>

          {/* Show stats for only selected format */}
          <FormatStatsComponent
            formatName={selectedFormat}
            stats={data.formats[selectedFormat]}
          />

          <footer className="mt-12 text-center text-gray-300 italic text-sm">{data.note}</footer>
        </div>
      )}
    </div>
  );
};
