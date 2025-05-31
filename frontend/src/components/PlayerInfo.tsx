import React, { useEffect, useState } from "react";
import type { PlayerInfo, PlayerProfile } from "../utils/types";

interface Props {
  profile: PlayerProfile;
  info: PlayerInfo;
  searchedName: string;
}

export const PlayerInfoComponent: React.FC<Props> = ({
  profile,
  info,
  searchedName,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerImage = async () => {
      try {
        const playerName = encodeURIComponent(searchedName.replace(/\s/g, "_"));
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${playerName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

        const res = await fetch(url);
        const data = await res.json();

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (page?.thumbnail?.source) {
          setImageUrl(page.thumbnail.source);
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        console.error("Failed to fetch player image:", error);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerImage();
  }, [searchedName]);

  return (
    <section className="w-[95vw] mx-auto p-8 rounded-2xl shadow-2xl border border-blue-300 mt-10 bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-500 text-gray-800">
      {/* Player Image & Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Image */}
        <div className="flex justify-center md:justify-start">
          {loading ? (
            <div className="w-48 h-48 rounded-full bg-blue-200 animate-pulse"></div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`${profile.name} photo`}
              className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-blue-300"
              loading="lazy"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-blue-200 flex items-center justify-center text-gray-700 text-xl font-semibold">
              No Image
            </div>
          )}
        </div>

        {/* Player Basic Info */}
        <div className="flex-1 w-full">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-4xl font-extrabold mb-1 text-blue-800 drop-shadow-sm">
              {profile.name}
            </h2>
            <p className="text-lg italic text-blue-600">
              aka {profile.also_known_as}
            </p>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Age (Jan 2025)", value: profile.age_as_of_jan_2025 },
              { label: "Role", value: info.role },
              { label: "Batting Style", value: info.batting_handedness },
              { label: "Bowling Style", value: info.bowling_style },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-xl shadow border border-blue-200"
              >
                <p className="text-sm font-medium text-blue-700">{label}</p>
                <p className="text-lg font-semibold capitalize text-gray-900 mt-1">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Origin & Teams */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-3 border-b-2 border-blue-200 text-blue-800 pb-1 drop-shadow-sm">
          🌍 Origin & Teams
        </h3>
        <ul className="space-y-2 text-gray-900 mt-3 pl-2">
          <li>
            <span className="font-semibold text-blue-700">Country:</span>{" "}
            {profile.origin.country}
          </li>
          <li>
            <span className="font-semibold text-blue-700">State:</span>{" "}
            {profile.origin.state}
          </li>
          <li>
            <span className="font-semibold text-blue-700">Teams Played For:</span>{" "}
            {profile.origin.teams.join(", ")}
          </li>
        </ul>
      </div>

      {/* Background */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-3 border-b-2 border-blue-200 text-blue-800 pb-1 drop-shadow-sm">
          📖 Background
        </h3>
        <p className="text-gray-900 leading-relaxed mt-2 text-justify bg-white bg-opacity-70 p-4 rounded-xl shadow border border-blue-100">
          {profile.background}
        </p>
      </div>
    </section>
  );
};
