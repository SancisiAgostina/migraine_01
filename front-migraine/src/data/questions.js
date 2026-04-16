export const QUESTIONS = {
    en: [
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
        id: "worse_activity",
        type: "binary",
        text: "Did walking, moving, or climbing stairs make it worse?"
      },
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
        id: "pain_side",
        type: "multiple_choice",
        text: "Which side of the head hurt the most?",
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
        type: "binary",
        text: "Did the pain feel like throbbing or pulsing?"
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
        id: "pressure",
        type: "binary",
        text: "Did the pain feel like pressure or tightness rather than throbbing?"
      },
      {
        id: "pain_intensity",
        type: "intensity_scale",
        text: "How intense was the pain?",
        options: [
          { value: "mild", label: "Mild" },
          { value: "moderate", label: "Moderate" },
          { value: "severe", label: "Severe" }
        ]
      },
      {
        id: "additional_notes",
        type: "text",
        optional: true,
        maxLength: 500,
        text: "Is there anything else you would like to tell the doctor about your headache?"
      }
    ],
  
    es: [
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
        id: "worse_activity",
        type: "binary",
        text: "¿Caminar, moverte o subir escaleras lo empeoraba?"
      },
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
        id: "pain_side",
        type: "multiple_choice",
        text: "¿De qué lado de la cabeza sentiste más dolor?",
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
        type: "binary",
        text: "¿El dolor latía o se sentía como pulsaciones?"
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
        id: "pressure",
        type: "binary",
        text: "¿El dolor se sentía como presión o peso, y no como latidos?"
      },
      {
        id: "pain_intensity",
        type: "intensity_scale",
        text: "¿Qué intensidad tuvo el dolor?",
        options: [
          { value: "mild", label: "Leve" },
          { value: "moderate", label: "Moderado" },
          { value: "severe", label: "Fuerte" }
        ]
      },
      {
        id: "additional_notes",
        type: "text",
        optional: true,
        maxLength: 500,
        text: "¿Hay algo más que quieras contarle al médico sobre tu dolor de cabeza?"
      }
    ]
  };