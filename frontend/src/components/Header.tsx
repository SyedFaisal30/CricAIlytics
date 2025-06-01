import React from "react";
import logo from "../assets/header.png"; // Adjust the path if needed

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-500 text-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center space-x-4">
        <img
          src={logo}
          alt="CricAIlytics Logo"
          className="h-16 w-16 object-cover rounded-full border-2 border-white shadow"
        />
        <h1 className="text-3xl font-bold tracking-tight hover:scale-105 transition-transform duration-200">
          CricAIlytics
        </h1>
      </div>
    </header>
  );
};

export default Header;
