export const QUESTIONS = {
  en: [
    {
      id: "worse_activity",
      section: "lipton",
      type: "binary",
      text: "Has a headache limited your activities for a day or more in the last 3 months?"
    },
    {
      id: "nausea",
      section: "lipton",
      type: "binary",
      text: "Are you nauseated or sick to your stomach when you have a headache?"
    },
    {
      id: "light_sensitive",
      section: "lipton",
      type: "binary",
      text: "Does light bother you when you have a headache?"
    },
    {
      id: "wants_additional_questions",
      section: "transition",
      type: "additional_prompt",
      text: "Would you like to answer a few additional questions to help the healthcare professional better understand your symptoms before the consultation?"
    },
    {
      id: "aura_any",
      section: "additional",
      type: "binary",
      text: "Before the headache, did you have visual changes, tingling, or trouble speaking?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "aura_gradual",
      section: "additional",
      type: "binary",
      text: "Did those symptoms build up gradually over several minutes?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "aura_duration",
      section: "additional",
      type: "binary",
      text: "Did those symptoms last between 5 and 60 minutes?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "aura_followed_headache",
      section: "additional",
      type: "binary",
      text: "Did the headache start within 1 hour after those symptoms?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "migraine_duration",
      section: "additional",
      type: "binary",
      text: "Did the headache last between 4 hours and 3 days?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pain_side",
      section: "additional",
      type: "multiple_choice",
      text: "Which side of the head hurt the most?",
      showIf: (answers) => answers.wants_additional_questions === true,
      options: [
        { value: "left", label: "Left side" },
        { value: "right", label: "Right side" },
        { value: "both sides", label: "Both sides" },
        { value: "changes sides", label: "It changes sides" },
        { value: "not sure", label: "I am not sure" }
      ]
    },
    {
      id: "pulsating",
      section: "additional",
      type: "binary",
      text: "Did the pain feel like throbbing or pulsing?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "sound_sensitive",
      section: "additional",
      type: "binary",
      text: "Did sound bother you?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "tension_duration",
      section: "additional",
      type: "binary",
      text: "Did the headache last between 30 minutes and 7 days?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pressure",
      section: "additional",
      type: "binary",
      text: "Did the pain feel like pressure or tightness rather than throbbing?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pain_intensity",
      section: "additional",
      type: "intensity_scale",
      text: "How intense was the pain?",
      showIf: (answers) => answers.wants_additional_questions === true,
      options: [
        { value: "mild", label: "Mild" },
        { value: "moderate", label: "Moderate" },
        { value: "severe", label: "Severe" }
      ]
    },
    {
      id: "additional_notes",
      section: "additional",
      type: "text",
      optional: true,
      maxLength: 500,
      text: "Is there anything else you would like to tell the doctor about your headache?",
      showIf: (answers) => answers.wants_additional_questions === true
    }
  ],

  es: [
    {
      id: "worse_activity",
      section: "lipton",
      type: "binary",
      text: "¿El dolor de cabeza limitó tus actividades por un día o más en los últimos tres meses?"
    },
    {
      id: "nausea",
      section: "lipton",
      type: "binary",
      text: "¿Sentiste náuseas o ganas de vomitar cuando te duele la cabeza?"
    },
    {
      id: "light_sensitive",
      section: "lipton",
      type: "binary",
      text: "¿La luz te molesta cuando te duele la cabeza?"
    },
    {
      id: "wants_additional_questions",
      section: "transition",
      type: "additional_prompt",
      text: "¿Desearía responder unas preguntas adicionales para que el profesional pueda comprender mejor sus síntomas antes de la consulta?"
    },
    {
      id: "aura_any",
      section: "additional",
      type: "binary",
      text: "Antes del dolor de cabeza, ¿tuviste cambios visuales, hormigueo o dificultad para hablar?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "aura_gradual",
      section: "additional",
      type: "binary",
      text: "¿Esos síntomas aparecieron de a poco en varios minutos?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "aura_duration",
      section: "additional",
      type: "binary",
      text: "¿Esos síntomas duraron entre 5 y 60 minutos?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "aura_followed_headache",
      section: "additional",
      type: "binary",
      text: "¿Después de esos síntomas empezó el dolor de cabeza en menos de 1 hora?",
      showIf: (answers) => answers.wants_additional_questions === true && answers.aura_any === true
    },
    {
      id: "migraine_duration",
      section: "additional",
      type: "binary",
      text: "¿El dolor de cabeza duró entre 4 horas y 3 días?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pain_side",
      section: "additional",
      type: "multiple_choice",
      text: "¿De qué lado de la cabeza sentiste más dolor?",
      showIf: (answers) => answers.wants_additional_questions === true,
      options: [
        { value: "left", label: "Lado izquierdo" },
        { value: "right", label: "Lado derecho" },
        { value: "both sides", label: "Ambos lados" },
        { value: "changes sides", label: "Cambia de lado" },
        { value: "not sure", label: "No estoy seguro/a" }
      ]
    },
    {
      id: "pulsating",
      section: "additional",
      type: "binary",
      text: "¿El dolor latía o se sentía como pulsaciones?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "sound_sensitive",
      section: "additional",
      type: "binary",
      text: "¿El ruido te molestaba?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "tension_duration",
      section: "additional",
      type: "binary",
      text: "¿El dolor duró entre 30 minutos y 7 días?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pressure",
      section: "additional",
      type: "binary",
      text: "¿El dolor se sentía como presión o peso, y no como latidos?",
      showIf: (answers) => answers.wants_additional_questions === true
    },
    {
      id: "pain_intensity",
      section: "additional",
      type: "intensity_scale",
      text: "¿Qué intensidad tuvo el dolor?",
      showIf: (answers) => answers.wants_additional_questions === true,
      options: [
        { value: "mild", label: "Leve" },
        { value: "moderate", label: "Moderado" },
        { value: "severe", label: "Fuerte" }
      ]
    },
    {
      id: "additional_notes",
      section: "additional",
      type: "text",
      optional: true,
      maxLength: 500,
      text: "¿Hay algo más que quieras contarle al médico sobre tu dolor de cabeza?",
      showIf: (answers) => answers.wants_additional_questions === true
    }
  ]
};
