import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-500 text-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <h1 className="text-3xl font-bold tracking-tight hover:scale-105 transition-transform duration-200">
          Playrai 🏏
        </h1>
      </div>
    </header>
  );
};

export default Header;
