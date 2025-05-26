import React from "react";
import type { PlayerInfo, PlayerProfile } from "../utils/types";

interface Props {
  profile: PlayerProfile;
  info: PlayerInfo;
}

export const PlayerInfoComponent: React.FC<Props> = ({ profile, info }) => {
  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">
        Full Name: <span className="font-normal">{profile.name}</span>
      </h2>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Also Known As: <span className="font-normal">{profile.also_known_as}</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-gray-800">
        <p>
          <span className="font-semibold">Age (as of Jan 2025):</span> {profile.age_as_of_jan_2025}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {info.role}
        </p>
        <p>
          <span className="font-semibold">Batting Style:</span> {info.batting_handedness}
        </p>
        <p>
          <span className="font-semibold">Bowling Style:</span> {info.bowling_style}
        </p>
      </div>

      <h3 className="text-2xl font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
        Origin & Teams
      </h3>
      <ul className="mb-6 text-gray-700 space-y-1">
        <li>
          <span className="font-semibold">Country:</span> {profile.origin.country}
        </li>
        <li>
          <span className="font-semibold">State:</span> {profile.origin.state}
        </li>
        <li>
          <span className="font-semibold">Teams Played For:</span> {profile.origin.teams.join(", ")}
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
        Background
      </h3>
      <p className="text-gray-700 leading-relaxed">{profile.background}</p>
    </section>
  );
};
