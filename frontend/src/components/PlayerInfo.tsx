import React from "react";
import type { PlayerInfo, PlayerProfile } from "../utils/types";

interface Props {
  profile: PlayerProfile;
  info: PlayerInfo;
}

export const PlayerInfoComponent: React.FC<Props> = ({ profile, info }) => {
  return (
    <section className="max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl border border-indigo-700 
      bg-gradient-to-br from-indigo-800 via-blue-900 to-slate-900 text-gray-100 my-10"
    >
      {/* Full Name and AKA */}
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold mb-1 drop-shadow-md">
          {profile.name}
        </h2>
        <p className="text-lg text-yellow-300 italic drop-shadow">
          aka {profile.also_known_as}
        </p>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Age (Jan 2025)", value: profile.age_as_of_jan_2025 },
          { label: "Role", value: info.role },
          { label: "Batting Style", value: info.batting_handedness },
          { label: "Bowling Style", value: info.bowling_style },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gradient-to-tr from-indigo-700 via-blue-700 to-slate-800 
              p-5 rounded-lg shadow-lg border border-indigo-600"
          >
            <span className="text-sm font-medium text-indigo-300">{label}</span>
            <p className="text-xl font-semibold capitalize mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Origin & Teams */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 border-b border-indigo-600 pb-1 drop-shadow-sm">
          Origin & Teams
        </h3>
        <ul className="space-y-2 text-indigo-200 mt-3">
          <li>
            <span className="font-semibold text-yellow-300">Country:</span> {profile.origin.country}
          </li>
          <li>
            <span className="font-semibold text-yellow-300">State:</span> {profile.origin.state}
          </li>
          <li>
            <span className="font-semibold text-yellow-300">Teams Played For:</span> {profile.origin.teams.join(", ")}
          </li>
        </ul>
      </div>

      {/* Background */}
      <div>
        <h3 className="text-2xl font-semibold mb-3 border-b border-indigo-600 pb-1 drop-shadow-sm">
          Background
        </h3>
        <p className="text-indigo-200 leading-relaxed mt-2 text-justify">
          {profile.background}
        </p>
      </div>
    </section>
  );
};
