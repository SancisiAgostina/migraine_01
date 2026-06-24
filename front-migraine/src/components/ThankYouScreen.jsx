import { COLORS } from "../styles/colors";

export default function ThankYouScreen({ onRestart }) {
  return (
    <main style={{ padding: "36px 24px 40px", maxWidth: 520, margin: "0 auto" }}>
      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "32px 24px",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            background: COLORS.tealLight,
            color: COLORS.teal,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <path
              d="m7 15.5 5 5L23 9.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 21,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.4,
            marginBottom: 16,
          }}
        >
          Thank you for completing the questionnaire.
        </h1>

        <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7 }}>
          Your responses have been submitted. A healthcare professional will contact you to review
          your information.
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        style={{
          width: "100%",
          padding: "14px",
          background: COLORS.white,
          border: `1.5px solid ${COLORS.teal}`,
          borderRadius: 12,
          color: COLORS.teal,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Start over
      </button>
    </main>
  );
}
