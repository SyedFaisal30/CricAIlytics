import React from "react";
import { FaGithub , FaWhatsapp, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-500 text-white shadow-md py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Playrai. All rights reserved.
        </p>

        <div className="flex space-x-6 text-2xl">
          <a
            href="https://github.com/SyedFaisal30"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            <FaGithub />
          </a>

          <a
            href="https://x.com/SyedFaisal30"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            <FaXTwitter />
          </a>

          <a
            href="https://wa.me/9892996342"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.linkedin.com/in/SyedFaisal30/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:sfarz172320@gmail.com"
            aria-label="Email"
            className="hover:text-gray-900 transition-colors duration-300"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};
