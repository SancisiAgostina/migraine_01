import { COLORS } from "../styles/colors";

export default function Header() {
  return (
    <div
      style={{
        background: COLORS.white,
        borderBottom: `2px solid ${COLORS.teal}`,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          background: COLORS.teal,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2v16M2 10h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ lineHeight: 1.25 }}>
        <div
          style={{
            fontSize: 10,
            color: COLORS.textLight,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          AdventHealth Orlando
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>
          Migraine Screening Tool
        </div>
      </div>
    </div>
  );
}