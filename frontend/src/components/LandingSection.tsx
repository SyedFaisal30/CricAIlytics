import React from "react";
import { Trophy, Search, BarChart4 } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <Trophy className="w-10 h-10 text-blue-600" />,
    title: "Player Profiles",
    desc: "Get in-depth info on cricketers – from debuts to records.",
  },
  {
    icon: <BarChart4 className="w-10 h-10 text-teal-600" />,
    title: "Advanced Stats",
    desc: "Explore batting, bowling & fielding stats across all formats.",
  },
  {
    icon: <Search className="w-10 h-10 text-purple-600" />,
    title: "Smart Search",
    desc: "Find players by name, team, or performance against opponents.",
  },
];

export const LandingSection: React.FC = () => {
  return (
    <section className="h-[90vh] rounded-2xl bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-gray-900 px-6 py-24 md:px-16 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight drop-shadow-sm">
          Welcome to <span className="text-blue-600">Playrai</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-16 leading-relaxed">
          Your all-in-one cricket stats hub – track players, analyze matchups, and dive deep into performances like never before.
        </p>

        <div className="grid md:grid-cols-3 gap-12 text-left">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
