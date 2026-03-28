import React from "react";

interface Props {
  achievements: string[];
}

export const Achievements: React.FC<Props> = ({ achievements }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #E2E8F0",
      padding: "28px 32px",
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}
  >
    {/* Section header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 22,
      }}
    >
      <div
        style={{
          width: 3,
          height: 18,
          background: "#F59E0B",
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
        Career Achievements
      </h3>
      <span
        style={{
          marginLeft: "auto",
          background: "#FEF3C7",
          color: "#92400E",
          borderRadius: 99,
          padding: "2px 10px",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {achievements.length} awards
      </span>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 10,
      }}
    >
      {achievements.map((ach, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "13px 15px",
            background: "#F8FAFC",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 13,
            }}
          >
            🏆
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#0F172A",
              fontWeight: 500,
              lineHeight: 1.5,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {ach}
          </p>
        </div>
      ))}
    </div>
  </div>
);
