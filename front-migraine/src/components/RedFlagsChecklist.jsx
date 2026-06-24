import { useState } from "react";
import { COLORS } from "../styles/colors";
import {
  canShowTreatmentRecommendations,
  createInitialRedFlagsState,
  hasSelectedRedFlags,
  RED_FLAG_ITEMS,
  setAllRedFlagsAbsent,
  setRedFlagItem,
} from "./redFlagsState";

const TEXT = {
  title: "Headache Red Flags",
  subtitle: "Healthcare Provider Safety Check",
  instruction: "Select any red flag symptoms that are present, or confirm that all are absent.",
  confirmAll: "All headache red flags are absent.",
  allAbsent: "All headache red flags have been confirmed absent.",
  incomplete: "Red flags have not been fully excluded. Complete the safety check before continuing.",
  warning:
    "Red flag symptoms are present. Imaging or further urgent evaluation is required before considering migraine-specific treatment recommendations.",
};

export default function RedFlagsChecklist({ onSeeTreatment }) {
  const [state, setState] = useState(createInitialRedFlagsState);
  const anyRedFlagSelected = hasSelectedRedFlags(state);
  const treatmentAllowed = canShowTreatmentRecommendations(state);

  function handleItemChange(index, checked) {
    setState((currentState) => setRedFlagItem(currentState, index, checked));
  }

  function handleAllAbsentChange(checked) {
    setState((currentState) => setAllRedFlagsAbsent(currentState, checked));
  }

  const alertColors = anyRedFlagSelected
    ? { background: COLORS.redBg, border: COLORS.red, text: COLORS.red }
    : state.allAbsent
      ? { background: COLORS.greenBg, border: COLORS.green, text: COLORS.green }
      : { background: COLORS.amberBg, border: COLORS.amber, text: COLORS.amber };

  return (
    <section
      aria-labelledby="red-flags-title"
      style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "18px 16px",
      }}
    >
      <p
        style={{
          margin: "0 0 5px",
          color: COLORS.teal,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        {TEXT.subtitle}
      </p>

      <h3
        id="red-flags-title"
        style={{
          margin: "0 0 8px",
          color: COLORS.text,
          fontSize: 17,
          lineHeight: 1.3,
        }}
      >
        {TEXT.title}
      </h3>

      <p
        style={{
          margin: "0 0 16px",
          color: COLORS.textMuted,
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {TEXT.instruction}
      </p>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          padding: "11px 12px",
          background: state.allAbsent ? COLORS.greenBg : COLORS.white,
          border: `1.5px solid ${state.allAbsent ? COLORS.green : COLORS.teal}`,
          borderRadius: 10,
          color: state.allAbsent ? COLORS.green : COLORS.tealDark,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <input
          type="checkbox"
          checked={state.allAbsent}
          onChange={(event) => handleAllAbsentChange(event.target.checked)}
          aria-label={TEXT.confirmAll}
          style={{ width: 17, height: 17, accentColor: COLORS.green }}
        />
        {TEXT.confirmAll}
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {RED_FLAG_ITEMS.map((item, index) => (
          <label
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 11px",
              background: state.allAbsent ? COLORS.borderLight : COLORS.white,
              border: `1px solid ${
                state.selectedItems[index] ? COLORS.red : COLORS.borderLight
              }`,
              borderRadius: 9,
              color: state.allAbsent ? COLORS.textLight : COLORS.text,
              cursor: state.allAbsent ? "not-allowed" : "pointer",
              fontSize: 13,
              lineHeight: 1.45,
              opacity: state.allAbsent ? 0.7 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={state.selectedItems[index]}
              disabled={state.allAbsent}
              onChange={(event) => handleItemChange(index, event.target.checked)}
              style={{
                width: 16,
                height: 16,
                marginTop: 2,
                flexShrink: 0,
                accentColor: COLORS.red,
              }}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        style={{
          marginTop: 15,
          padding: "11px 12px",
          background: alertColors.background,
          border: `1px solid ${alertColors.border}`,
          borderRadius: 10,
          color: alertColors.text,
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {anyRedFlagSelected
          ? TEXT.warning
          : state.allAbsent
            ? TEXT.allAbsent
            : TEXT.incomplete}
      </div>

      {treatmentAllowed && (
        <button
          type="button"
          onClick={onSeeTreatment}
          style={{
            width: "100%",
            marginTop: 15,
            padding: "14px",
            background: COLORS.teal,
            border: "none",
            borderRadius: 12,
            color: COLORS.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          See Headache Treatment Recommendations
        </button>
      )}
    </section>
  );
}
