import { COLORS } from "../styles/colors";

const triptans = [
  "Sumatriptan (Imitrex): Available in oral, nasal spray, and subcutaneous injection forms. Start at 50 mg.",
  "Rizatriptan (Maxalt): Available in both standard oral tablets and orally disintegrating tablets, which dissolve on the tongue without water. Start at 5 mg.",
  "Eletriptan (Relpax): Start at 40 mg.",
  "Zolmitriptan (Zomig): Available as a tablet, orally disintegrating tablet, or nasal spray. Start at 2.5 mg.",
  "Almotriptan (Axert): Start at 6.25 mg.",
  "Naratriptan (Amerge): Start at 2.5 mg.",
  "Frovatriptan (Frova): Start at 2.5 mg.",
];

const thirdLineTherapies = [
  "Rimegepant (Nurtec ODT): Orally disintegrating tablet. Start at 75 mg.",
  "Ubrogepant (Ubrelvy): Start at 50 mg.",
  "Atogepant (Qulipta): Start at 30 mg.",
];

const prophylacticMedications = [
  "Topamax: Start at 25 mg at night and increase by 25 mg weekly until target dose of 50–100 mg twice a day is reached.",
  "Depakote ER: Start at 500 mg at night and then increase after 1 week to 1000 mg daily. This can be divided as 500 mg twice daily.",
];

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

function MedicationList({ items }) {
  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: 22,
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 1.65,
      }}
    >
      {items.map((item) => (
        <li key={item} style={{ marginBottom: 8 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TreatmentRecommendations({ onBack }) {
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
          Physician view
        </p>
        <h1 style={{ color: COLORS.text, fontSize: 22, lineHeight: 1.35 }}>
          Headache Treatment Recommendations
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <RecommendationSection title="Initial Therapies (Over-the-counter medications)">
          <MedicationList
            items={["Ibuprofen", "Acetaminophen", "Naproxen", "Excedrin Migraine"]}
          />
        </RecommendationSection>

        <RecommendationSection title="Second Line Therapies">
          <h3 style={{ color: COLORS.tealDark, fontSize: 15, marginBottom: 10 }}>
            Triptans
          </h3>
          <MedicationList items={triptans} />
        </RecommendationSection>

        <RecommendationSection title="Third Line Therapies">
          <MedicationList items={thirdLineTherapies} />
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
          <MedicationList items={prophylacticMedications} />
        </RecommendationSection>

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

        <div
          role="note"
          style={{
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "14px 16px",
            color: COLORS.textMuted,
            fontSize: 12,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          This application is intended to support clinical decision-making and does not replace
          evaluation, diagnosis, or treatment by a licensed physician.
        </div>
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
        ← Back to physician review
      </button>
    </main>
  );
}
