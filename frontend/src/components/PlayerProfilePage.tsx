import React, { useState, useEffect } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { Achievements } from "./Achievements";
import { Summary } from "./Summary";
import { FormatStatsComponent } from "./FormatStats";
import { YearWiseStats } from "./YearWiseStats";
import { LandingSection } from "./LandingSection";
import { StatsLoader } from "./Loader";
import type { PlayerFormats } from "../utils/types";
import {
  Info,
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Trophy,
  UserCircle,
  Target,
  Activity,
  Zap,
  Medal,
  Shield,
  CircleDot,  
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

// ── Color palette ─────────────────────────────────────────────────────────────
const PALETTE = {
  primary: "#3D405B",
  secondary: "#3D405B",
  tertiary: "#3D405B",
  muted: "#3D405B",
};

const ICON_TINTS = {
  blue: { bg: "#EEF2FF", color: "#4F6CBA" },
  violet: { bg: "#F0EEFF", color: "#6D54C4" },
  green: { bg: "#EDFAF3", color: "#2E9E6A" },
  amber: { bg: "#FFF8EC", color: "#C48A1A" },
  rose: { bg: "#FFF0F3", color: "#C4435A" },
  cyan: { bg: "#EEF9FC", color: "#2095AC" },
  slate: { bg: "#F1F4F8", color: "#5A6A85" },
};

const FMT_ACCENT: Record<string, string> = {
  Test: "#3D405B",
  ODI: "#4F6CBA",
  T20I: "#6D54C4",
  IPL: "#C48A1A",
};

type TabKey = "overview" | "stats" | "yearwise" | "achievements" | "background";

const TAB_CONFIG: Record<
  TabKey,
  { activeColor: string; icon: React.ReactNode }
> = {
  overview: { activeColor: "#4F6CBA", icon: <LayoutDashboard size={13} /> },
  stats: { activeColor: "#6D54C4", icon: <BarChart2 size={13} /> },
  yearwise: { activeColor: "#2E9E6A", icon: <TrendingUp size={13} /> },
  achievements: { activeColor: "#C48A1A", icon: <Trophy size={13} /> },
  background: { activeColor: "#C4435A", icon: <UserCircle size={13} /> },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #E8EBF2",
      padding: "24px 28px",
      boxShadow: "0 1px 4px rgba(61,64,91,.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "#4F6CBA",
}) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}
  >
    <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: PALETTE.primary,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: -0.2,
      }}
    >
      {children}
    </span>
  </div>
);

type TintKey = keyof typeof ICON_TINTS;

interface StatCellDef {
  label: string;
  value: string | number;
  sub: string;
  tint: TintKey;
  icon: React.ReactNode;
}

const StatCell: React.FC<StatCellDef & { isMobile: boolean }> = ({
  label,
  value,
  sub,
  tint,
  icon,
  isMobile,
}) => {
  const { bg, color } = ICON_TINTS[tint];
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8EBF2",
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: isMobile ? "calc(50% - 6px)" : 148,
        boxShadow: "0 2px 8px rgba(61,64,91,.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            fontFamily: "'DM Mono', monospace",
            color: "#B0B5CC",
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: isMobile ? 22 : 26,
          fontWeight: 800,
          fontFamily: "'DM Mono', monospace",
          color: PALETTE.primary,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: 0.7,
            color: PALETTE.primary,
            marginBottom: 2,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 10,
            color: PALETTE.muted,
            opacity: 0.55,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
};

const HeroComparisons: React.FC<{
  comparisons: string[];
  fullWidth?: boolean;
  playerName: string;
  onCompare: (o: string) => void;
}> = ({ comparisons, fullWidth, playerName, onCompare }) => {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const accentColors = ["#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#F87171"];
  return (
    <div
      style={{
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 16,
        padding: "16px 18px",
        width: fullWidth ? "100%" : undefined,
        minWidth: fullWidth ? "unset" : 220,
        maxWidth: fullWidth ? "100%" : 280,
        flexShrink: 0,
        boxSizing: "border-box" as const,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 14,
            filter: "drop-shadow(0 0 6px #FBBF24)",
            lineHeight: 1,
          }}
        >
          ⚡
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,.75)",
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 110,
            }}
          >
            {playerName.split(" ")[0]}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: "#FBBF24",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: 1.5,
              textShadow: "0 0 8px #F59E0B",
            }}
          >
            VS
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,.3)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            similar players
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {comparisons.map((name, i) => {
          const accent = accentColors[i % 5];
          const isHov = hovered === name;
          return (
            <button
              key={name}
              onClick={() => onCompare(name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: isHov ? `${accent}20` : "rgba(255,255,255,.04)",
                border: `1px solid ${isHov ? `${accent}55` : "rgba(255,255,255,.08)"}`,
                borderRadius: 9,
                padding: "6px 10px",
                cursor: "pointer",
                transition: "all .15s ease",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: isHov ? accent : `${accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 800,
                  color: isHov ? "#0F172A" : accent,
                  flexShrink: 0,
                  fontFamily: "'DM Mono', monospace",
                  transition: "all .15s",
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isHov ? "#fff" : "rgba(255,255,255,.72)",
                  fontFamily: "'DM Sans', sans-serif",
                  flex: 1,
                  transition: "color .15s",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: accent,
                  opacity: isHov ? 1 : 0,
                  transition: "opacity .15s",
                }}
              >
                →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Wikipedia image fetch — tries multiple name variants ──────────────────────
async function fetchWikipediaImage(name: string): Promise<string | null> {
  // Try multiple title variants: original, underscored, first+last only
  const variants = [
    name.trim(),
    name.trim().replace(/\s+/g, "_"),
    name.trim().split(" ").slice(0, 2).join("_"),
  ];

  for (const title of variants) {
    try {
      const encoded = encodeURIComponent(title);
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
      const res = await fetch(url);
      const json = await res.json();
      const pages = json?.query?.pages ?? {};
      const page = pages[Object.keys(pages)[0]];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    } catch {
      // try next variant
    }
  }
  return null;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export const PlayerProfilePage: React.FC = () => {
  const [inputName, setInputName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedFormat, setSelectedFormat] =
    useState<keyof PlayerFormats>("ODI");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [showTooltip, setShowTooltip] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImgLoading, setHeroImgLoading] = useState(false);

  const isMobile = useIsMobile();
  const { data, loading, error } = usePlayer(playerName);

  // Fetch Wikipedia image whenever playerName changes
  useEffect(() => {
    if (!playerName) {
      setHeroImageUrl(null);
      return;
    }
    let cancelled = false;
    setHeroImgLoading(true);
    setHeroImageUrl(null);
    fetchWikipediaImage(playerName).then((url) => {
      if (!cancelled) {
        setHeroImageUrl(url);
        setHeroImgLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  const handleSubmit = () => {
    if (inputName.trim()) {
      setPlayerName(inputName.trim());
      setSelectedFormat("ODI");
      setActiveTab("overview");
    }
  };

  const formatKeys: (keyof PlayerFormats)[] = data?.formats
    ? (Object.keys(data.formats) as (keyof PlayerFormats)[])
    : [];

  const NAV_TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "stats", label: "Format Stats" },
    { key: "yearwise", label: "Year-wise" },
    { key: "achievements", label: "Achievements" },
    { key: "background", label: "Background" },
  ];

  // ── Avatar renderer (shared mobile/desktop) ────────────────────────────────
  const renderAvatar = (size: number) => (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${size > 80 ? 3 : 2}px solid rgba(255,255,255,.25)`,
          background: "rgba(255,255,255,.1)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.38,
          fontWeight: 700,
          color: "rgba(255,255,255,.7)",
          fontFamily: "'DM Mono', monospace",
          boxShadow: "0 8px 32px rgba(0,0,0,.35)",
        }}
      >
        {heroImgLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,.07)",
              animation: "pulse 1.5s infinite",
            }}
          />
        ) : heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={data?.player_profile.name ?? ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        ) : (
          // Fallback: show jersey number
          (data?.player_profile.jersey_number ?? "#")
        )}
      </div>

      {/* Jersey number badge — shown over photo, or always if no photo */}
      {data && (
        <div
          style={{
            position: "absolute",
            bottom: size > 80 ? 2 : 0,
            left: size > 80 ? 2 : 0,
            background: heroImageUrl
              ? "rgba(0,0,0,.65)"
              : "rgba(255,255,255,.15)",
            backdropFilter: "blur(4px)",
            borderRadius: size > 80 ? "0 8px 0 50%" : "0 6px 0 50%",
            padding: size > 80 ? "3px 8px" : "2px 5px",
            fontSize: size > 80 ? 11 : 9,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.2,
            display: "block",
          }}
        >
          #{data.player_profile.jersey_number ?? "—"}
        </div>
      )}

      {/* Active badge */}
      <div
        style={{
          position: "absolute",
          bottom: size > 80 ? 4 : 0,
          right: 0,
          background: "#22C55E",
          borderRadius: 99,
          padding: size > 80 ? "2px 9px" : "1px 6px",
          fontSize: size > 80 ? 9 : 8,
          fontWeight: 700,
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
        minHeight: "100vh",
        background: "#F4F6FB",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: isMobile ? "16px 12px" : "32px 16px",
        }}
      >
        {/* ── Search bar ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E8EBF2",
            padding: "16px 22px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 24,
            boxShadow: "0 1px 4px rgba(61,64,91,.06)",
          }}
        >
          <span style={{ fontSize: 18 }}>🏏</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            style={{ display: "flex", flex: 1, gap: 10, alignItems: "center" }}
          >
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Search any cricket player..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                color: PALETTE.primary,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                background: "transparent",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              disabled={!inputName.trim() || loading}
              style={{
                background:
                  inputName.trim() && !loading ? PALETTE.primary : "#CBD5E1",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "9px 22px",
                fontSize: 13,
                fontWeight: 600,
                cursor:
                  inputName.trim() && !loading ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              Search
            </button>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setShowTooltip((p) => !p)}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Info"
              >
                <Info size={15} color="#64748B" />
              </button>
              {showTooltip && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 38,
                    zIndex: 20,
                    width: 240,
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "12px 14px",
                    boxShadow: "0 8px 24px rgba(0,0,0,.1)",
                    fontSize: 12,
                    color: "#334155",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>Tip:</strong> Use the player's full name for the most
                  accurate results.
                </div>
              )}
            </div>
          </form>
        </div>

        {loading && <StatsLoader />}
        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: "14px 18px",
              color: "#DC2626",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Error: {error}
          </div>
        )}
        {!loading && !error && !data && playerName && (
          <p
            style={{
              textAlign: "center",
              color: "#64748B",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No player data found for "{playerName}".
          </p>
        )}
        {!playerName && <LandingSection />}

        {/* ── Player data ── */}
        {!loading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ── HERO CARD ── */}
            <div
              style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
                borderRadius: 20,
                padding: isMobile ? "22px 16px 18px" : "36px 36px 32px",
                color: "#fff",
              }}
            >
              {isMobile ? (
                <>
                  {/* Avatar + name row */}
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    {renderAvatar(68)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 9,
                          color: "rgba(255,255,255,.4)",
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          fontWeight: 600,
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
                        }}
                      >
                        {data.player_profile.name}
                      </h1>
                      <p
                        style={{
                          margin: 0,
                          color: "rgba(255,255,255,.45)",
                          fontSize: 12,
                          fontStyle: "italic",
                        }}
                      >
                        "{data.player_profile.also_known_as}"
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 14,
                    }}
                  >
                    {[
                      data.player_info.role,
                      data.player_info.batting_handedness,
                      data.player_info.bowling_style,
                      data.player_profile.origin.country,
                      `Age ${data.player_profile.age_as_of_jan_2025}`,
                    ].map((t) => (
                      <span
                        key={t}
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 500,
                          border: "1px solid rgba(255,255,255,.14)",
                          background: "rgba(255,255,255,.07)",
                          color: "rgba(255,255,255,.75)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* ── Origin & Teams ── */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    {/* Country + State side by side */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,.07)",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 12,
                          padding: "10px 12px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "rgba(255,255,255,.4)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Country
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {data.player_profile.origin.country}
                        </p>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,.07)",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 12,
                          padding: "10px 12px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "rgba(255,255,255,.4)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          State
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {data.player_profile.origin.state}
                        </p>
                      </div>
                    </div>

                    {/* Teams */}
                    <div>
                      <p
                        style={{
                          margin: "0 0 6px",
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "rgba(255,255,255,.4)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Teams
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {data.player_profile.origin.teams.map((team, i) => {
                          const IPL_TEAMS = [
                            "MI",
                            "CSK",
                            "RCB",
                            "KKR",
                            "SRH",
                            "DC",
                            "PBKS",
                            "RR",
                            "LSG",
                            "GT",
                            "PWI",
                            "Deccan",
                            "Kochi",
                            "Rising Pune",
                          ];
                          const ipl = IPL_TEAMS.some((x) => team.includes(x));
                          return (
                            <span
                              key={i}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                background: ipl
                                  ? "rgba(196,138,26,.25)"
                                  : "rgba(255,255,255,.08)",
                                border: `1px solid ${ipl ? "rgba(196,138,26,.4)" : "rgba(255,255,255,.12)"}`,
                                color: ipl ? "#FBBF24" : "rgba(255,255,255,.8)",
                                fontFamily: "'DM Sans', sans-serif",
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: ipl ? "#FBBF24" : "#60A5FA",
                                  flexShrink: 0,
                                  display: "inline-block",
                                }}
                              />
                              {team}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Comparisons — full width */}
                  {data.comparisons?.length > 0 && (
                    <HeroComparisons
                      comparisons={data.comparisons}
                      playerName={data.player_profile.name}
                      onCompare={(opp) => {
                        setInputName(opp);
                        setPlayerName(opp);
                        setActiveTab("overview");
                      }}
                      fullWidth={true}
                    />
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {renderAvatar(100)}

                  {/* Player name + tags */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 10,
                        color: "rgba(255,255,255,.4)",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        fontWeight: 600,
                      }}
                    >
                      Cricket Player Profile
                    </p>
                    <h1
                      style={{
                        margin: "0 0 4px",
                        fontSize: 36,
                        fontWeight: 700,
                        letterSpacing: -1.5,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {data.player_profile.name}
                    </h1>
                    <p
                      style={{
                        margin: "0 0 14px",
                        color: "rgba(255,255,255,.45)",
                        fontSize: 13,
                        fontStyle: "italic",
                      }}
                    >
                      "{data.player_profile.also_known_as}"
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {[
                        data.player_info.role,
                        data.player_info.batting_handedness,
                        data.player_info.bowling_style,
                        data.player_profile.origin.country,
                        `Age ${data.player_profile.age_as_of_jan_2025}`,
                      ].map((t) => (
                        <span
                          key={t}
                          style={{
                            display: "inline-block",
                            padding: "3px 12px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 500,
                            border: "1px solid rgba(255,255,255,.14)",
                            background: "rgba(255,255,255,.07)",
                            color: "rgba(255,255,255,.75)",
                            margin: 2,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Origin & Teams — center fill ── */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {/* Country + State row */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <div
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,.07)",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 12,
                          padding: "10px 14px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "rgba(255,255,255,.4)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Country
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {data.player_profile.origin.country}
                        </p>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,.07)",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 12,
                          padding: "10px 14px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 3px",
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "rgba(255,255,255,.4)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          State
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {data.player_profile.origin.state}
                        </p>
                      </div>
                    </div>

                    {/* Teams */}
                    <div>
                      <p
                        style={{
                          margin: "0 0 6px",
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "rgba(255,255,255,.4)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Teams
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {data.player_profile.origin.teams.map((team, i) => {
                          const IPL_TEAMS = [
                            "MI",
                            "CSK",
                            "RCB",
                            "KKR",
                            "SRH",
                            "DC",
                            "PBKS",
                            "RR",
                            "LSG",
                            "GT",
                            "PWI",
                            "Deccan",
                            "Kochi",
                            "Rising Pune",
                          ];
                          const ipl = IPL_TEAMS.some((x) => team.includes(x));
                          return (
                            <span
                              key={i}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                background: ipl
                                  ? "rgba(196,138,26,.25)"
                                  : "rgba(255,255,255,.08)",
                                border: `1px solid ${ipl ? "rgba(196,138,26,.4)" : "rgba(255,255,255,.12)"}`,
                                color: ipl ? "#FBBF24" : "rgba(255,255,255,.8)",
                                fontFamily: "'DM Sans', sans-serif",
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: ipl ? "#FBBF24" : "#60A5FA",
                                  flexShrink: 0,
                                  display: "inline-block",
                                }}
                              />
                              {team}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Comparisons */}
                  {data.comparisons?.length > 0 && (
                    <HeroComparisons
                      comparisons={data.comparisons}
                      playerName={data.player_profile.name}
                      onCompare={(opp) => {
                        setInputName(opp);
                        setPlayerName(opp);
                        setActiveTab("overview");
                      }}
                      fullWidth={false}
                    />
                  )}
                </div>
              )}
            </div>

            {/* ── Nav tabs ── */}
            <div
              style={{
                display: "flex",
                gap: 3,
                background: "#fff",
                borderRadius: 14,
                padding: 4,
                border: "1px solid #E8EBF2",
                width: isMobile ? "100%" : "fit-content",
                overflowX: isMobile ? "auto" : "visible",
                WebkitOverflowScrolling: "touch",
                boxShadow: "0 1px 4px rgba(61,64,91,.06)",
              }}
            >
              {NAV_TABS.map(({ key, label }) => {
                const cfg = TAB_CONFIG[key];
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      background: isActive ? cfg.activeColor : "transparent",
                      color: isActive ? "#fff" : PALETTE.muted,
                      border: "none",
                      borderRadius: 10,
                      padding: isMobile ? "7px 11px" : "8px 16px",
                      fontSize: isMobile ? 12 : 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .18s",
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      opacity: isActive ? 1 : 0.6,
                      boxShadow: isActive
                        ? `0 2px 10px ${cfg.activeColor}33`
                        : "none",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: isActive ? "#fff" : cfg.activeColor,
                        transition: "all .18s",
                      }}
                    >
                      {cfg.icon}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── OVERVIEW tab ── */}
            {activeTab === "overview" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {(() => {
                  const role = data.player_info.role?.toLowerCase() ?? "";
                  const isAllRounder = role.includes("all");
                  const isPureBowler = role.includes("bowl") && !isAllRounder;
                  const showBatting = !isPureBowler;
                  const showBowling = isAllRounder || isPureBowler;

                  const INTL_KEYS = (
                    Object.keys(data.formats) as (keyof PlayerFormats)[]
                  ).filter((k) => k !== "IPL");
                  const IPL = data.formats["IPL" as keyof PlayerFormats];

                  const sumBat = {
                    runs: 0,
                    hundreds: 0,
                    fifties: 0,
                    matches: 0,
                    innings: 0,
                    not_outs: 0,
                    strike_rate_num: 0,
                    sr_weight: 0,
                  };
                  const sumBowl = {
                    wickets: 0,
                    matches: 0,
                    four_wicket_hauls: 0,
                    five_wicket_hauls: 0,
                    innings_bowled: 0,
                    economy_num: 0,
                    econ_weight: 0,
                  };

                  INTL_KEYS.forEach((fk) => {
                    const fb = data.formats[fk]?.batting;
                    const fw = data.formats[fk]?.bowling;
                    if (fb) {
                      sumBat.runs += fb.runs ?? 0;
                      sumBat.hundreds += fb.hundreds ?? 0;
                      sumBat.fifties += fb.fifties ?? 0;
                      sumBat.innings += fb.innings ?? 0;
                      sumBat.matches += fb.matches ?? 0;
                      sumBat.strike_rate_num +=
                        (fb.strike_rate ?? 0) * (fb.innings ?? 0);
                      sumBat.sr_weight += fb.innings ?? 0;
                    }
                    if (fw) {
                      sumBowl.wickets += fw.wickets ?? 0;
                      sumBowl.matches += fw.matches ?? 0;
                      sumBowl.four_wicket_hauls += fw.four_wicket_hauls ?? 0;
                      sumBowl.five_wicket_hauls += fw.five_wicket_hauls ?? 0;
                      sumBowl.innings_bowled += fw.innings_bowled ?? 0;
                      sumBowl.economy_num +=
                        (fw.economy ?? 0) * (fw.innings_bowled ?? 0);
                      sumBowl.econ_weight += fw.innings_bowled ?? 0;
                    }
                  });

                  const intlAvg =
                    sumBat.innings - sumBat.not_outs > 0
                      ? (
                          sumBat.runs /
                          (sumBat.innings - sumBat.not_outs)
                        ).toFixed(2)
                      : "—";
                  const intlSR =
                    sumBat.sr_weight > 0
                      ? (sumBat.strike_rate_num / sumBat.sr_weight).toFixed(1)
                      : "—";
                  const intlEcon =
                    sumBowl.econ_weight > 0
                      ? (sumBowl.economy_num / sumBowl.econ_weight).toFixed(2)
                      : "—";
                  const iplBat = IPL?.batting;
                  const iplBowl = IPL?.bowling;
                  const iplAvg = iplBat
                    ? (iplBat.innings ?? 0) > 0
                      ? (iplBat.runs / (iplBat.innings ?? 0)).toFixed(2)
                      : "—"
                    : null;

                  const mk = (
                    label: string,
                    value: string | number,
                    sub: string,
                    tint: TintKey,
                    icon: React.ReactNode,
                  ): StatCellDef => ({ label, value, sub, tint, icon });

                  const intlBatCells: StatCellDef[] = [
                    mk(
                      "Matches",
                      sumBat.matches,
                      "Est. from innings",
                      "slate",
                      <Shield size={15} />,
                    ),
                    mk(
                      "Innings",
                      sumBat.innings,
                      "Across all formats",
                      "slate",
                      <Activity size={15} />,
                    ),
                    mk(
                      "Total Runs",
                      sumBat.runs.toLocaleString(),
                      "Test + ODI + T20I",
                      "blue",
                      <Target size={15} />,
                    ),
                    mk(
                      "Average",
                      intlAvg,
                      "Weighted overall",
                      "green",
                      <TrendingUp size={15} />,
                    ),
                    mk(
                      "Strike Rate",
                      intlSR,
                      "Combined SR",
                      "cyan",
                      <Zap size={15} />,
                    ),
                    mk(
                      "Centuries",
                      sumBat.hundreds,
                      "Across all formats",
                      "amber",
                      <Trophy size={15} />,
                    ),
                    mk(
                      "Fifties",
                      sumBat.fifties,
                      "Across all formats",
                      "violet",
                      <Medal size={15} />,
                    ),
                  ];

                  const intlBowlCells: StatCellDef[] = [
                    mk(
                      "Matches",
                      sumBowl.matches,
                      "Est. from innings",
                      "slate",
                      <Shield size={15} />,
                    ),
                    mk(
                      "Innings",
                      sumBowl.innings_bowled,
                      "Across all formats",
                      "slate",
                      <Activity size={15} />,
                    ),
                    mk(
                      "Wickets",
                      sumBowl.wickets,
                      "Test + ODI + T20I",
                      "blue",
                      <Target size={15} />,
                    ),
                    mk(
                      "Economy",
                      intlEcon,
                      "Weighted overall",
                      "green",
                      <TrendingUp size={15} />,
                    ),
                    mk(
                      "5-Wkt Hauls",
                      sumBowl.five_wicket_hauls,
                      "Fifers",
                      "amber",
                      <Trophy size={15} />,
                    ),
                    mk(
                      "4-Wkt Hauls",
                      sumBowl.four_wicket_hauls,
                      "4W hauls",
                      "violet",
                      <Medal size={15} />,
                    ),
                    mk(
                      "Inns Bowled",
                      sumBowl.innings_bowled,
                      "Total innings",
                      "cyan",
                      <CircleDot size={15} />,
                    ),
                  ];

                  const iplBatCells: StatCellDef[] = iplBat
                    ? [
                        mk(
                          "Matches",
                          iplBat.matches ?? 0,
                          "All IPL seasons",
                          "slate",
                          <Shield size={15} />,
                        ),
                        mk(
                          "Innings",
                          iplBat.innings ?? 0,
                          "All IPL seasons",
                          "slate",
                          <Activity size={15} />,
                        ),
                        mk(
                          "IPL Runs",
                          (iplBat.runs ?? 0).toLocaleString(),
                          "All IPL seasons",
                          "amber",
                          <Target size={15} />,
                        ),
                        mk(
                          "Average",
                          iplAvg ?? "—",
                          "Per dismissal",
                          "green",
                          <TrendingUp size={15} />,
                        ),
                        mk(
                          "Strike Rate",
                          (iplBat.strike_rate ?? 0).toFixed(1),
                          "Strike rate",
                          "cyan",
                          <Zap size={15} />,
                        ),
                        mk(
                          "Centuries",
                          iplBat.hundreds ?? 0,
                          "IPL hundreds",
                          "violet",
                          <Trophy size={15} />,
                        ),
                        mk(
                          "Fifties",
                          iplBat.fifties ?? 0,
                          "IPL fifties",
                          "blue",
                          <Medal size={15} />,
                        ),
                      ]
                    : [];

                  const iplBowlCells: StatCellDef[] =
                    iplBowl && (iplBowl.wickets ?? 0) > 0
                      ? [
                          mk(
                            "Matches",
                            iplBowl.matches ?? 0,
                            "All IPL seasons",
                            "slate",
                            <Shield size={15} />,
                          ),
                          mk(
                            "Innings",
                            iplBowl.innings_bowled ?? 0,
                            "All IPL seasons",
                            "slate",
                            <Activity size={15} />,
                          ),
                          mk(
                            "IPL Wickets",
                            iplBowl.wickets ?? 0,
                            "All IPL seasons",
                            "amber",
                            <Target size={15} />,
                          ),
                          mk(
                            "Economy",
                            (iplBowl.economy ?? 0).toFixed(2),
                            "IPL economy",
                            "green",
                            <TrendingUp size={15} />,
                          ),
                          mk(
                            "4W Hauls",
                            iplBowl.four_wicket_hauls ?? 0,
                            "IPL 4-fors",
                            "violet",
                            <Trophy size={15} />,
                          ),
                        ]
                      : [];

                  const SectionHead: React.FC<{
                    children: React.ReactNode;
                    color?: string;
                  }> = ({ children, color = "#64748B" }) => (
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: 1,
                        color,
                        margin: "14px 0 8px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {children}
                    </p>
                  );

                  return (
                    <>
                      {/* ── International career ── */}
                      <Card>
                        <SectionLabel color="#4F6CBA">
                          International career — overall
                        </SectionLabel>
                        {showBatting && intlBatCells.length > 0 && (
                          <>
                            <SectionHead>Batting</SectionHead>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                              }}
                            >
                              {intlBatCells.map((c) => (
                                <StatCell
                                  key={c.label}
                                  {...c}
                                  isMobile={isMobile}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        {showBowling &&
                          intlBowlCells.length > 0 &&
                          sumBowl.wickets > 0 && (
                            <>
                              <SectionHead>Bowling</SectionHead>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 10,
                                }}
                              >
                                {intlBowlCells.map((c) => (
                                  <StatCell
                                    key={c.label}
                                    {...c}
                                    isMobile={isMobile}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                      </Card>

                      {/* ── IPL career ── */}
                      {(iplBatCells.length > 0 || iplBowlCells.length > 0) && (
                        <Card>
                          <SectionLabel color="#C48A1A">
                            IPL career — overall
                          </SectionLabel>
                          {showBatting && iplBatCells.length > 0 && (
                            <>
                              <SectionHead color="#C48A1A">Batting</SectionHead>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 10,
                                }}
                              >
                                {iplBatCells.map((c) => (
                                  <StatCell
                                    key={c.label}
                                    {...c}
                                    isMobile={isMobile}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          {showBowling && iplBowlCells.length > 0 && (
                            <>
                              <SectionHead color="#C48A1A">Bowling</SectionHead>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 10,
                                }}
                              >
                                {iplBowlCells.map((c) => (
                                  <StatCell
                                    key={c.label}
                                    {...c}
                                    isMobile={isMobile}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </Card>
                      )}

                      {/* ── Top achievements ── */}
                      <Card>
                        <SectionLabel color="#C48A1A">
                          Top achievements
                        </SectionLabel>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: 10,
                          }}
                        >
                          {data.achievements.slice(0, 6).map((a, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                padding: "12px 14px",
                                background: "#F8FAFC",
                                borderRadius: 12,
                                border: "1px solid #E8EBF2",
                              }}
                            >
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  background: "#FEF3C7",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  fontSize: 12,
                                }}
                              >
                                🏆
                              </div>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: PALETTE.primary,
                                  fontWeight: 500,
                                  lineHeight: 1.5,
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                {a}
                              </p>
                            </div>
                          ))}
                        </div>
                        {data.achievements.length > 6 && (
                          <button
                            onClick={() => setActiveTab("achievements")}
                            style={{
                              marginTop: 12,
                              background: "none",
                              border: "none",
                              color: "#4F6CBA",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            View all {data.achievements.length} achievements →
                          </button>
                        )}
                      </Card>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ── FORMAT STATS tab ── */}
            {activeTab === "stats" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {isMobile ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {formatKeys.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFormat(f)}
                        style={{
                          background:
                            selectedFormat === f
                              ? FMT_ACCENT[f] || PALETTE.primary
                              : "#fff",
                          color: selectedFormat === f ? "#fff" : PALETTE.muted,
                          border: `1px solid ${selectedFormat === f ? FMT_ACCENT[f] || PALETTE.primary : "#E8EBF2"}`,
                          borderRadius: 12,
                          padding: "10px 8px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all .2s",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {formatKeys.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFormat(f)}
                        style={{
                          background:
                            selectedFormat === f
                              ? FMT_ACCENT[f] || PALETTE.primary
                              : "#fff",
                          color: selectedFormat === f ? "#fff" : PALETTE.muted,
                          border: `1px solid ${selectedFormat === f ? FMT_ACCENT[f] || PALETTE.primary : "#E8EBF2"}`,
                          borderRadius: 999,
                          padding: "8px 22px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all .2s",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
                <FormatStatsComponent
                  formatName={selectedFormat}
                  stats={data.formats[selectedFormat]}
                  isMobile={isMobile}
                  role={data.player_info.role}
                />
              </div>
            )}

            {activeTab === "yearwise" && (
              <YearWiseStats
                formats={data.formats}
                role={data.player_info.role}
              />
            )}
            {activeTab === "achievements" && (
              <Achievements achievements={data.achievements} />
            )}

            {/* ── BACKGROUND tab — Career Background + Summary ONLY ── */}
            {activeTab === "background" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <Card>
                  <SectionLabel color="#C4435A">Career Background</SectionLabel>
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
                    {data.player_profile.background
                      .split(/(?<=[.!?])\s+/)
                      .filter((s) => s.trim().length > 0)
                      .map((sentence, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            fontSize: 14,
                            color: PALETTE.primary,
                            lineHeight: 1.75,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              marginTop: 9,
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#C4435A",
                              opacity: 0.5,
                              display: "block",
                            }}
                          />
                          {sentence.trim()}
                        </li>
                      ))}
                  </ul>
                </Card>
                <Summary summary={data.summary} />
              </div>
            )}

            {data.note && (
              <p
                style={{
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: 11,
                  fontStyle: "italic",
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: 8,
                }}
              >
                {data.note}
              </p>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  );
};
