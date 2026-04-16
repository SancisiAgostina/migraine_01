import { useState } from "react";
import { COLORS } from "../styles/colors";

export default function LanguageScreen({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const langs = [
    { id: "en", flag: "🇺🇸", label: "English", native: "English" },
    { id: "es", flag: "🇪🇸", label: "Español", native: "Spanish" },
  ];

  return (
    <div style={{ padding: "36px 24px 40px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: COLORS.tealLight,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="10" stroke={COLORS.teal} strokeWidth="1.8" />
            <path
              d="M13 3C13 3 9 8 9 13s4 10 4 10M13 3c0 0 4 5 4 10s-4 10-4 10M3 13h20"
              stroke={COLORS.teal}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
          Welcome · Bienvenido
        </h1>

        <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Select your preferred language
          <br />
          Seleccione su idioma preferido
        </p>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        {langs.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l.id)}
            style={{
              flex: 1,
              background: selected === l.id ? COLORS.tealLight : COLORS.white,
              border: `2px solid ${selected === l.id ? COLORS.teal : COLORS.border}`,
              borderRadius: 16,
              padding: "28px 16px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              transition: "all 0.15s",
              outline: "none",
            }}
          >
            <span style={{ fontSize: 36, lineHeight: 1 }}>{l.flag}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.text }}>{l.label}</span>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{l.native}</span>

            {selected === l.id && (
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: COLORS.teal,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 2.5"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
  disabled={!selected}
  onClick={() => onSelect(selected)}
  onMouseEnter={(e) => {
    if (!selected) return;
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
  onMouseDown={(e) => {
    if (!selected) return;
    e.currentTarget.style.transform = "scale(0.98)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
  }}
  onMouseUp={(e) => {
    if (!selected) return;
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
  }}
  style={{
    width: "100%",
    padding: "15px",
    background: selected ? COLORS.teal : COLORS.tealMid,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: selected ? "pointer" : "default",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.15s ease",
    letterSpacing: "0.2px",
    willChange: "transform, box-shadow",
  }}
>
  {selected === "es" ? "Continuar →" : "Continue →"}
</button>
    </div>
  );
}