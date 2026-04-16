import { useState } from "react";
import { COLORS } from "../styles/colors";
import { UI } from "../data/uiText";

function DoctorPanel({ lang, doctorView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [doctorLang, setDoctorLang] = useState(lang);

  const ui = UI[doctorLang];

  if (!doctorView) return null;

  const summaryEntries = Object.entries(doctorView.answers_summary || {}).filter(
    ([key, value]) => {
      if (
        key === "unilateral" ||
        key === "bilateral" ||
        key === "mild_moderate" ||
        key === "moderate_severe"
      ) {
        return false;
      }

      if (value === undefined || value === null || value === "") return false;
      if (value === false) return false;
      return true;
    }
  );

  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: "18px 22px",
        marginBottom: 14,
      }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.teal,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {doctorLang === "es" ? "Vista médica" : "Doctor view"}
            </p>

            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>
              {doctorLang === "es"
                ? "Ver detalles clínicos del caso"
                : "View clinical case details"}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDoctorLang("en");
                }}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: doctorLang === "en" ? COLORS.teal : "transparent",
                  color: doctorLang === "en" ? "#fff" : COLORS.text,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                EN
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDoctorLang("es");
                }}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: doctorLang === "es" ? COLORS.teal : "transparent",
                  color: doctorLang === "es" ? "#fff" : COLORS.text,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ES
              </button>
            </div>

            <span style={{ color: COLORS.teal, fontWeight: 700 }}>
              {isOpen ? "−" : "+"}
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              {doctorLang === "es" ? "Screening Lipton" : "Lipton screening"}
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  background: COLORS.tealLight,
                  color: COLORS.tealDark,
                  borderRadius: 8,
                  padding: "5px 11px",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {doctorLang === "es" ? "Puntaje" : "Score"}: {doctorView.lipton_score}
              </span>

              <span
                style={{
                  background: doctorView.lipton_positive ? COLORS.amberBg : COLORS.greenBg,
                  color: doctorView.lipton_positive ? COLORS.amber : COLORS.green,
                  borderRadius: 8,
                  padding: "5px 11px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {doctorView.lipton_positive
                  ? doctorLang === "es"
                    ? "Screening positivo"
                    : "Positive screener"
                  : doctorLang === "es"
                  ? "Screening no positivo"
                  : "Not positive"}
              </span>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              {doctorLang === "es" ? "Resumen clínico" : "Clinical summary"}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {summaryEntries.map(([key, value]) => (
                <span
                  key={key}
                  style={{
                    background: COLORS.bg,
                    color: COLORS.text,
                    borderRadius: 8,
                    padding: "5px 11px",
                    fontSize: 13,
                    fontWeight: 500,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  {typeof value === "boolean"
                    ? (ui.symptomLabels[key] || key)
                    : `${ui.symptomLabels[key] || key}: ${String(value)}`}
                </span>
              ))}
            </div>
          </div>

          {doctorView.additional_notes && (
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 8,
                }}
              >
                {doctorLang === "es" ? "Notas del paciente" : "Patient notes"}
              </p>

              <div
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  fontSize: 14,
                  color: COLORS.text,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {doctorView.additional_notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultScreen({ lang, apiResult, onRestart }) {
  const ui = UI[lang];

  const patientView = apiResult?.patient_view;
  const doctorView = apiResult?.doctor_view;

  const title = patientView?.result_title || ui.incTitle;
  const desc = patientView?.result_description || ui.incDesc;
  const recs = patientView?.next_steps || ui.incRecs;

  return (
    <div style={{ padding: "24px 24px 40px", maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>
        {ui.result}
      </h2>

      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "24px 22px",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: "50%",
              background: COLORS.tealLight,
              border: `3px solid ${COLORS.teal}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.teal }}>DX</span>
          </div>

          <div>
            <div
              style={{
                display: "inline-block",
                background: COLORS.tealLight,
                color: COLORS.tealDark,
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.2px",
              }}
            >
              {lang === "es" ? "Resultado" : "Result"}
            </div>

            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>
              {title}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.65 }}>{desc}</p>
      </div>

      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "18px 22px",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.teal,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {ui.steps}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recs.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  minWidth: 22,
                  borderRadius: "50%",
                  background: COLORS.tealLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal }}>
                  {i + 1}
                </span>
              </div>

              <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <DoctorPanel lang={lang} doctorView={doctorView} />

      <div
        style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.borderLight}`,
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.6, textAlign: "center" }}>
          {ui.disclaimer}
        </p>
      </div>

      <button
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
          outline: "none",
        }}
      >
        {ui.restart}
      </button>
    </div>
  );
}