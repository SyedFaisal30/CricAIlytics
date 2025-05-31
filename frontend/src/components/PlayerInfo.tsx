import React from "react";
import type { PlayerInfo, PlayerProfile } from "../utils/types";

interface Props {
  profile: PlayerProfile;
  info: PlayerInfo;
}

export const PlayerInfoComponent: React.FC<Props> = ({ profile, info }) => {
  return (
    <section
      className="
        w-[95vw]
        mx-auto
        px-4 sm:px-6 lg:px-8
        p-8
        rounded-2xl
        shadow-2xl
        border
        border-slate-100
        bg-gradient-to-br from-[#c2d2f9] via-[#6f9eff] to-[#66a6ff]

        text-gray-100
        my-10
      "
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Age (Jan 2025)", value: profile.age_as_of_jan_2025 },
          { label: "Role", value: info.role },
          { label: "Batting Style", value: info.batting_handedness },
          { label: "Bowling Style", value: info.bowling_style },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="
              bg-gradient-to-tr from-[#c2d2f9] via-[#6f9eff] to-[#66a6ff]
              p-5 rounded-lg shadow-lg border border-slate-100
            "
          >
            <span className="text-sm font-medium text-indigo-100">{label}</span>
            <p className="text-xl font-semibold capitalize mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Origin & Teams */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 border-b border-slate-100 pb-1 drop-shadow-sm">
          Origin & Teams
        </h3>
        <ul className="space-y-2 text-slate-100 mt-3">
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
        <h3 className="text-2xl font-semibold mb-3 border-b border-slate-100 pb-1 drop-shadow-sm">
          Background
        </h3>
        <p className="text-slate-100 leading-relaxed mt-2 text-justify">
          {profile.background}
        </p>
      </div>
    </section>
  );
};
