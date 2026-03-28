import React from "react";
import { FaGithub, FaWhatsapp, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo.png";

const SOCIAL_LINKS = [
  { href: "https://github.com/SyedFaisal30",           icon: <FaGithub />,   label: "GitHub"    },
  { href: "https://x.com/SyedFaisal30",                icon: <FaXTwitter />, label: "X"         },
  { href: "https://wa.me/9892996342",                  icon: <FaWhatsapp />, label: "WhatsApp"  },
  { href: "https://www.linkedin.com/in/SyedFaisal30/", icon: <FaLinkedin />, label: "LinkedIn"  },
  { href: "mailto:sfarz172320@gmail.com",              icon: <FaEnvelope />, label: "Email"     },
];

export const Footer: React.FC = () => {
  return (
    <>
      <style>{`
        .footer-icon {
          color: #B0B5CC;
          font-size: 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 9px;
          background: transparent;
          border: 1px solid transparent;
          transition: color .2s, background .2s, border-color .2s, transform .2s;
        }
        .footer-icon:hover {
          color: #3D405B !important;
          background: #F1F4F8;
          border-color: #E0E4F0;
          transform: translateY(-2px);
        }
      `}</style>

      <footer style={{
        background: "#fff",
        borderTop: "1px solid #E8EBF2",
        padding: "20px 32px",
        boxSizing: "border-box" as const,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>

          {/* ── Left: logo + copyright ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={logo}
              alt="CricAIlytics"
              style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: "1px solid #E0E4F0", opacity: 0.7 }}
            />
            <p style={{
              color: "#B0B5CC",
              fontSize: 12,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
            }}>
              © {new Date().getFullYear()} CricAIlytics. All rights reserved.
            </p>
          </div>

          {/* ── Center: tagline ── */}
          <span style={{
            fontSize: 9,
            fontFamily: "'DM Mono', monospace",
            color: "#D4D8E8",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}>
            Data · Analysis · Intelligence
          </span>

          {/* ── Right: social icons ── */}
          <div style={{ display: "flex", gap: 4 }}>
            {SOCIAL_LINKS.map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="footer-icon"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};