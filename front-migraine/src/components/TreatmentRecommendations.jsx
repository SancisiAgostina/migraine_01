import { useState } from "react";
import { COLORS } from "../styles/colors";
import {
  INITIAL_THERAPIES,
  PROPHYLACTIC_MEDICATIONS,
  shouldShowNeurologyNextStep,
  THIRD_LINE_THERAPIES,
  TRIPTANS,
} from "./treatmentRecommendationsData";

function RecommendationSection({ title, children }) {
  return (
    <section
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "20px",
      }}
    >
      <h2
        style={{
          color: COLORS.text,
          fontSize: 17,
          lineHeight: 1.35,
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function TreatmentCheckboxList({ items, selectedTreatments, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((item) => {
        const checked = Boolean(selectedTreatments[item.id]);

        return (
          <label
            key={item.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "11px 12px",
              background: checked ? COLORS.tealLight : COLORS.bg,
              border: `1px solid ${checked ? COLORS.teal : COLORS.borderLight}`,
              borderRadius: 10,
              color: COLORS.text,
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onChange(item.id, event.target.checked)}
              style={{
                width: 17,
                height: 17,
                marginTop: 2,
                flexShrink: 0,
                accentColor: COLORS.teal,
              }}
            />
            <span>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function TreatmentRecommendations({ onBack }) {
  const [selectedTreatments, setSelectedTreatments] = useState({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const showNextStep = shouldShowNeurologyNextStep(selectedTreatments);

  function updateTreatment(id, checked) {
    setSelectedTreatments((current) => ({
      ...current,
      [id]: checked,
    }));
  }

  if (reviewCompleted) {
    return (
      <main style={{ padding: "36px 24px 40px", maxWidth: 620, margin: "0 auto" }}>
        <section
          role="status"
          style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 18,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              margin: "0 auto 18px",
              borderRadius: "50%",
              background: COLORS.greenBg,
              color: COLORS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <h1
            style={{
              color: COLORS.text,
              fontSize: 21,
              lineHeight: 1.4,
              marginBottom: 10,
            }}
          >
            Healthcare provider review completed.
          </h1>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: "100%",
              marginTop: 18,
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
            ← Back to healthcare provider review
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px 24px 40px", maxWidth: 720, margin: "0 auto" }}>
      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "22px",
          marginBottom: 18,
        }}
      >
        <p
          style={{
            color: COLORS.teal,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Healthcare Provider View
        </p>
        <h1 style={{ color: COLORS.text, fontSize: 22, lineHeight: 1.35 }}>
          Headache Treatment Recommendations
        </h1>
        <p
          style={{
            color: COLORS.textMuted,
            fontSize: 14,
            lineHeight: 1.6,
            marginTop: 10,
          }}
        >
          Select any treatments you will prescribe today.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <RecommendationSection title="Initial Therapies (Over-the-counter medications)">
          <TreatmentCheckboxList
            items={INITIAL_THERAPIES}
            selectedTreatments={selectedTreatments}
            onChange={updateTreatment}
          />
        </RecommendationSection>

        <RecommendationSection title="Second Line Therapies">
          <h3 style={{ color: COLORS.tealDark, fontSize: 15, marginBottom: 10 }}>
            Triptans
          </h3>
          <TreatmentCheckboxList
            items={TRIPTANS}
            selectedTreatments={selectedTreatments}
            onChange={updateTreatment}
          />
        </RecommendationSection>

        <RecommendationSection title="Third Line Therapies">
          <TreatmentCheckboxList
            items={THIRD_LINE_THERAPIES}
            selectedTreatments={selectedTreatments}
            onChange={updateTreatment}
          />
        </RecommendationSection>

        <RecommendationSection title="Prophylactic Medications">
          <p
            style={{
              color: COLORS.textMuted,
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            Consider when more than 1 headache per week on average.
          </p>
          <TreatmentCheckboxList
            items={PROPHYLACTIC_MEDICATIONS}
            selectedTreatments={selectedTreatments}
            onChange={updateTreatment}
          />
        </RecommendationSection>

        {showNextStep && (
          <section
            style={{
              background: COLORS.tealLight,
              border: `1px solid ${COLORS.teal}`,
              borderRadius: 16,
              padding: "18px 20px",
            }}
          >
            <h2 style={{ color: COLORS.tealDark, fontSize: 16, marginBottom: 8 }}>
              Next step
            </h2>
            <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.6 }}>
              Referral to Neurology for Botulinum toxin injections and consideration of CGRP
              inhibitors.
            </p>
          </section>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: acknowledged ? COLORS.tealLight : COLORS.bg,
            border: `1.5px solid ${acknowledged ? COLORS.teal : COLORS.border}`,
            borderRadius: 12,
            padding: "14px 16px",
            color: COLORS.text,
            fontSize: 13,
            lineHeight: 1.6,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            required
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            style={{
              width: 17,
              height: 17,
              marginTop: 2,
              flexShrink: 0,
              accentColor: COLORS.teal,
            }}
          />
          <span>
            I acknowledge that this application supports clinical decision-making and does not
            replace evaluation, diagnosis, or treatment by a licensed healthcare provider.
          </span>
        </label>

        <button
          type="button"
          disabled={!acknowledged}
          onClick={() => setReviewCompleted(true)}
          style={{
            width: "100%",
            padding: "14px",
            background: acknowledged ? COLORS.teal : COLORS.tealMid,
            border: "none",
            borderRadius: 12,
            color: COLORS.white,
            fontSize: 15,
            fontWeight: 700,
            cursor: acknowledged ? "pointer" : "not-allowed",
          }}
        >
          Complete Review
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        style={{
          width: "100%",
          marginTop: 20,
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
        ← Back to healthcare provider review
      </button>
    </main>
  );
}
