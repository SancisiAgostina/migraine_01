function ResultScreen({ currentContent, answers, resultData, handleRestart }) {
  function getDiagnosisText() {
    if (!resultData) return "Loading...";

    if (resultData.diagnosis_key === "dx_migraine_aura") {
      return "Compatible with migraine with aura";
    }

    if (resultData.diagnosis_key === "dx_migraine_no_aura") {
      return "Compatible with migraine without aura";
    }

    if (resultData.diagnosis_key === "dx_tension") {
      return "Compatible with tension-type headache";
    }

    return "Inconclusive";
  }

  return (
    <div>
      <h2>{currentContent.resultTitle}</h2>

      <p><strong>{getDiagnosisText()}</strong></p>

      <h3>{currentContent.answersTitle}</h3>
      <pre>{JSON.stringify(answers, null, 2)}</pre>

      <button onClick={handleRestart}>{currentContent.restart}</button>
    </div>
  );
}

export default ResultScreen;