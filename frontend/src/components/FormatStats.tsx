import React from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import type { FormatStats, OpponentStats } from "../utils/types";
import { getPalette } from "../hooks/useFormatpalatte";
interface Props {
  formatName: string;
  stats: FormatStats;
  isMobile?: boolean;
  role: string;
}

const getRoleFlags = (role: string) => {
  const r = role?.toLowerCase() ?? "";
  const isAllRounder = r.includes("all");
  const isPureBowler = r.includes("bowl") && !isAllRounder;
  return {
    showBatting: !isPureBowler,
    showBowling: isAllRounder || isPureBowler,
  };
};

// ── Sub-components ─────────────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 12px", boxShadow: "0 1px 3px rgba(0,0,0,.04)", ...style }}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "#3B82F6" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
    <div style={{ width: 3, height: 14, background: color, borderRadius: 2, flexShrink: 0 }} />
    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.2 }}>
      {children}
    </span>
  </div>
);

const StatPill: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = "#3B82F6" }) => (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", borderRadius: 999, padding: "10px 18px", minWidth: 80, background: color + "14", border: `1px solid ${color}30` }}>
    <span style={{ fontSize: 20, fontWeight: 700, color, fontVariantNumeric: "tabular-nums", fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>{value}</span>
    <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#64748B", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
  </div>
);

const DonutRing: React.FC<{ value: number; max: number; label: string; color: string; sub?: string }> = ({ value, max, label, color, sub }) => {
  const pct = Math.min(100, (value / max) * 100);
  const data = [{ v: pct }, { v: 100 - pct }];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <PieChart width={90} height={90}>
          <Pie data={data} cx={40} cy={40} innerRadius={28} outerRadius={40} startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0}>
            <Cell fill={color} /><Cell fill="#E2E8F0" />
          </Pie>
        </PieChart>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</span>
          {sub && <span style={{ fontSize: 9, color: "#94A3B8" }}>{sub}</span>}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    </div>
  );
};

const BarRow: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
    <span style={{ fontSize: 11, color: "#64748B", width: 70, textAlign: "right", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 99, height: 7, overflow: "hidden" }}>
      <div style={{ width: `${Math.round((value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color, width: 45, fontFamily: "'DM Mono', monospace" }}>{value}</span>
  </div>
);

const ShadedAreaChart: React.FC<{ data: OpponentStats[]; dataKey: string; color: string; title: string }> = ({ data, dataKey, color, title }) => {
  if (!data || data.length === 0) return null;
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>{title}</p>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 22, left: -20 }}>
          <defs>
            <linearGradient id={`shade-${dataKey}-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="opponent" tick={{ fontSize: 9, fill: "#94A3B8" }} angle={-35} textAnchor="end" height={38} interval={0} tickFormatter={(t) => t.length > 10 ? t.slice(0, 10) + "…" : t} />
          <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} />
          <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#94A3B8", marginBottom: 4, fontWeight: 600 }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#shade-${dataKey}-${color.replace("#","")})`} dot={{ fill: color, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AverageLineChart: React.FC<{ data: OpponentStats[]; color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Average vs opponents</p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 22, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="opponent" tick={{ fontSize: 9, fill: "#94A3B8" }} angle={-35} textAnchor="end" height={38} interval={0} tickFormatter={(t) => t.length > 10 ? t.slice(0, 10) + "…" : t} />
          <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} />
          <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#94A3B8", marginBottom: 4, fontWeight: 600 }} />
          <Line type="monotone" dataKey="average" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
export const FormatStatsComponent: React.FC<Props> = ({ formatName, stats, isMobile, role }) => {
  const palette = getPalette(formatName);
  const { primary, secondary, tertiary } = palette;

  const { showBatting, showBowling } = getRoleFlags(role);
  const b = stats.batting;
  const bw = stats.bowling;
  const f = stats.fielding;
  const batVs = stats.batting_vs_opponents || [];
  const bowlVs = stats.bowling_vs_opponents || [];

  const sortedByRuns = [...batVs].sort((a, b) => b.runs - a.runs);
  const maxRuns = sortedByRuns[0]?.runs || 1;
  const sortedBy100s = [...batVs].sort((a, b) => b.hundreds - a.hundreds);
  const max100s = sortedBy100s[0]?.hundreds || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* BATTING OVERVIEW */}
      {showBatting && (
        <>
          <Card>
            <SectionLabel color={primary}>Batting overview</SectionLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatPill label="Matches"     value={b.matches}                  color={primary} />
              <StatPill label="Innings"     value={b.innings}                  color={primary} />
              <StatPill label="Runs"        value={b.runs.toLocaleString()}    color={primary} />
              <StatPill label="Average"     value={b.average.toFixed(2)}       color={secondary} />
              <StatPill label="Strike Rate" value={b.strike_rate.toFixed(2)}   color={tertiary} />
              <StatPill label="50s"         value={b.fifties}                  color={secondary} />
              <StatPill label="100s"        value={b.hundreds}                 color={primary} />
              <StatPill label="High Score"  value={b.high_score}               color={palette.muted} />
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <Card>
              <SectionLabel color={primary}>Milestone rings</SectionLabel>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutRing value={b.hundreds}         max={Math.max(b.hundreds + 10, 60)}   label="Centuries" color={primary} />
                <DonutRing value={b.fifties}          max={Math.max(b.fifties + 20, 100)}   label="Half Tons" color={secondary} />
                <DonutRing value={Math.round(b.average)} max={100}                          label="Avg/100"   color={tertiary} sub="/100" />
                <DonutRing value={f.catches}          max={Math.max(f.catches + 50, 200)}   label="Catches"   color={palette.muted} />
              </div>
            </Card>

            {showBowling && (
              <Card>
                <SectionLabel color={secondary}>Bowling overview</SectionLabel>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  <StatPill label="Wickets"  value={bw.wickets}                                    color={secondary} />
                  <StatPill label="Economy"  value={bw.economy.toFixed(2)}                         color={secondary} />
                  <StatPill label="Best"     value={bw.best}                                        color={secondary} />
                  <StatPill label="4W"       value={bw.four_wicket_hauls}                           color={tertiary} />
                  <StatPill label="5W"       value={bw.five_wicket_hauls}                           color={tertiary} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <StatPill label="Innings"  value={bw.innings_bowled}                              color={palette.muted} />
                  <StatPill label="Average"  value={bw.average > 0 ? bw.average.toFixed(2) : "—"}  color={palette.muted} />
                </div>
              </Card>
            )}
          </div>

          {batVs.length > 0 && (
            <Card>
              <SectionLabel color={primary}>Batting vs opponents</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28, marginBottom: 28 }}>
                <ShadedAreaChart data={batVs} dataKey="runs"    color={primary}    title="Runs vs opponents" />
                <AverageLineChart data={batVs}                  color={secondary} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28 }}>
                <div>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Top scoring opponents</p>
                  {sortedByRuns.slice(0, 7).map((d) => <BarRow key={d.opponent} label={d.opponent} value={d.runs}    max={maxRuns} color={primary} />)}
                </div>
                <div>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Most centuries against</p>
                  {sortedBy100s.slice(0, 7).map((d) => <BarRow key={d.opponent} label={d.opponent} value={d.hundreds} max={max100s} color={tertiary} />)}
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* BOWLING ONLY (pure bowler) */}
      {showBowling && !showBatting && (
        <Card>
          <SectionLabel color={primary}>Bowling overview</SectionLabel>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <StatPill label="Wickets"  value={bw.wickets}                                    color={primary} />
            <StatPill label="Economy"  value={bw.economy.toFixed(2)}                         color={primary} />
            <StatPill label="Best"     value={bw.best}                                        color={primary} />
            <StatPill label="4W"       value={bw.four_wicket_hauls}                           color={secondary} />
            <StatPill label="5W"       value={bw.five_wicket_hauls}                           color={secondary} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatPill label="Innings"  value={bw.innings_bowled}                              color={palette.muted} />
            <StatPill label="Average"  value={bw.average > 0 ? bw.average.toFixed(2) : "—"}  color={palette.muted} />
          </div>
        </Card>
      )}

      {/* BOWLING VS OPPONENTS */}
      {showBowling && bowlVs.length > 0 && (
        <Card>
          <SectionLabel color={secondary}>Bowling vs opponents</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28, marginBottom: 28 }}>
            <ShadedAreaChart data={bowlVs} dataKey="wickets" color={secondary} title="Wickets vs opponents" />
            <ShadedAreaChart data={bowlVs} dataKey="economy" color={tertiary}  title="Economy vs opponents" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28 }}>
            {(() => {
              const sortedW = [...bowlVs].sort((a, b) => b.wickets - a.wickets);
              const maxW = sortedW[0]?.wickets || 1;
              return (
                <div>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'DM Sans', sans-serif" }}>Most wickets against</p>
                  {sortedW.slice(0, 7).map((d) => <BarRow key={d.opponent} label={d.opponent} value={d.wickets} max={maxW} color={secondary} />)}
                </div>
              );
            })()}
          </div>
        </Card>
      )}

      {/* FIELDING */}
      <Card>
        <SectionLabel color={tertiary}>Fielding</SectionLabel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatPill label="Catches"   value={f.catches}          color={tertiary} />
          <StatPill label="Stumpings" value={f.stumpings}        color={tertiary} />
          <StatPill label="Run Outs"  value={f.run_outs ?? 0}    color={tertiary} />
        </div>
      </Card>

    </div>
  );
};