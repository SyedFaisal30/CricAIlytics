import React from "react";
import { CheckCircle2 } from "lucide-react"; // Lucide icon (or you can use Heroicons or FontAwesome)

interface Props {
  achievements: string[];
}

export const Achievements: React.FC<Props> = ({ achievements }) => (
  <section className="w-[95vw] mx-auto p-8 rounded-2xl shadow-2xl border border-blue-300 mt-10 bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-500 text-gray-800">
    <h3 className="text-3xl font-extrabold mb-6 pb-2 border-b-2 border-blue-300 text-blue-800 drop-shadow-sm">
      🏆 Achievements
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((ach, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white bg-opacity-80 backdrop-blur-md border border-blue-200 rounded-xl p-5 shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
        >
          <CheckCircle2 className="text-blue-600 mt-1 shrink-0" size={24} />
          <p className="text-gray-900 text-base leading-relaxed">{ach}</p>
        </div>
      ))}
    </div>
  </section>
);
