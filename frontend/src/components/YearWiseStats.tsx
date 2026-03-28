import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, BarChart, Bar, ComposedChart, Area,
} from "recharts";
import type { PlayerFormats } from "../utils/types";
import { getYearWisePalette } from "../hooks/useFormatpalatte";
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  formats: PlayerFormats;
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

const tint = (hex: string, alpha: number) =>
  hex + Math.round(alpha * 255).toString(16).padStart(2, "0");

const axisProps = {
  axisLine: false as const,
  tickLine: false as const,
  tick: { fill: "#94a3b8", fontSize: 11 },
};

const tooltipStyle = {
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  backgroundColor: "#ffffff",
  color: "#1e293b",
  padding: "10px",
  fontSize: "12px",
};

export const YearWiseStats: React.FC<Props> = ({ formats, role }) => {
  const formatKeys = Object.keys(formats) as (keyof PlayerFormats)[];
  const [activeTab, setActiveTab] = useState(formatKeys[0]);
  const { showBatting, showBowling } = getRoleFlags(role);
  const isMobile = useIsMobile();

  const pal = getYearWisePalette(activeTab as string);
  const { primary, secondary, tertiary } = pal;

  const currentFormat = formats[activeTab];
  const batting = currentFormat?.batting_by_year || [];
  const bowling = currentFormat?.bowling_by_year || [];

  // ── Layout tokens ──────────────────────────────────────────────────────────
  const outerPad  = isMobile ? "12px 8px"  : "12px";
  const cardPad   = isMobile ? "10px 10px" : "20px 20px";
  const chartBoxPad = isMobile ? "12px 8px 6px" : "18px 16px 10px";
  const chartH    = isMobile ? 160 : 220;
  const fullWideH = isMobile ? 150 : 200;
  const gap       = isMobile ? "16px" : "28px";
  const tabPad    = isMobile ? "7px 14px" : "10px 24px";
  const tabFontSz = isMobile ? "12px" : "14px";
  const titleFontSz = isMobile ? "15px" : "18px";
  const barSize   = isMobile ? 8 : 14;
  const dotR      = isMobile ? 2 : 4;
  const activeDotR = isMobile ? 4 : 6;

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: isMobile ? "14px" : "20px",
    padding: cardPad,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
    border: "1px solid #f1f5f9",
  };

  const sectionHeader = (color: string, title: string) => (
    <div style={{ marginBottom: isMobile ? "16px" : "24px", borderLeft: `4px solid ${color}`, paddingLeft: "12px" }}>
      <h3 style={{ fontSize: titleFontSz, fontWeight: 700, color: "#1e293b", margin: 0 }}>{title}</h3>
    </div>
  );

  const chartTitle = (text: string) => (
    <p style={{
      fontSize: isMobile ? "10px" : "12px",
      fontWeight: 700,
      color: "#64748b",
      marginBottom: isMobile ? "8px" : "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    }}>
      {text}
    </p>
  );

  // On mobile: single column. On desktop: 2-col auto-fit.
  const chartGrid = (children: React.ReactNode) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(500px, 1fr))",
      gap,
    }}>
      {children}
    </div>
  );

  const chartBox = (children: React.ReactNode, fullWidth = false) => (
    <div style={{
      background: "#f8fafc",
      borderRadius: isMobile ? "10px" : "14px",
      padding: chartBoxPad,
      ...(fullWidth ? { gridColumn: "1 / -1" } : {}),
    }}>
      {children}
    </div>
  );

  // Shared chart margin — tighter on mobile
  const cm = isMobile
    ? { top: 4, right: 4, left: -20, bottom: 0 }
    : { top: 5, right: 10, left: -10, bottom: 0 };

  return (
    <div style={{ background: "#f8fafc", padding: outerPad, borderRadius: isMobile ? "16px" : "24px", fontFamily: "Inter, sans-serif" }}>

      {/* Format tabs */}
      <div style={{ display: "flex", gap: isMobile ? "6px" : "10px", marginBottom: isMobile ? "16px" : "28px", overflowX: "auto", paddingBottom: "2px" }}>
        {formatKeys.map((f) => {
          const btnPal = getYearWisePalette(f as string);
          const isActive = activeTab === f;
          return (
            <button
              key={f}
              onClick={() => setActiveTab(f)}
              style={{
                padding: tabPad,
                borderRadius: "10px",
                border: `1px solid ${isActive ? btnPal.primary : "#e2e8f0"}`,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: tabFontSz,
                backgroundColor: isActive ? btnPal.primary : "#ffffff",
                color: isActive ? "#ffffff" : "#64748b",
                transition: "all 0.2s ease",
                boxShadow: isActive ? `0 2px 8px ${tint(btnPal.primary, 0.4)}` : "none",
                whiteSpace: "nowrap" as const,
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "36px" }}>

        {/* ── BATTING ── */}
        {showBatting && batting.length > 0 && (
          <div style={cardStyle}>
            {sectionHeader(primary, "Batting: Year-wise")}
            {chartGrid(
              <>
                {/* Runs */}
                {chartBox(
                  <>
                    {chartTitle("Runs scored")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={batting} margin={cm}>
                        <defs>
                          <linearGradient id={`runs-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={primary} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="runs" name="Runs" stroke={primary} strokeWidth={2}
                          fill={`url(#runs-grad-${activeTab})`} dot={{ r: dotR, fill: primary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* 100s & 50s */}
                {chartBox(
                  <>
                    {chartTitle("Centuries & half-centuries")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <LineChart data={batting} margin={cm}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend verticalAlign="top" align="right" iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                        <Line type="monotone" dataKey="hundreds" name="100s" stroke={primary}   strokeWidth={2.5} dot={{ r: dotR, fill: primary,   strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                        <Line type="monotone" dataKey="fifties"  name="50s"  stroke={secondary} strokeWidth={2.5} dot={{ r: dotR, fill: secondary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Average */}
                {chartBox(
                  <>
                    {chartTitle("Batting average")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={batting} margin={cm}>
                        <defs>
                          <linearGradient id={`avg-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={tertiary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={tertiary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="average" name="Average" stroke={tertiary} strokeWidth={2}
                          fill={`url(#avg-grad-${activeTab})`} dot={{ r: dotR, fill: tertiary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Strike Rate */}
                {chartBox(
                  <>
                    {chartTitle("Strike rate")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={batting} margin={cm}>
                        <defs>
                          <linearGradient id={`sr-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={secondary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={secondary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="strike_rate" name="Strike Rate" stroke={secondary} strokeWidth={2}
                          fill={`url(#sr-grad-${activeTab})`} dot={{ r: dotR, fill: secondary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Matches vs Innings — full width */}
                {chartBox(
                  <>
                    {chartTitle("Matches played vs innings batted")}
                    <ResponsiveContainer width="100%" height={fullWideH}>
                      <BarChart data={batting} barGap={4} margin={cm}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                        <Legend verticalAlign="top" align="right" iconType="square" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="matches" name="Matches" fill={primary}             radius={[3, 3, 0, 0]} barSize={barSize} />
                        <Bar dataKey="innings" name="Innings" fill={tint(primary, 0.45)} radius={[3, 3, 0, 0]} barSize={barSize} />
                      </BarChart>
                    </ResponsiveContainer>
                  </>,
                  true /* fullWidth */
                )}
              </>
            )}
          </div>
        )}

        {/* ── BOWLING ── */}
        {showBowling && bowling.length > 0 && (
          <div style={cardStyle}>
            {sectionHeader(secondary, "Bowling: Year-wise")}
            {chartGrid(
              <>
                {/* Wickets */}
                {chartBox(
                  <>
                    {chartTitle("Wickets taken")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={bowling} margin={cm}>
                        <defs>
                          <linearGradient id={`wkt-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={secondary} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={secondary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="wickets" name="Wickets" stroke={secondary} strokeWidth={2}
                          fill={`url(#wkt-grad-${activeTab})`} dot={{ r: dotR, fill: secondary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Bowling average */}
                {chartBox(
                  <>
                    {chartTitle("Bowling average")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={bowling} margin={cm}>
                        <defs>
                          <linearGradient id={`bavg-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={tertiary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={tertiary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="average" name="Bowling Avg" stroke={tertiary} strokeWidth={2}
                          fill={`url(#bavg-grad-${activeTab})`} dot={{ r: dotR, fill: tertiary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Economy */}
                {chartBox(
                  <>
                    {chartTitle("Economy rate")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <ComposedChart data={bowling} margin={cm}>
                        <defs>
                          <linearGradient id={`econ-grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={primary} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="economy" name="Economy" stroke={primary} strokeWidth={2}
                          fill={`url(#econ-grad-${activeTab})`} dot={{ r: dotR, fill: primary, strokeWidth: 0 }} activeDot={{ r: activeDotR }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* 4W / 5W hauls */}
                {chartBox(
                  <>
                    {chartTitle("Milestone hauls (4W / 5W)")}
                    <ResponsiveContainer width="100%" height={chartH}>
                      <BarChart data={bowling} barGap={4} margin={cm}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                        <Legend verticalAlign="top" align="right" iconType="square" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="four_wicket_hauls" name="4W Hauls" fill={tertiary}  radius={[3, 3, 0, 0]} barSize={barSize} />
                        <Bar dataKey="five_wicket_hauls" name="5W Hauls" fill={secondary} radius={[3, 3, 0, 0]} barSize={barSize} />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}

                {/* Matches vs Innings bowled — full width */}
                {chartBox(
                  <>
                    {chartTitle("Matches played vs innings bowled")}
                    <ResponsiveContainer width="100%" height={fullWideH}>
                      <BarChart data={bowling} barGap={4} margin={cm}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" {...axisProps} />
                        <YAxis {...axisProps} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                        <Legend verticalAlign="top" align="right" iconType="square" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="matches"        name="Matches" fill={secondary}             radius={[3, 3, 0, 0]} barSize={barSize} />
                        <Bar dataKey="innings_bowled" name="Innings" fill={tint(secondary, 0.45)} radius={[3, 3, 0, 0]} barSize={barSize} />
                      </BarChart>
                    </ResponsiveContainer>
                  </>,
                  true /* fullWidth */
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};