import React from "react";

interface SummaryProps {
  summary: string;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #E2E8F0",
      padding: "28px 32px",
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 3,
          height: 18,
          background: "#10B981",
          borderRadius: 2,
        }}
      />
      <h3
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "#0F172A",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: -0.3,
        }}
      >
        Expert Summary
      </h3>
    </div>
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {summary
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0)
        .map((sentence, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
              color: "#334155",
              lineHeight: 1.75,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                marginTop: 7,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#10B981",
              }}
            />
            {sentence.trim()}
          </li>
        ))}
    </ul>
  </div>
);
