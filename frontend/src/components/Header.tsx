import React from "react";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');
        .header-badge:hover {
          background: #EEF2FF !important;
          border-color: #C7D2F0 !important;
        }
        .header-badge { transition: background .2s, border-color .2s; }
      `}</style>

      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E8EBF2",
        padding: "0 32px",
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(61,64,91,.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxSizing: "border-box" as const,
      }}>

        {/* ── Logo + Name ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <img
              src={logo}
              alt="CricAIlytics"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #E0E4F0", display: "block" }}
            />
            {/* Live green dot */}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #fff" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 17,
              color: "#1A1D2E",
              letterSpacing: -0.4,
            }}>
              CricAIlytics
            </span>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 8,
              fontWeight: 500,
              color: "#B0B5CC",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}>
              Cricket Intelligence
            </span>
          </div>
        </div>

        {/* ── Powered by badge ── */}
        <div
          className="header-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 14px",
            border: "1px solid #E0E4F0",
            borderRadius: 999,
            background: "#FAFBFF",
            cursor: "default",
          }}
        >
          {/* Gemini-style gradient dot */}
          <div style={{
            width: 14, height: 14,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4F6CBA, #6D54C4)",
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 500,
            color: "#8891AA",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Powered by AI
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;