import { useState } from "react";
import { COLORS } from "../styles/colors";

// Kept local for now so this component can move independently.
// This object can later be moved into the shared translation files.
const TEXT = {
  title: "Headache Red Flags",
  subtitle: "Physician Safety Check",
  instruction: "Please confirm that NONE of the following are present in your patient.",
  confirmAll: "Confirm all are absent",
  allAbsent: "No headache red flags were confirmed by the physician.",
  incomplete:
    "Red flags have not been fully excluded. Imaging or further medical evaluation may be required to exclude serious illness.",
  items: [
    "No abnormal neurological examination (e.g., papilledema, altered mental status)",
    "No signs of systemic illness (e.g., fever, stiff neck, rash)",
    "Not the worst headache ever",
    "No progression in frequency and severity of headaches",
    "No new headache in a patient older than 50 years",
    "No sudden onset of headache – “thunderclap headache”",
    "No new-onset headache in an immunocompromised or cancer patient",
    "No headache after head trauma",
    "No headache worsening with Valsalva",
    "No headache accompanied by “whooshing” sounds",
  ],
};

export default function RedFlagsChecklist() {
  const [checkedItems, setCheckedItems] = useState(() => TEXT.items.map(() => false));
  const allAbsent = checkedItems.every(Boolean);

  function toggleItem(index) {
    setCheckedItems((currentItems) =>
      currentItems.map((isChecked, itemIndex) =>
        itemIndex === index ? !isChecked : isChecked
      )
    );
  }

  function toggleAllAbsent() {
    setCheckedItems(TEXT.items.map(() => !allAbsent));
  }

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
          background: allAbsent ? COLORS.greenBg : COLORS.white,
          border: `1.5px solid ${allAbsent ? COLORS.green : COLORS.teal}`,
          borderRadius: 10,
          color: allAbsent ? COLORS.green : COLORS.tealDark,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <input
          type="checkbox"
          checked={allAbsent}
          onChange={toggleAllAbsent}
          aria-label={TEXT.confirmAll}
          style={{ width: 17, height: 17, accentColor: COLORS.green }}
        />
        {TEXT.confirmAll}
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {TEXT.items.map((item, index) => (
          <label
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 11px",
              background: COLORS.white,
              border: `1px solid ${checkedItems[index] ? COLORS.tealMid : COLORS.borderLight}`,
              borderRadius: 9,
              color: COLORS.text,
              cursor: "pointer",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <input
              type="checkbox"
              checked={checkedItems[index]}
              onChange={() => toggleItem(index)}
              style={{
                width: 16,
                height: 16,
                marginTop: 2,
                flexShrink: 0,
                accentColor: COLORS.teal,
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
          background: allAbsent ? COLORS.greenBg : COLORS.amberBg,
          border: `1px solid ${allAbsent ? COLORS.green : COLORS.amber}`,
          borderRadius: 10,
          color: allAbsent ? COLORS.green : COLORS.amber,
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {allAbsent ? TEXT.allAbsent : TEXT.incomplete}
      </div>
    </section>
  );
}
