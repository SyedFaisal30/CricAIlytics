import React from "react";

interface Props {
  achievements: string[];
}

export const Achievements: React.FC<Props> = ({ achievements }) => (
  <section className="max-w-3xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-200 mt-10 bg-gradient-to-br from-sky-900 via-blue-800 to-slate-900 text-white">
    <h3 className="text-3xl font-bold mb-6 border-b border-blue-300 pb-2">
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

interface SummaryProps {
  summary: string;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => (
  <section className="max-w-3xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-200 mt-10 bg-gradient-to-br from-sky-900 via-blue-800 to-slate-900 text-white">
    <h3 className="text-3xl font-bold mb-6 border-b border-blue-300 pb-2">
      Summary
    </h3>
    <p className="leading-relaxed text-base">
      {summary}
    </p>
  </section>
);
