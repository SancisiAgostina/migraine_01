const questions = [
  {
    key: "aura_any",
    text: {
      en: "Before the headache, did you have visual changes, tingling, or trouble speaking?",
      es: "Antes del dolor de cabeza, ¿tuviste cambios visuales, hormigueo o dificultad para hablar?"
    }
  },
  {
    key: "aura_gradual",
    text: {
      en: "Did those symptoms build up gradually over several minutes?",
      es: "¿Esos síntomas aparecieron de a poco en varios minutos?"
    },
    visibility: {
      dependsOn: "aura_any",
      equals: true
    }
  },
  {
    key: "aura_duration",
    text: {
      en: "Did those symptoms last between 5 and 60 minutes?",
      es: "¿Esos síntomas duraron entre 5 y 60 minutos?"
    },
    visibility: {
      dependsOn: "aura_any",
      equals: true
    }
  },
  {
    key: "aura_followed_headache",
    text: {
      en: "Did the headache start within 1 hour after those symptoms?",
      es: "¿Después de esos síntomas empezó el dolor de cabeza en menos de 1 hora?"
    },
    visibility: {
      dependsOn: "aura_any",
      equals: true
    }
  },
  {
    key: "migraine_duration",
    text: {
      en: "Did the headache last between 4 hours and 3 days?",
      es: "¿El dolor de cabeza duró entre 4 horas y 3 días?"
    }
  },
  {
    key: "unilateral",
    text: {
      en: "Was the pain mostly on one side of the head?",
      es: "¿El dolor estuvo más de un solo lado de la cabeza?"
    }
  },
  {
    key: "pulsating",
    text: {
      en: "Did the pain feel like throbbing or pulsing?",
      es: "¿El dolor latía o se sentía como pulsaciones?"
    }
  },
  {
    key: "moderate_severe",
    text: {
      en: "Was the pain moderate or strong?",
      es: "¿El dolor fue moderado o fuerte?"
    }
  },
  {
    key: "worse_activity",
    text: {
      en: "Did walking, moving, or climbing stairs make it worse?",
      es: "¿Caminar, moverte o subir escaleras lo empeoraba?"
    }
  },
  {
    key: "nausea",
    text: {
      en: "Did you feel nauseous or like vomiting?",
      es: "¿Tuviste náuseas o ganas de vomitar?"
    }
  },
  {
    key: "light_sensitive",
    text: {
      en: "Did light bother you?",
      es: "¿La luz te molestaba?"
    }
  },
  {
    key: "sound_sensitive",
    text: {
      en: "Did sound bother you?",
      es: "¿El ruido te molestaba?"
    }
  },
  {
    key: "tension_duration",
    text: {
      en: "Did the headache last between 30 minutes and 7 days?",
      es: "¿El dolor duró entre 30 minutos y 7 días?"
    }
  },
  {
    key: "bilateral",
    text: {
      en: "Was the pain on both sides of the head?",
      es: "¿El dolor estuvo en ambos lados de la cabeza?"
    }
  },
  {
    key: "pressure",
    text: {
      en: "Did the pain feel like pressure or tightness rather than throbbing?",
      es: "¿El dolor se sentía como presión o peso, y no como latidos?"
    }
  },
  {
    key: "mild_moderate",
    text: {
      en: "Was the pain mild or moderate?",
      es: "¿El dolor fue leve o moderado?"
    }
  }
];

export default questions;