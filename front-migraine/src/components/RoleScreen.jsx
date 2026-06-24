import { COLORS } from "../styles/colors";

const roles = [
  {
    id: "patient",
    label: "Patient",
    description: "Complete the migraine screening and detailed headache questionnaire.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="9" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6.5 23c.8-5 3.3-7.5 7.5-7.5s6.7 2.5 7.5 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "physician",
    label: "Healthcare Provider",
    description: "Open the healthcare provider clinical safety review.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 5v18M5 14h18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function RoleScreen({ onSelect }) {
  return (
    <main style={{ padding: "36px 24px 40px", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: COLORS.tealLight,
            color: COLORS.teal,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" aria-hidden="true">
            <path
              d="M13.5 3.5v20M3.5 13.5h20"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
          Choose your view
        </h1>

        <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Select how you would like to use the migraine screening tool.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "scale(1.01)";
              event.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "scale(1)";
              event.currentTarget.style.boxShadow = "none";
            }}
            onMouseDown={(event) => {
              event.currentTarget.style.transform = "scale(0.99)";
            }}
            onMouseUp={(event) => {
              event.currentTarget.style.transform = "scale(1.01)";
            }}
            style={{
              width: "100%",
              background: COLORS.white,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "22px",
              color: COLORS.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              willChange: "transform, box-shadow",
            }}
          >
            <span
              style={{
                width: 50,
                height: 50,
                flexShrink: 0,
                borderRadius: 14,
                background: COLORS.tealLight,
                color: COLORS.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {role.icon}
            </span>

            <span style={{ flex: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                {role.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  color: COLORS.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {role.description}
              </span>
            </span>

            <span style={{ color: COLORS.teal, fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        ))}
      </div>
    </main>
  );
}
