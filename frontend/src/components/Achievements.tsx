import React from "react";

interface Props {
  achievements: string[];
}

export const Achievements: React.FC<Props> = ({ achievements }) => (
  <section className="w-[95vw] mx-auto p-8 rounded-2xl shadow-lg border border-gray-200 mt-10 bg-gradient-to-br from-[#5792ff] via-[#5792ff] to-[#4d94ff]">
    <h3 className="text-3xl font-bold mb-6 border-b border-slate-100 pb-2">
      Achievements
    </h3>
    <ul className="list-disc list-inside space-y-3 text-base">
      {achievements.map((ach, i) => (
        <li key={i} className="leading-relaxed">
          {ach}
        </li>
      ))}
    </ul>
  </section>
);
