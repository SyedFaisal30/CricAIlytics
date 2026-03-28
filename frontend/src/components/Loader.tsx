import React, { useEffect, useState } from "react";

import {
  User,
  BarChart2,
  Shield,
  Trophy,
  BookOpen,
  CalendarDays,
  Zap,
} from "lucide-react";
 
// ─── Fixed sequential steps ───────────────────────────────────────────────────
const STEPS = [
  { label: "Loading profile",           Icon: User,          color: "#4F6CBA" },
  { label: "Loading overall stats",     Icon: BarChart2,     color: "#2095AC" },
  { label: "Loading format-wise stats", Icon: Shield,        color: "#6D54C4" },
  { label: "Loading achievements",      Icon: Trophy,        color: "#C48A1A" },
  { label: "Loading background",        Icon: BookOpen,      color: "#C4435A" },
  { label: "Loading year-wise data",    Icon: CalendarDays,  color: "#2E9E6A" },
  { label: "Crunching into stats",      Icon: Zap,           color: "#4F6CBA" },
];

const STEP_DURATION = 8000;

export const StatsLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [fade, setFade] = useState(true);
  const [finalPulse, setFinalPulse] = useState(false);

  useEffect(() => {
    if (currentStep >= STEPS.length) return;

    const isFinal = currentStep === STEPS.length - 1;

    const timer = setTimeout(() => {
      if (isFinal) {
        setFinalPulse(true);
        return;
      }
      setFade(false);
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setCurrentStep((prev) => prev + 1);
        setFade(true);
      }, 10000);
    }, STEP_DURATION);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const step = STEPS[currentStep] ?? STEPS[STEPS.length - 1];
  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepComplete {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
        @keyframes finalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,108,186,.4); }
          50%       { box-shadow: 0 0 0 14px rgba(79,108,186,0); }
        }
        @keyframes shimmerBar {
          from { background-position: -200% 0; }
          to   { background-position: 200% 0; }
        }
        .loader-step-done {
          animation: stepComplete .3s cubic-bezier(.22,.68,0,1.2) forwards;
        }
        .final-pulse {
          animation: finalPulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10,14,30,0.82)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>

        {/* ── Card ── */}
        <div style={{
          background: "#fff",
          borderRadius: 24,
          padding: "40px 44px 36px",
          width: "min(420px, 90vw)",
          boxShadow: "0 32px 80px rgba(0,0,0,.28), 0 4px 16px rgba(0,0,0,.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          animation: "loaderFadeIn .5s cubic-bezier(.22,.68,0,1.15) both",
        }}>

          {/* ── Spinner + icon ── */}
          <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
            {/* Outer ring */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "2.5px solid #F1F4F8",
            }} />
            {/* Spinning arc */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: `2.5px solid transparent`,
              borderTop: `2.5px solid ${step.color}`,
              borderRight: `2.5px solid ${step.color}44`,
              animation: "spin .75s linear infinite",
            }} className={finalPulse ? "final-pulse" : ""} />
            {/* Center icon */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
              opacity: fade ? 1 : 0,
              transition: "opacity .2s ease",
            }}>
              {step.Icon && <step.Icon size={24} />}
            </div>
          </div>

          {/* ── Current step label ── */}
          <div style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#1A1D2E",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: -0.2,
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(4px)",
            transition: "opacity .2s ease, transform .2s ease",
            marginBottom: 6,
            textAlign: "center",
          }}>
            {step.label}
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginLeft: 6, fontSize: 12, opacity: 0.5 }}>⟳</span>
          </div>

          {/* Step counter */}
          <div style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#B0B5CC",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: 1,
            marginBottom: 24,
          }}>
            {Math.min(currentStep + 1, STEPS.length)} / {STEPS.length}
          </div>

          {/* ── Progress bar ── */}
          <div style={{ width: "100%", height: 4, background: "#F1F4F8", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, #4F6CBA, ${step.color})`,
              backgroundSize: "200% 100%",
              animation: "shimmerBar 1.5s linear infinite",
              transition: "width .4s cubic-bezier(.22,.68,0,1.2)",
            }} />
          </div>

          {/* ── Step pills ── */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {STEPS.map((s, i) => {
              const isDone = completedSteps.includes(i);
              const isActive = i === currentStep;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: 0.2,
                  background: isDone ? s.color + "15" : isActive ? s.color + "12" : "#F8FAFC",
                  border: `1px solid ${isDone ? s.color + "40" : isActive ? s.color + "30" : "#E8EBF2"}`,
                  color: isDone ? s.color : isActive ? s.color : "#B0B5CC",
                  transition: "all .3s ease",
                }}>
                  {isDone ? (
                    <span className="loader-step-done" style={{ fontSize: 9 }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 9, opacity: isActive ? 1 : 0.4 }}>{s.Icon && <s.Icon size={16} />}</span>
                  )}
                  <span style={{ opacity: isDone ? 1 : isActive ? 1 : 0.5 }}>
                    {s.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tagline below card ── */}
        <p style={{
          marginTop: 20,
          fontSize: 10,
          fontFamily: "'DM Mono', monospace",
          color: "rgba(255,255,255,.2)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          Powered by AI
        </p>
      </div>
    </>
  );
};