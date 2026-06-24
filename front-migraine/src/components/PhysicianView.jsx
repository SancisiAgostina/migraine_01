import { useState } from "react";
import { COLORS } from "../styles/colors";
import { QUESTIONS } from "../data/questions";
import {
  getLatestPatientSubmission,
  LIPTON_QUESTION_IDS,
} from "../services/patientSubmissionStorage";
import RedFlagsChecklist from "./RedFlagsChecklist";
import TreatmentRecommendations from "./TreatmentRecommendations";

export default function PhysicianView({ onBack }) {
  const [submission] = useState(getLatestPatientSubmission);
  const [showTreatment, setShowTreatment] = useState(false);
  const liptonQuestions = QUESTIONS.en.filter((question) =>
    LIPTON_QUESTION_IDS.includes(question.id)
  );

  const formattedTimestamp = submission
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(submission.submittedAt))
    : null;

  if (showTreatment && submission?.liptonPositive) {
    return <TreatmentRecommendations onBack={() => setShowTreatment(false)} />;
  }

  return (
    <main style={{ padding: "24px 24px 40px", maxWidth: 620, margin: "0 auto" }}>
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
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.teal,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Physician view
        </p>

        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.35,
            marginBottom: 8,
          }}
        >
          Clinical safety review
        </h1>

        <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
          {submission?.liptonPositive
            ? "Review the patient submission and headache red flags before continuing with clinical evaluation."
            : "Review the latest patient Lipton screening submission."}
        </p>
      </div>

      <section
        aria-labelledby="latest-submission-title"
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
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.teal,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Demo patient handoff
        </p>

        <h2
          id="latest-submission-title"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.35,
            marginBottom: submission ? 6 : 10,
          }}
        >
          Latest Patient Submission
        </h2>

        {!submission ? (
          <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
            No patient submission available yet. Ask the patient to complete the intake
            questionnaire first.
          </p>
        ) : (
          <>
            <p
              style={{
                fontSize: 12,
                color: COLORS.textLight,
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              Submitted {formattedTimestamp}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {liptonQuestions.map((question) => {
                const answer = submission.answers[question.id];

                return (
                  <div
                    key={question.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 16,
                      padding: "12px 14px",
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.borderLight}`,
                      borderRadius: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: COLORS.text,
                        lineHeight: 1.5,
                      }}
                    >
                      {question.text}
                    </span>

                    <span
                      style={{
                        flexShrink: 0,
                        background: answer ? COLORS.amberBg : COLORS.greenBg,
                        color: answer ? COLORS.amber : COLORS.green,
                        borderRadius: 8,
                        padding: "4px 9px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {answer ? "Yes" : "No"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 16,
                padding: "14px",
                background: submission.liptonPositive ? COLORS.amberBg : COLORS.greenBg,
                border: `1px solid ${
                  submission.liptonPositive ? COLORS.amber : COLORS.green
                }`,
                borderRadius: 10,
                color: submission.liptonPositive ? COLORS.amber : COLORS.green,
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              <div>
                Lipton Screener: {submission.liptonPositive ? "Positive" : "Negative"}
              </div>
              <div>Yes responses: {submission.liptonScore}/3</div>
            </div>

            <p
              style={{
                marginTop: 12,
                fontSize: 11,
                color: COLORS.textLight,
                lineHeight: 1.5,
              }}
            >
              Demo-only browser storage. This is not a production patient record.
            </p>
          </>
        )}
      </section>

      {submission?.liptonPositive && (
        <RedFlagsChecklist onSeeTreatment={() => setShowTreatment(true)} />
      )}

      {submission && !submission.liptonPositive && (
        <section
          role="status"
          aria-live="polite"
          style={{
            background: COLORS.greenBg,
            border: `1px solid ${COLORS.green}`,
            borderRadius: 14,
            padding: "18px 16px",
            color: COLORS.green,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          This patient’s responses do not meet the Lipton screening threshold for likely migraine.
        </section>
      )}

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
        ← Back to role selection
      </button>
    </main>
  );
}
