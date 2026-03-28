import React, { useEffect, useRef, useState, useCallback } from "react";
import logo from "../assets/logo.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Feature {
  number: string;
  title: string;
  desc: string;
  accent: string;
  accentBg: string;
  accentRgb: string;
  stat: string;
  statLabel: string;
  isNew?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const features: Feature[] = [
  {
    number: "01",
    title: "Player Profiles",
    desc: "Deep intelligence on every cricketer — career arcs, milestones, and the numbers that define greatness.",
    accent: "#4F6CBA",
    accentBg: "#EEF2FF",
    accentRgb: "79,108,186",
    stat: "5000+",
    statLabel: "Players indexed",
  },
  {
    number: "02",
    title: "Advanced Analytics",
    desc: "Batting, bowling & all-round stats dissected across every format. Precision data, beautifully presented.",
    accent: "#2095AC",
    accentBg: "#EEF9FC",
    accentRgb: "32,149,172",
    stat: "4",
    statLabel: "Formats tracked",
  },
  {
    number: "03",
    title: "Smart Search",
    desc: "Instant lookup by name or team. Powered by AI to surface the right player, every time.",
    accent: "#6D54C4",
    accentBg: "#F0EEFF",
    accentRgb: "109,84,196",
    stat: "< 1min",
    statLabel: "Response time",
  },
];

// ─── Year-wise comparison data ─────────────────────────────────────────────────
const comparisonYears = [
  { year: "2020", runs: 648, avg: 32.4, sr: 88 },
  { year: "2021", runs: 1140, avg: 47.5, sr: 93 },
  { year: "2022", runs: 2272, avg: 57.2, sr: 102 },
  { year: "2023", runs: 1891, avg: 63.0, sr: 97 },
];

const TICKER_ITEMS = [
  "Rohit Sharma", "Virat Kohli", "MS Dhoni", "Sachin Tendulkar",
  "Jasprit Bumrah", "Ben Stokes", "Joe Root", "Steve Smith",
  "Pat Cummins", "Babar Azam", "Kane Williamson", "Rashid Khan",
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────
const Sparkline: React.FC<{ values: number[]; color: string; height?: number }> = ({ values, color, height = 32 }) => {
  const width = 100;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity={0.7} />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return <circle key={i} cx={x} cy={y} r={i === values.length - 1 ? 2.5 : 1.5} fill={color} opacity={i === values.length - 1 ? 1 : 0.5} />;
      })}
    </svg>
  );
};

// ─── Year-wise Comparison Box ─────────────────────────────────────────────────
const YearComparisonBox: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [selectedMetric, setSelectedMetric] = useState<"runs" | "avg" | "sr">("runs");
  const maxVal = Math.max(...comparisonYears.map((y) => y[selectedMetric]));
  const metricLabel: Record<string, string> = { runs: "Runs", avg: "Average", sr: "Strike Rate" };
  const accent = "#2E9E6A";
  const accentRgb = "46,158,106";
  const sparkValues = comparisonYears.map((y) => y[selectedMetric]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity .6s ease .9s, transform .6s cubic-bezier(.22,.68,0,1.2) .9s",
      background: "#fff",
      border: "1.5px solid rgba(46,158,106,.2)",
      borderRadius: 20,
      padding: "22px 22px 18px",
      boxShadow: `0 8px 32px rgba(${accentRgb},.1), 0 2px 8px rgba(61,64,91,.06)`,
      position: "relative",
      overflow: "hidden",
      width: "100%",
      margin: "20px auto 0",
      boxSizing: "border-box" as const,
    }}>
      {/* Header glow */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(${accentRgb},.08) 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: "#EDFAF3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="7" width="2.5" height="6" rx="1" fill={accent} opacity="0.5" />
              <rect x="5" y="4" width="2.5" height="9" rx="1" fill={accent} opacity="0.7" />
              <rect x="9" y="1" width="2.5" height="12" rx="1" fill={accent} />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1A1D2E", letterSpacing: 0.3, display: "block", lineHeight: 1.2 }}>Year-wise Performance</span>
            <span style={{ fontSize: 9, fontFamily: "'DM Sans', sans-serif", color: "#B0B5CC", letterSpacing: 1, textTransform: "uppercase" }}>Virat Kohli · ODI</span>
          </div>
        </div>

        {/* Metric pills */}
        <div style={{ display: "flex", gap: 5 }}>
          {(["runs", "avg", "sr"] as const).map((m) => (
            <button key={m} onClick={() => setSelectedMetric(m)} style={{
              padding: "4px 12px", borderRadius: 999, border: "1px solid",
              borderColor: selectedMetric === m ? accent : "#E8EBF2",
              background: selectedMetric === m ? "#EDFAF3" : "transparent",
              color: selectedMetric === m ? accent : "#B0B5CC",
              fontSize: 9, fontWeight: 700, fontFamily: "'DM Mono', monospace",
              letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
              transition: "all .2s ease",
            }}>
              {metricLabel[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart rows + sparkline */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {comparisonYears.map((row) => {
            const pct = (row[selectedMetric] / maxVal) * 100;
            const isTop = row[selectedMetric] === maxVal;
            return (
              <div key={row.year} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#B0B5CC", width: 28, textAlign: "right", letterSpacing: 0.5, flexShrink: 0 }}>{row.year}</span>
                <div style={{ flex: 1, height: 14, background: "#F4F6FB", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    background: isTop ? `linear-gradient(90deg, ${accent}, #4FC894)` : `rgba(${accentRgb},.35)`,
                    width: `${pct}%`,
                    transition: "width .6s cubic-bezier(.22,.68,0,1.2)",
                    boxShadow: isTop ? `0 0 8px rgba(${accentRgb},.4)` : "none",
                  }} />
                </div>
                <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: isTop ? accent : "#8891AA", width: 34, textAlign: "left", fontWeight: isTop ? 700 : 400, letterSpacing: 0.3, flexShrink: 0 }}>
                  {selectedMetric === "avg" ? row[selectedMetric].toFixed(1) : row[selectedMetric]}
                </span>
                {isTop && (
                  <div style={{ background: "#EDFAF3", border: `1px solid rgba(${accentRgb},.25)`, borderRadius: 999, padding: "1px 6px", fontSize: 7, fontWeight: 700, color: accent, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, flexShrink: 0 }}>
                    PEAK
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sparkline panel */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 12px", background: "#F9FBF9", borderRadius: 12, border: "1px solid #EDFAF3" }}>
          <Sparkline values={sparkValues} color={accent} height={40} />
          <span style={{ fontSize: 7.5, fontFamily: "'DM Mono', monospace", color: "#B0B5CC", letterSpacing: 1, textTransform: "uppercase" }}>Trend</span>
        </div>
      </div>

      {/* Footer insight */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #F0F2F8", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: accent, opacity: 0.6, flexShrink: 0 }} />
        <span style={{ fontSize: 9.5, fontFamily: "'DM Sans', sans-serif", color: "#8891AA", lineHeight: 1.5 }}>
          Peak year detected in <strong style={{ color: accent, fontWeight: 600 }}>2022</strong> · {selectedMetric === "runs" ? "2272 runs in ODIs — career high" : selectedMetric === "avg" ? "57.2 avg — exceptional consistency" : "102 SR — most aggressive year"}
        </span>
      </div>
    </div>
  );
};

// ─── Card component ───────────────────────────────────────────────────────────
const FeatureCard: React.FC<{ f: Feature; index: number; visible: boolean }> = ({ f, index, visible }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const countStarted = useRef(false);
  const [countActive, setCountActive] = useState(false);

  const numericTarget = parseInt(f.stat.replace(/\D/g, "")) || 0;
  const count = useCountUp(numericTarget, 1200, countActive);
  const displayStat = f.stat.includes("+")
    ? `${count.toLocaleString()}+`
    : f.stat.includes("<")
    ? f.stat
    : count.toLocaleString();

  useEffect(() => {
    if (hovered && !countStarted.current) {
      countStarted.current = true;
      setCountActive(true);
    }
  }, [hovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const isNew = f.isNew;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        background: isNew ? "linear-gradient(135deg, #F2FDF7 0%, #fff 60%)" : "#fff",
        border: isNew
          ? `1.5px solid ${hovered ? f.accent + "66" : "rgba(46,158,106,.28)"}`
          : `1px solid ${hovered ? f.accent + "44" : "#E8EBF2"}`,
        borderRadius: 22,
        padding: "30px 28px 28px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hovered
          ? `0 24px 56px rgba(${f.accentRgb},.14), 0 4px 16px rgba(61,64,91,.06)`
          : isNew
          ? `0 6px 24px rgba(46,158,106,.1), 0 2px 8px rgba(61,64,91,.05)`
          : "0 4px 16px rgba(61,64,91,.05)",
        transform: visible
          ? hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: `transform .32s cubic-bezier(.22,.68,0,1.2), box-shadow .28s ease, border-color .22s ease, opacity .55s ease ${index * 0.1 + 0.3}s`,
      }}
    >
      {/* NEW badge */}
      {isNew && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "linear-gradient(120deg, #2E9E6A, #4FC894)",
          borderRadius: 999, padding: "3px 9px",
          display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 2px 8px rgba(46,158,106,.35)",
          animation: "newBadgePop .55s cubic-bezier(.22,.68,0,1.3) .7s both",
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", opacity: 0.9, animation: "pulseRing 1.8s ease-out infinite" }} />
          <span style={{ fontSize: 8, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>New</span>
        </div>
      )}

      {/* Spotlight glow */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 22,
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(${f.accentRgb},.07) 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: isNew ? 4 : 3,
        background: isNew
          ? `linear-gradient(90deg, ${f.accent}, #4FC894, ${f.accent}44)`
          : `linear-gradient(90deg, ${f.accent}, ${f.accent}44)`,
        borderRadius: "22px 22px 0 0",
        transform: hovered || isNew ? "scaleX(1)" : "scaleX(0.4)",
        transformOrigin: "left",
        transition: "transform .35s cubic-bezier(.22,.68,0,1.2)",
      }} />

      {/* Number badge + stat */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: 11,
          background: hovered ? f.accent : f.accentBg,
          transition: "background .25s ease",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: hovered ? "#fff" : f.accent, letterSpacing: 1, transition: "color .25s" }}>{f.number}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: f.accent, lineHeight: 1, letterSpacing: -0.5, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)", transition: "opacity .3s ease, transform .3s ease" }}>{displayStat}</div>
          <div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#B0B5CC", letterSpacing: 1, textTransform: "uppercase", opacity: hovered ? 1 : 0, transition: "opacity .3s ease .05s" }}>{f.statLabel}</div>
        </div>
      </div>

      <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1A1D2E", lineHeight: 1.25, letterSpacing: -0.2 }}>{f.title}</h3>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: hovered ? "#5A6A85" : "#8891AA", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "color .2s" }}>{f.desc}</p>

      {/* "See comparison ↓" nudge for isNew */}
      {isNew && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ height: 1, width: 16, background: f.accent, opacity: 0.5 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: f.accent, fontFamily: "'DM Mono', monospace", letterSpacing: 0.8, opacity: 0.75 }}>See comparison below ↓</span>
        </div>
      )}

      {/* Explore arrow for non-new */}
      {!isNew && (
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6, opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)", transition: "opacity .25s ease .05s, transform .25s ease .05s" }}>
          <div style={{ height: 1, width: 20, background: f.accent }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: f.accent, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>Explore</span>
          <span style={{ fontSize: 11, color: f.accent }}>→</span>
        </div>
      )}

      {/* Corner dot */}
      <div style={{ position: "absolute", bottom: 16, right: 18, width: hovered ? 10 : 6, height: hovered ? 10 : 6, borderRadius: "50%", background: f.accent, opacity: hovered ? 0.5 : 0.2, transition: "width .25s, height .25s, opacity .25s" }} />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const LandingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 60);
    const t2 = setTimeout(() => setCardsVisible(true), 320);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = ["#4F6CBA", "#2095AC", "#6D54C4", "#2E9E6A"];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    particlesRef.current = Array.from({ length: 28 }, (_, id) => ({
      id, x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1, color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.25 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
      });
      ctx.globalAlpha = 1;
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 90) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "#4F6CBA"; ctx.globalAlpha = (1 - dist / 90) * 0.06;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      if (blobRef1.current) blobRef1.current.style.transform = `translate(${cx * 30}px, ${cy * 20}px)`;
      if (blobRef2.current) blobRef2.current.style.transform = `translate(${-cx * 25}px, ${-cy * 18}px)`;
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes lsSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes rotateSlowRev {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.85) translateY(-6px); }
          70%  { transform: scale(1.03) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes newBadgePop {
          0%   { opacity: 0; transform: scale(0.75) translateY(-4px); }
          70%  { transform: scale(1.05) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: .5; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .ls-badge       { animation: badgePop .6s cubic-bezier(.22,.68,0,1.2) .1s both; }
        .ls-hero-line1  { animation: lsSlideUp .65s cubic-bezier(.22,.68,0,1.15) .2s both; }
        .ls-hero-line2  { animation: lsSlideUp .65s cubic-bezier(.22,.68,0,1.15) .32s both; }
        .ls-sub         { animation: lsSlideUp .6s cubic-bezier(.22,.68,0,1.15) .44s both; }
        .ls-cta-wrap    { animation: lsSlideUp .6s cubic-bezier(.22,.68,0,1.15) .54s both; }
        .ls-divider-anim { animation: lsSlideUp .5s ease .62s both; }

        .ls-cta {
          background: #fff;
          border: 1.5px solid #D4D8E8;
          border-radius: 999px;
          padding: 12px 32px;
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #3D405B;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(61,64,91,.08);
          position: relative; overflow: hidden;
          transition: color .22s, border-color .22s, box-shadow .22s;
        }
        .ls-cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, #4F6CBA, #2095AC, #6D54C4);
          opacity: 0; transition: opacity .28s ease; border-radius: 999px;
        }
        .ls-cta:hover::before { opacity: 1; }
        .ls-cta:hover { color: #fff !important; border-color: transparent !important; box-shadow: 0 8px 28px rgba(79,108,186,.32) !important; }
        .ls-cta span { position: relative; z-index: 1; }

        .ticker-wrap { overflow: hidden; width: 100%; }
        .ticker-track { display: flex; width: max-content; animation: ticker 28s linear infinite; }
        .ticker-track.paused { animation-play-state: paused; }
        .ticker-item {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 0 28px; font-size: 11px; font-weight: 600;
          font-family: 'DM Mono', monospace; color: #B0B5CC;
          letter-spacing: 1px; text-transform: uppercase;
          white-space: nowrap; cursor: default; transition: color .2s;
        }
        .ticker-item:hover { color: #4F6CBA; }
        .ticker-dot { width: 3px; height: 3px; border-radius: 50%; background: #D4D8E8; flex-shrink: 0; }

        .gradient-text {
          background: linear-gradient(120deg, #4F6CBA, #2095AC, #2E9E6A, #6D54C4, #4F6CBA);
          background-size: 250% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }

        .new-feature-connector {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          width: 100%;
          margin: 0 auto;
          padding: 0 12px;
          boxSizing: border-box;
        }
        .new-feature-connector::before {
          content: '';
          display: block;
          width: 2px;
          height: 20px;
          background: linear-gradient(180deg, rgba(46,158,106,.3), rgba(46,158,106,.1));
          border-radius: 2px;
        }
      `}</style>

      <section ref={containerRef} style={{ width: "100%", minHeight: "80vh", background: "#FAFBFF", borderRadius: 24, border: "1px solid #E8EBF2", padding: "0 0 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", position: "relative", overflow: "hidden", boxSizing: "border-box", boxShadow: "0 2px 16px rgba(61,64,91,.07)" }}>

        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
        <div ref={blobRef1} style={{ position: "absolute", top: -150, left: -110, width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,108,186,.08) 0%, transparent 68%)", pointerEvents: "none", transition: "transform .8s cubic-bezier(.22,.68,0,1)", zIndex: 0 }} />
        <div ref={blobRef2} style={{ position: "absolute", bottom: -130, right: -90, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,84,196,.075) 0%, transparent 68%)", pointerEvents: "none", transition: "transform .8s cubic-bezier(.22,.68,0,1)", zIndex: 0 }} />

        {/* Rotating rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 680, height: 680, borderRadius: "50%", border: "1px solid rgba(61,64,91,.045)", animation: "rotateSlow 45s linear infinite", pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10, borderRadius: "50%", background: "rgba(79,108,186,.3)", transform: "translateX(-50%)" }} />
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(61,64,91,.035)", animation: "rotateSlowRev 32s linear infinite", pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", bottom: -3, left: "50%", width: 7, height: 7, borderRadius: "50%", background: "rgba(109,84,196,.3)", transform: "translateX(-50%)" }} />
        </div>

        {/* Dot grid */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <defs><pattern id="ldots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.85" fill="#3D405B" opacity="0.065" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#ldots)" />
        </svg>

        {/* ── Hero ── */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "64px 48px 0", width: "100%", boxSizing: "border-box" }}>

          {/* Badge */}
          <div className="ls-badge" style={{ marginBottom: 30, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", border: "1px solid #E0E4F0", borderRadius: 999, background: "#fff", boxShadow: "0 2px 10px rgba(61,64,91,.08)" }}>
            <img src={logo} alt="CricAIlytics" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#8891AA", fontFamily: "'DM Mono', monospace" }}>CricAIlytics</span>
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E", animation: "pulseRing 1.8s ease-out infinite" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", position: "relative", zIndex: 1 }} />
            </div>
          </div>

          <h1 className="ls-hero-line1" style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 66px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, color: "#1A1D2E" }}>
            Cricket Intelligence,
          </h1>
          <h1 className="ls-hero-line2 gradient-text" style={{ margin: "0 0 22px", fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 66px)", fontWeight: 700, fontStyle: "italic", lineHeight: 1.1, letterSpacing: -2 }}>
            Redefined.
          </h1>
          <p className="ls-sub" style={{ margin: "0 auto 34px", maxWidth: 460, fontSize: 15.5, lineHeight: 1.8, color: "#8891AA", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
            Search any player. Explore every stat. Powered by AI to bring you the deepest cricket analytics on the planet.
          </p>
          <div className="ls-cta-wrap">
            <button className="ls-cta"><span>Search a player above ↑</span></button>
          </div>
        </div>

        {/* ── Ticker ── */}
        <div className="ls-divider-anim" style={{ position: "relative", zIndex: 1, width: "100%", marginTop: 48, borderTop: "1px solid #EEF0F8", borderBottom: "1px solid #EEF0F8", padding: "12px 0", background: "rgba(250,251,255,.7)", backdropFilter: "blur(4px)" }}
          onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}>
          <div className="ticker-wrap">
            <div className={`ticker-track${tickerPaused ? " paused" : ""}`}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((name, i) => (
                <span key={i} className="ticker-item"><span className="ticker-dot" />{name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 780, display: "flex", alignItems: "center", gap: 16, margin: "48px auto 0", padding: "0 48px", boxSizing: "border-box" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #D4D8E8)" }} />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#B0B5CC", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>What we offer</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #D4D8E8, transparent)" }} />
        </div>

        {/* ── Feature cards — 2×2 grid ── */}
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, width: "100%", maxWidth: 900, margin: "28px auto 0", padding: "0 48px", boxSizing: "border-box" }}>
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} index={i} visible={cardsVisible} />
          ))}
        </div>

        {/* ── Connector line ── */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8, gap: 0 }}>
          <div style={{
            width: 2, height: 22,
            background: "linear-gradient(180deg, rgba(46,158,106,.35), rgba(46,158,106,.1))",
            borderRadius: 2,
            opacity: cardsVisible ? 1 : 0,
            transition: "opacity .4s ease 1.1s",
          }} />
          <div style={{
            fontSize: 8, fontWeight: 700, fontFamily: "'DM Mono', monospace",
            color: "#2E9E6A", letterSpacing: 2, textTransform: "uppercase",
            padding: "3px 10px", background: "#EDFAF3",
            border: "1px solid rgba(46,158,106,.2)", borderRadius: 999,
            opacity: cardsVisible ? 1 : 0,
            transition: "opacity .4s ease 1.2s",
          }}>
            New feature preview ↓
          </div>
        </div>

        {/* ── Year-wise Comparison Box ── */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "0", boxSizing: "border-box" }}>
          <YearComparisonBox visible={cardsVisible} />
        </div>

        {/* ── Bottom tagline ── */}
        <div style={{ position: "relative", zIndex: 1, marginTop: 48, textAlign: "center", opacity: heroVisible ? 1 : 0, transition: "opacity .6s ease .8s" }}>
          <p style={{ margin: 0, fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#C4C8D8", letterSpacing: 3, textTransform: "uppercase" }}>
            Data · Analysis · Intelligence
          </p>
        </div>
      </section>
    </>
  );
};