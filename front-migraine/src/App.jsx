import { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import QuestionScreen from "./QuestionScreen";
import ResultScreen from "./ResultScreen";
import content from "./content";
import questions from "./questions";
import { sendAnswers } from "./diagnosisApi";

function App() {
  const [language, setLanguage] = useState("en");
  const [screen, setScreen] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);

  const currentContent = content[language];

function isQuestionVisible(question, answers) {
  if (!question.visibility) return true;

  return answers[question.visibility.dependsOn] === question.visibility.equals;
}

const visibleQuestions = questions.filter((question) =>
  isQuestionVisible(question, answers)
);

const currentQuestion = visibleQuestions[currentQuestionIndex];

  function handleStart() {
    setScreen("question");
  }

  async function handleAnswer(value) {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]: value
    };

    setAnswers(updatedAnswers);

    if (currentQuestionIndex < visibleQuestions.length - 1) {
  setCurrentQuestionIndex(currentQuestionIndex + 1);
} else {
  try {
    const apiResult = await sendAnswers(updatedAnswers);
    setResultData(apiResult);
    setScreen("result");
  } catch (error) {
    console.error("Error calling backend:", error);
    setResultData({
      diagnosis_key: "dx_inconclusive"
    });
    setScreen("result");
  }
}
  }

  function handleBack() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  function handleRestart() {
    setLanguage("en");
    setScreen("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResultData(null);
  }

 function getSimpleResult() {
  if (answers.aura_any) {
    return {
      diagnosis:
        language === "en"
          ? "Compatible with migraine with aura"
          : "Compatible con migraña con aura",
      explanation: currentContent.explanationAura
    };
  }

  if (answers.light_sensitive && answers.nausea) {
    return {
      diagnosis:
        language === "en"
          ? "Compatible with migraine without aura"
          : "Compatible con migraña sin aura",
      explanation: currentContent.explanationNoAura
    };
  }

  return {
    diagnosis:
      language === "en"
        ? "Inconclusive"
        : "No concluyente",
    explanation: currentContent.explanationInconclusive
  };
}

  return (
    <div>
      {screen === "welcome" && (
  <WelcomeScreen
    currentContent={currentContent}
    language={language}
    setLanguage={setLanguage}
    handleStart={handleStart}
  />
)}

      {screen === "question" && (
  <QuestionScreen
  currentQuestionIndex={currentQuestionIndex}
  questions={visibleQuestions}
  currentQuestion={currentQuestion}
  language={language}
  currentContent={currentContent}
  handleAnswer={handleAnswer}
  handleBack={handleBack}
/>
)}

      {screen === "result" && (
  <ResultScreen
  currentContent={currentContent}
  answers={answers}
  resultData={resultData}
  handleRestart={handleRestart}
/>
)}
    </div>
  );
}

export default App;