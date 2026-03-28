import React, { useEffect, useState } from "react";
import type { PlayerInfo, PlayerProfile } from "../utils/types";
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  profile: PlayerProfile;
  info: PlayerInfo;
  searchedName: string;
}

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      border: "1px solid rgba(255,255,255,.15)",
      background: "rgba(255,255,255,.08)",
      color: "rgba(255,255,255,.75)",
      margin: 2,
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {children}
  </span>
);

const InfoBox: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div
    style={{
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 12,
      padding: "12px 16px",
      textAlign: "center",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: 9,
        color: "rgba(255,255,255,.4)",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </p>
    <p
      style={{
        margin: "4px 0 0",
        fontSize: 14,
        fontWeight: 600,
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {value}
    </p>
  </div>
);

export const PlayerInfoComponent: React.FC<Props> = ({
  profile,
  info,
  searchedName,
}) => {
  const isMobile = useIsMobile();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerImage = async () => {
      try {
        const playerName = encodeURIComponent(searchedName.replace(/\s/g, "_"));
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${playerName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query.pages;
        const page = pages[Object.keys(pages)[0]];
        setImageUrl(page?.thumbnail?.source || null);
      } catch {
        setImageUrl(null);
      } finally {
        setImgLoading(false);
      }
    };
    fetchPlayerImage();
  }, [searchedName]);

  const avatar = (size: number, fontSize: number) => (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,.2)",
          overflow: "hidden",
          background: "rgba(255,255,255,.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize,
          fontWeight: 700,
          color: "rgba(255,255,255,.6)",
        }}
      >
        {imgLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,.05)",
              animation: "pulse 1.5s infinite",
            }}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={profile.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          profile.name.charAt(0)
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 4,
          right: 0,
          background: "#22C55E",
          borderRadius: 99,
          padding: "2px 9px",
          fontSize: 9,
          fontWeight: 600,
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Active
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
        borderRadius: 20,
        padding: isMobile ? "22px 16px 18px" : "36px",
        color: "#fff",
      }}
    >
      {isMobile ? (
        /* ── MOBILE layout ── */
        <>
          {/* Row 1: avatar + name */}
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {avatar(66, 24)}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: 9,
                  color: "rgba(255,255,255,.4)",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cricket Player Profile
              </p>
              <h1
                style={{
                  margin: "0 0 3px",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: -0.5,
                  color: "#fff",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {profile.name}
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,.45)",
                  fontSize: 12,
                  fontStyle: "italic",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                "{profile.also_known_as}"
              </p>
            </div>
          </div>

          {/* Row 2: tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 14,
            }}
          >
            <Tag>{info.role}</Tag>
            <Tag>{info.batting_handedness}</Tag>
            <Tag>{info.bowling_style}</Tag>
            <Tag>{profile.origin.country}</Tag>
            <Tag>Age {profile.age_as_of_jan_2025}</Tag>
          </div>

          {/* Row 3: State + Teams */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <InfoBox label="State" value={profile.origin.state} />
            <InfoBox
              label="Teams"
              value={profile.origin.teams.slice(0, 2).join(", ")}
            />
          </div>

          {/* Row 4: Career background */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.08)",
              paddingTop: 16,
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 10,
                color: "rgba(255,255,255,.35)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Career Background
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {profile.background
                .split(/(?<=[.!?])\s+/)
                .filter((s) => s.trim().length > 0)
                .map((sentence, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 13,
                      color: "rgba(255,255,255,.65)",
                      lineHeight: 1.7,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 5,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.35)",
                      }}
                    />
                    {sentence.trim()}
                  </li>
                ))}
            </ul>
          </div>
        </>
      ) : (
        /* ── DESKTOP layout (original) ── */
        <>
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {avatar(120, 44)}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 10,
                  color: "rgba(255,255,255,.4)",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cricket Player Profile
              </p>
              <h1
                style={{
                  margin: "0 0 4px",
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: -1.5,
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                {profile.name}
              </h1>
              <p
                style={{
                  margin: "0 0 14px",
                  color: "rgba(255,255,255,.45)",
                  fontSize: 13,
                  fontStyle: "italic",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                "{profile.also_known_as}"
              </p>
              <div style={{ marginBottom: 20 }}>
                <Tag>{info.role}</Tag>
                <Tag>{info.batting_handedness}</Tag>
                <Tag>{info.bowling_style}</Tag>
                <Tag>{profile.origin.country}</Tag>
                <Tag>Age {profile.age_as_of_jan_2025}</Tag>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: 10,
                }}
              >
                <InfoBox label="State" value={profile.origin.state} />
                <InfoBox
                  label="Teams"
                  value={profile.origin.teams.slice(0, 2).join(", ")}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 10,
                color: "rgba(255,255,255,.35)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Career Background
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {profile.background
                .split(/(?<=[.!?])\s+/)
                .filter((s) => s.trim().length > 0)
                .map((sentence, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 13,
                      color: "rgba(255,255,255,.65)",
                      lineHeight: 1.7,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 5,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.35)",
                      }}
                    />
                    {sentence.trim()}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  );
};
