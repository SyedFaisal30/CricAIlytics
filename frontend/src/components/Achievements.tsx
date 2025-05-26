import React from "react";

interface Props {
  achievements: string[];
}

export const Achievements: React.FC<Props> = ({ achievements }) => (
  <section className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-8">
    <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
      Achievements
    </h3>
    <ul className="list-disc list-inside space-y-2 text-gray-700">
      {achievements.map((ach, i) => (
        <li key={i} className="leading-relaxed">
          {ach}
        </li>
      ))}
    </ul>
  </section>
);
