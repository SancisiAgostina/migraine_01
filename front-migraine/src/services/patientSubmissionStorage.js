const STORAGE_KEY = "migraine-demo-latest-patient-submission";

export const LIPTON_QUESTION_IDS = [
  "worse_activity",
  "nausea",
  "light_sensitive",
];

function buildScreeningSummary(score) {
  return score >= 2
    ? `Positive Lipton screener (${score} of 3 responses positive).`
    : `Negative Lipton screener (${score} of 3 responses positive).`;
}

export function saveLatestPatientSubmission(allAnswers) {
  const answers = Object.fromEntries(
    Object.entries(allAnswers).filter(
      ([, value]) => typeof value === "boolean" || typeof value === "string"
    )
  );

  for (const questionId of LIPTON_QUESTION_IDS) {
    answers[questionId] = allAnswers[questionId] === true;
  }

  const liptonScore = LIPTON_QUESTION_IDS.filter(
    (questionId) => answers[questionId]
  ).length;

  const submission = {
    submittedAt: new Date().toISOString(),
    answers,
    liptonScore,
    liptonPositive: liptonScore >= 2,
    screeningSummary: buildScreeningSummary(liptonScore),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
  } catch (error) {
    console.error("Could not save demo patient submission:", error);
  }

  return submission;
}

export function getLatestPatientSubmission() {
  try {
    const storedSubmission = window.localStorage.getItem(STORAGE_KEY);
    if (!storedSubmission) return null;

    const submission = JSON.parse(storedSubmission);
    const hasValidAnswers = LIPTON_QUESTION_IDS.every(
      (questionId) => typeof submission?.answers?.[questionId] === "boolean"
    );
    const submittedAt = new Date(submission?.submittedAt);

    if (!hasValidAnswers || Number.isNaN(submittedAt.getTime())) return null;

    const liptonScore = LIPTON_QUESTION_IDS.filter(
      (questionId) => submission.answers[questionId]
    ).length;

    return {
      submittedAt: submittedAt.toISOString(),
      answers: submission.answers,
      liptonScore,
      liptonPositive: liptonScore >= 2,
      screeningSummary: buildScreeningSummary(liptonScore),
    };
  } catch (error) {
    console.error("Could not read demo patient submission:", error);
    return null;
  }
}
