import { QUESTIONS } from "../data/questions.js";

export function createAssessmentPlanState(submission) {
  const groups = [
    ["ID MIGRAINE SCREENING", ["worse_activity", "nausea", "light_sensitive"]],
    ["HEADACHE CHARACTERISTICS", ["migraine_duration", "tension_duration", "pain_side", "pulsating", "pressure", "pain_intensity", "sound_sensitive"]],
    ["AURA / ASSOCIATED NEUROLOGICAL SYMPTOMS", ["aura_any", "aura_gradual", "aura_duration", "aura_followed_headache"]],
  ];
  const history = groups.flatMap(([title, ids]) => {
    const entries = ids.flatMap((id) => {
      const question = QUESTIONS.en.find((item) => item.id === id);
      const answer = submission?.answers?.[id];
      if (answer === undefined || answer === null || answer === "") return [];
      const label = typeof answer === "boolean"
        ? (answer ? "Yes" : "No")
        : question.options?.find((option) => option.value === answer)?.label || answer;
      return [`${question.text}\nAnswer: ${label}`];
    });
    return entries.length ? [`${title}\n${entries.join("\n\n")}`] : [];
  });
  if (submission?.answers?.additional_notes?.trim()) history.push(`PATIENT NOTES\n${submission.answers.additional_notes.trim()}`);
  return {
    age: "", sex: "", history: history.join("\n\n"),
    consistency: "", diagnoses: {}, neurologicalExam: "", imaging: "", imagingType: "",
    medication: "", dose: "", diary: false, aiUsed: false,
    followUp: "", followUpUnit: "weeks", minutes: "", notes: "",
    draft: "", draftSource: "",
  };
}

export const DIAGNOSES = ["migraine", "migraine with aura", "tension headache"];

export function buildAssessmentPlan(state) {
  const parts = [];
  const patient = [state.age ? `${state.age} year old` : "", state.sex].filter(Boolean).join(" ") || "Patient";
  parts.push(state.history.trim() ? `${patient} with the following reported history:\n\n${state.history.trim()}\n` : `${patient}. History not documented.`);
  const diagnoses = DIAGNOSES.filter((diagnosis) => state.diagnoses[diagnosis]);
  if (state.consistency && diagnoses.length) {
    parts.push(`Symptoms ${state.consistency === "consistent" ? "consistent" : "are not consistent"} with ${diagnoses.join(" / ")}.`);
  }
  if (state.neurologicalExam) parts.push(`Neurological examination is ${state.neurologicalExam}.`);
  if (state.imaging === "none") parts.push("Do not recommend imaging.");
  if (state.imaging === "obtain" && state.imagingType.trim()) parts.push(`Will obtain ${state.imagingType.trim()}.`);
  if (state.medication.trim() && state.dose.trim()) parts.push(`Will give trial of ${state.medication.trim()} ${state.dose.trim()}.`);
  if (state.diary) parts.push("Patient instructed to keep headache diary.");
  if (state.aiUsed) parts.push("Artificial intelligence clinical decision support tool utilized but final clinical decisions made by me.");
  if (state.followUp) parts.push(`RTC ${state.followUp} ${state.followUpUnit}.`);
  if (state.notes.trim()) parts.push(state.notes.trim());
  if (state.minutes) parts.push(`\nI spent ${state.minutes} minutes evaluating patient, reviewing medical records, coordinating medical care, ordering prescriptions, and documenting the encounter.`);
  return parts.join(" ");
}

export function getPlanValidation(state) {
  if (state.imaging === "obtain" && !state.imagingType.trim()) return "Enter the imaging type or change the imaging plan.";
  if (Boolean(state.medication.trim()) !== Boolean(state.dose.trim())) return "Enter both the medication and dose, or leave both blank.";
  if (Boolean(state.consistency) !== DIAGNOSES.some((diagnosis) => state.diagnoses[diagnosis])) return "Select both the symptom assessment and at least one diagnosis, or leave both blank.";
  for (const [field, label, minimum] of [["age", "Age", 0], ["followUp", "Follow-up interval", 1], ["minutes", "Encounter time", 0]]) {
    if (state[field] !== "" && (!Number.isInteger(Number(state[field])) || Number(state[field]) < minimum)) return `${label} must be a whole number of at least ${minimum}.`;
  }
  return "";
}
