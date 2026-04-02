function QuestionScreen({
  currentQuestionIndex,
  questions,
  currentQuestion,
  language,
  currentContent,
  handleAnswer,
  handleBack
}) {
  return (
    <div>
      <p>
        {currentQuestionIndex + 1} / {questions.length}
      </p>

      <h2>{currentQuestion.text[language]}</h2>

      <button onClick={() => handleAnswer(true)}>
        {currentContent.yes}
      </button>

      <button onClick={() => handleAnswer(false)}>
        {currentContent.no}
      </button>

      {currentQuestionIndex > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleBack}>{currentContent.back}</button>
        </div>
      )}
    </div>
  );
}

export default QuestionScreen;