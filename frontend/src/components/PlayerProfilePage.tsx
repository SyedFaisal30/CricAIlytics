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
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Player Info Lookup</h1>

      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Enter player name"
        style={{ padding: "0.5rem", fontSize: "1rem", width: "300px" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={!inputName.trim()}
      >
        Search
      </button>

      {loading && <p>Loading player data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && !data && playerName && <p>No player data found</p>}

      {data && (
        <div style={{ marginTop: "2rem" }}>
          <PlayerInfoComponent profile={data.player_profile} info={data.player_info} />
          <Achievements achievements={data.achievements} />
          <Summary summary={data.summary} />

          <h2>Stats by Format</h2>
          {Object.entries(data.formats).map(([formatName, stats]) => (
            <FormatStatsComponent key={formatName} formatName={formatName} stats={stats} />
          ))}

          <footer>
            <small>{data.note}</small>
          </footer>
        </div>
      )}
    </div>
  );
};
