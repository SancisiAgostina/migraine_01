import { useState, useEffect, useRef } from "react";

const COLORS = {
  teal: "#00A99D",
  tealDark: "#007A72",
  tealLight: "#E6F7F6",
  tealMid: "#B0DDD9",
  bg: "#F4FAFA",
  white: "#FFFFFF",
  text: "#0F2B2A",
  textMuted: "#4A6B69",
  textLight: "#7A9B99",
  border: "#C8E4E2",
  borderLight: "#E0F0EE",
  red: "#C0392B",
  redBg: "#FEF0EE",
  amber: "#B7600A",
  amberBg: "#FEF5E7",
  green: "#2E7D4F",
  greenBg: "#EAF5EE",
};

const QUESTIONS = {
  en: [
    {
      id: "aura_any",
      type: "binary",
      text: "Before the headache, did you have visual changes, tingling, or trouble speaking?"
    },
    {
      id: "aura_gradual",
      type: "binary",
      text: "Did those symptoms build up gradually over several minutes?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "aura_duration",
      type: "binary",
      text: "Did those symptoms last between 5 and 60 minutes?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "aura_followed_headache",
      type: "binary",
      text: "Did the headache start within 1 hour after those symptoms?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "migraine_duration",
      type: "binary",
      text: "Did the headache last between 4 hours and 3 days?"
    },
    {
      id: "unilateral",
      type: "binary",
      text: "Was the pain mostly on one side of the head?"
    },
    {
      id: "pulsating",
      type: "binary",
      text: "Did the pain feel like throbbing or pulsing?"
    },
    {
      id: "moderate_severe",
      type: "binary",
      text: "Was the pain moderate or strong?"
    },
    {
      id: "worse_activity",
      type: "binary",
      text: "Did walking, moving, or climbing stairs make it worse?"
    },
    {
      id: "nausea",
      type: "binary",
      text: "Did you feel nauseous or like vomiting?"
    },
    {
      id: "light_sensitive",
      type: "binary",
      text: "Did light bother you?"
    },
    {
      id: "sound_sensitive",
      type: "binary",
      text: "Did sound bother you?"
    },
    {
      id: "tension_duration",
      type: "binary",
      text: "Did the headache last between 30 minutes and 7 days?"
    },
    {
      id: "bilateral",
      type: "binary",
      text: "Was the pain on both sides of the head?"
    },
    {
      id: "pressure",
      type: "binary",
      text: "Did the pain feel like pressure or tightness rather than throbbing?"
    },
    {
      id: "mild_moderate",
      type: "binary",
      text: "Was the pain mild or moderate?"
    }
  ],
  es: [
    {
      id: "aura_any",
      type: "binary",
      text: "Antes del dolor de cabeza, ¿tuviste cambios visuales, hormigueo o dificultad para hablar?"
    },
    {
      id: "aura_gradual",
      type: "binary",
      text: "¿Esos síntomas aparecieron de a poco en varios minutos?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "aura_duration",
      type: "binary",
      text: "¿Esos síntomas duraron entre 5 y 60 minutos?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "aura_followed_headache",
      type: "binary",
      text: "¿Después de esos síntomas empezó el dolor de cabeza en menos de 1 hora?",
      showIf: (answers) => answers.aura_any === true
    },
    {
      id: "migraine_duration",
      type: "binary",
      text: "¿El dolor de cabeza duró entre 4 horas y 3 días?"
    },
    {
      id: "unilateral",
      type: "binary",
      text: "¿El dolor estuvo más de un solo lado de la cabeza?"
    },
    {
      id: "pulsating",
      type: "binary",
      text: "¿El dolor latía o se sentía como pulsaciones?"
    },
    {
      id: "moderate_severe",
      type: "binary",
      text: "¿El dolor fue moderado o fuerte?"
    },
    {
      id: "worse_activity",
      type: "binary",
      text: "¿Caminar, moverte o subir escaleras lo empeoraba?"
    },
    {
      id: "nausea",
      type: "binary",
      text: "¿Tuviste náuseas o ganas de vomitar?"
    },
    {
      id: "light_sensitive",
      type: "binary",
      text: "¿La luz te molestaba?"
    },
    {
      id: "sound_sensitive",
      type: "binary",
      text: "¿El ruido te molestaba?"
    },
    {
      id: "tension_duration",
      type: "binary",
      text: "¿El dolor duró entre 30 minutos y 7 días?"
    },
    {
      id: "bilateral",
      type: "binary",
      text: "¿El dolor estuvo en ambos lados de la cabeza?"
    },
    {
      id: "pressure",
      type: "binary",
      text: "¿El dolor se sentía como presión o peso, y no como latidos?"
    },
    {
      id: "mild_moderate",
      type: "binary",
      text: "¿El dolor fue leve o moderado?"
    }
  ]
};

const UI = {
  en: {
    welcome: "Welcome",
    subtitle: "Please select your preferred language to begin the migraine screening",
    continue: "Continue",
    next: "Next",
    seeResult: "See Result",
    back: "Back",
    question: (c, t) => `Question ${c} of ${t}`,
    result: "Result",
    recorded: "Recorded symptoms",
    steps: "Recommended next steps",
    disclaimer:
      "This tool is a clinical support aid and does not replace a medical diagnosis. Always consult a healthcare professional.",
    restart: "Start over",
    painLevel: "Pain level",
    loading: "Loading result...",
    highLevel: "High migraine likelihood",
    medLevel: "Moderate likelihood",
    lowLevel: "Low likelihood",
    auraTitle: "Compatible with migraine with aura",
    noAuraTitle: "Compatible with migraine without aura",
    tensionTitle: "Compatible with tension-type headache",
    incTitle: "Inconclusive",
    auraDesc:
      "Your responses are compatible with migraine with aura.",
    noAuraDesc:
      "Your responses are compatible with migraine without aura.",
    tensionDesc:
      "Your responses are more compatible with tension-type headache.",
    incDesc:
      "The available responses are not enough to clearly classify the case.",
    auraRecs: [
      "Request a neurology consultation",
      "Avoid bright light, noise, and stress triggers",
      "Keep a symptom diary",
      "Seek urgent care if a sudden severe headache appears",
    ],
    noAuraRecs: [
      "Schedule an appointment with your doctor",
      "Track frequency and duration of headaches",
      "Rest in dark, quiet environments during episodes",
      "Review current medications with a professional",
    ],
    tensionRecs: [
      "Stay hydrated and get adequate rest",
      "Monitor posture, sleep, and stress levels",
      "Track if symptoms change or worsen",
      "Consult your doctor if headaches continue",
    ],
    incRecs: [
      "Monitor your symptoms over time",
      "Record headache duration and intensity",
      "Note any associated symptoms",
      "Consult a healthcare professional if needed",
    ],
    freqLabels: ["< 1 day/mo", "1–4 days/mo", "5–14 days/mo", "15+ days/mo"],
    locLabels: ["One side", "Both sides", "Behind eyes", "All over"],
    durLabels: ["< 1 hour", "1–4 hours", "4–72 hours", "> 3 days"],
    nausea: "Nausea",
    lightSens: "Light/sound sensitivity",
    auraSymp: "Aura symptoms",
    pain: "Pain",
    symptomLabels: {
  aura_any: "Aura symptoms before the headache",
  aura_gradual: "Aura developed gradually",
  aura_duration: "Aura lasted 5 to 60 minutes",
  aura_followed_headache: "Headache started within 1 hour after aura",
  migraine_duration: "Headache lasted 4 hours to 3 days",
  unilateral: "Pain was mostly on one side",
  pulsating: "Pain felt throbbing or pulsing",
  moderate_severe: "Pain was moderate or strong",
  worse_activity: "Pain worsened with activity",
  nausea: "Nausea or vomiting",
  light_sensitive: "Light sensitivity",
  sound_sensitive: "Sound sensitivity",
  tension_duration: "Headache lasted 30 minutes to 7 days",
  bilateral: "Pain was on both sides",
  pressure: "Pain felt like pressure or tightness",
  mild_moderate: "Pain was mild or moderate",
},
  },
  es: {
    welcome: "Bienvenido",
    subtitle: "Por favor seleccione su idioma para comenzar la evaluación de migraña",
    continue: "Continuar",
    next: "Siguiente",
    seeResult: "Ver resultado",
    back: "Atrás",
    question: (c, t) => `Pregunta ${c} de ${t}`,
    result: "Resultado",
    recorded: "Síntomas registrados",
    steps: "Próximos pasos recomendados",
    disclaimer:
      "Esta herramienta es de apoyo clínico y no reemplaza el diagnóstico médico. Siempre consulte a un profesional de salud.",
    restart: "Comenzar de nuevo",
    painLevel: "Nivel de dolor",
    loading: "Cargando resultado...",
    highLevel: "Alta probabilidad",
    medLevel: "Probabilidad moderada",
    lowLevel: "Baja probabilidad",
    auraTitle: "Compatible con migraña con aura",
    noAuraTitle: "Compatible con migraña sin aura",
    tensionTitle: "Compatible con cefalea tensional",
    incTitle: "No concluyente",
    auraDesc:
      "Sus respuestas son compatibles con migraña con aura.",
    noAuraDesc:
      "Sus respuestas son compatibles con migraña sin aura.",
    tensionDesc:
      "Sus respuestas son más compatibles con cefalea tensional.",
    incDesc:
      "Las respuestas disponibles no alcanzan para clasificar claramente el caso.",
    auraRecs: [
      "Solicite una consulta con neurología",
      "Evite luz intensa, ruido y estrés",
      "Lleve un diario de síntomas",
      "Acuda a urgencias si aparece un dolor súbito e intenso",
    ],
    noAuraRecs: [
      "Programe una consulta con su médico",
      "Registre frecuencia y duración de los dolores",
      "Descanse en ambientes oscuros y tranquilos",
      "Revise la medicación actual con un profesional",
    ],
    tensionRecs: [
      "Manténgase hidratado y descanse bien",
      "Controle postura, sueño y estrés",
      "Observe si los síntomas cambian o empeoran",
      "Consulte a su médico si los dolores continúan",
    ],
    incRecs: [
      "Monitoree sus síntomas en el tiempo",
      "Registre duración e intensidad del dolor",
      "Anote síntomas asociados",
      "Consulte a un profesional si lo necesita",
    ],
    freqLabels: ["< 1 día/mes", "1–4 días/mes", "5–14 días/mes", "15+ días/mes"],
    locLabels: ["Un lado", "Ambos lados", "Detrás de los ojos", "Toda la cabeza"],
    durLabels: ["< 1 hora", "1–4 horas", "4–72 horas", "> 3 días"],
    nausea: "Náuseas",
    lightSens: "Fotosensibilidad/sonido",
    auraSymp: "Síntomas de aura",
    pain: "Dolor",
    symptomLabels: {
  aura_any: "Síntomas de aura antes del dolor",
  aura_gradual: "El aura apareció gradualmente",
  aura_duration: "El aura duró entre 5 y 60 minutos",
  aura_followed_headache: "El dolor empezó dentro de 1 hora del aura",
  migraine_duration: "El dolor duró entre 4 horas y 3 días",
  unilateral: "El dolor estuvo de un solo lado",
  pulsating: "El dolor fue pulsátil",
  moderate_severe: "El dolor fue moderado o fuerte",
  worse_activity: "El dolor empeoró con la actividad",
  nausea: "Náuseas o vómitos",
  light_sensitive: "Molestia con la luz",
  sound_sensitive: "Molestia con el ruido",
  tension_duration: "El dolor duró entre 30 minutos y 7 días",
  bilateral: "El dolor estuvo en ambos lados",
  pressure: "El dolor fue opresivo o tipo presión",
  mild_moderate: "El dolor fue leve o moderado",
},
  },
};

async function sendAnswersToBackend(mappedAnswers) {
  const response = await fetch("http://127.0.0.1:5000/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mappedAnswers),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch diagnosis");
  }

  return await response.json();
}


function Header() {
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

function LanguageScreen({ onSelect }) {
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
          transition: "background 0.15s",
          letterSpacing: "0.2px",
        }}
      >
        {selected === "es" ? "Continuar →" : "Continue →"}
      </button>
    </div>
  );
}

function QuestionsScreen({ lang, onComplete, onBack }) {
  const ui = UI[lang];
  const allQuestions = QUESTIONS[lang];

  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const visibleQuestions = allQuestions.filter((q) => {
    if (!q.showIf) return true;
    return q.showIf(answers);
  });

  const q = visibleQuestions[current];
  const total = visibleQuestions.length;
  const progress = Math.round((current / total) * 100);
  const isLast = current === total - 1;

  function handleBinaryAnswer(value) {
    const updatedAnswers = {
      ...answers,
      [q.id]: value,
    };

    setAnswers(updatedAnswers);

    if (isLast) {
      onComplete(updatedAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function goBack() {
    if (current === 0) {
      onBack();
    } else {
      setCurrent((c) => c - 1);
    }
  }

  return (
    <div style={{ padding: "24px 24px 36px", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 500 }}>
            {ui.question(current + 1, total)}
          </span>
          <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600 }}>
            {progress}%
          </span>
        </div>

        <div style={{ background: COLORS.borderLight, borderRadius: 99, height: 5 }}>
          <div
            style={{
              width: `${progress}%`,
              height: 5,
              background: COLORS.teal,
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 28, marginTop: 12 }}>
        {visibleQuestions.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= current ? COLORS.teal : COLORS.borderLight,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "24px 22px",
          marginBottom: 16,
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.55,
            marginBottom: 20,
          }}
        >
          {q.text}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => handleBinaryAnswer(true)}
            style={{
              background: COLORS.bg,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "15px 16px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: 15,
              color: COLORS.text,
              fontWeight: 500,
            }}
          >
            {lang === "es" ? "Sí" : "Yes"}
          </button>

          <button
            onClick={() => handleBinaryAnswer(false)}
            style={{
              background: COLORS.bg,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "15px 16px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: 15,
              color: COLORS.text,
              fontWeight: 500,
            }}
          >
            {lang === "es" ? "No" : "No"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={goBack}
          style={{
            flex: "0 0 auto",
            padding: "14px 20px",
            background: COLORS.white,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 12,
            color: COLORS.textMuted,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          ← {ui.back}
        </button>
      </div>
    </div>
  );
}

function ResultScreen({ lang, answers, apiResult, onRestart }) {
  const ui = UI[lang];
  const diagnosisKey = apiResult?.diagnosis_key;

  let level, levelColor, levelBg, title, desc, recs;

  if (diagnosisKey === "dx_migraine_aura") {
    level = ui.highLevel;
    levelColor = COLORS.red;
    levelBg = COLORS.redBg;
    title = ui.auraTitle;
    desc = ui.auraDesc;
    recs = ui.auraRecs;
  } else if (diagnosisKey === "dx_migraine_no_aura") {
    level = ui.medLevel;
    levelColor = COLORS.amber;
    levelBg = COLORS.amberBg;
    title = ui.noAuraTitle;
    desc = ui.noAuraDesc;
    recs = ui.noAuraRecs;
  } else if (diagnosisKey === "dx_tension") {
    level = ui.lowLevel;
    levelColor = COLORS.green;
    levelBg = COLORS.greenBg;
    title = ui.tensionTitle;
    desc = ui.tensionDesc;
    recs = ui.tensionRecs;
  } else {
    level = ui.lowLevel;
    levelColor = COLORS.green;
    levelBg = COLORS.greenBg;
    title = ui.incTitle;
    desc = ui.incDesc;
    recs = ui.incRecs;
  }

  const tags = Object.entries(answers)
  .filter(([, value]) => value === true)
  .map(([key]) => ui.symptomLabels[key] || key);

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
              background: levelBg,
              border: `3px solid ${levelColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: levelColor }}>DX</span>
          </div>
          <div>
            <div
              style={{
                display: "inline-block",
                background: levelBg,
                color: levelColor,
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.2px",
              }}
            >
              {level}
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
            marginBottom: 12,
          }}
        >
          {ui.recorded}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((t, i) => (
            <span
              key={i}
              style={{
                background: COLORS.tealLight,
                color: COLORS.tealDark,
                borderRadius: 8,
                padding: "5px 11px",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
        </div>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

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

export default function App() {
  const [screen, setScreen] = useState("lang");
  const [lang, setLang] = useState("en");
  const [answers, setAnswers] = useState({});
  const [apiResult, setApiResult] = useState(null);

  function handleLangSelect(l) {
    setLang(l);
    setScreen("questions");
  }

  async function handleComplete(ans) {
  setAnswers(ans);

  try {
    const result = await sendAnswersToBackend(ans);
    setApiResult(result);
  } catch (error) {
    console.error("Backend error:", error);
    setApiResult({ diagnosis_key: "dx_inconclusive" });
  }

  setScreen("result");
}

  function handleRestart() {
    setAnswers({});
    setApiResult(null);
    setLang("en");
    setScreen("lang");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Header />
      {screen === "lang" && <LanguageScreen onSelect={handleLangSelect} />}
      {screen === "questions" && (
        <QuestionsScreen
          lang={lang}
          onComplete={handleComplete}
          onBack={() => setScreen("lang")}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          lang={lang}
          answers={answers}
          apiResult={apiResult}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}