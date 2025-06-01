import React from "react";
import { Trophy, Search, BarChart4 } from "lucide-react";
import logo from "../assets/logo.png";

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
    <section className="h-[90vh] rounded-2xl bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-gray-900 px-4 py-16 md:h-[70vh] md:px-16 flex flex-col justify-center">
<div className="flex justify-center items-center gap-3 flex-wrap text-center mb-8">
  <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
    Welcome to
  </h1>
  <img
    src={logo}
    alt="CricAIlytics Logo"
    className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover border-2 border-blue-400 shadow"
  />
  <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm text-blue-600">
    CricAIlytics
  </h1>
</div>


        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
    </section>
  );
};
