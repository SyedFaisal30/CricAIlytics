import React, { useEffect, useState } from "react";

const loadingMessages = [
  "Fetching player details...",
  "Fetching achievements...",
  "Fetching stats...",
  "Fetching opponent-wise stats...",
  "Converting data into stats...",
];

export const StatsLoader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
  className="
    fixed inset-0 
    z-[9999]
    flex 
    pointer-events-none
  "
>
  <div
    className="
      bg-transparent
      px-8 py-10
      rounded-xl
      flex flex-col 
      backdrop-blur-[10px]
      w-full
      h-full
      items-center justify-center
    "
  >
    {/* Spinner */}
    <div className="border-8 border-t-8 border-gray-300 border-t-blue-500 rounded-full w-16 h-16 animate-spin mb-6" />

    {/* Fading message */}
    <p
      className={`text-white text-lg md:text-xl font-semibold transition-opacity duration-500 ${
        fade ? "opacity-100" : "opacity-0"
      } text-center`}
    >
      {loadingMessages[currentIndex]}
    </p>
  </div>
</div>

  );
};
