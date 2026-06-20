import { useState } from "react";
import Header from "./components/Header";
import LanguageScreen from "./components/LanguageScreen";
import QuestionsScreen from "./components/QuestionsScreen";
import ResultScreen from "./components/ResultScreen";
import { COLORS } from "./styles/colors";
import { sendAnswersToBackend } from "./services/diagnosisApi";

export default function App() {
  const [screen, setScreen] = useState("lang");
  const [lang, setLang] = useState("en");
  const [apiResult, setApiResult] = useState(null);

  function handleLangSelect(selectedLang) {
    setLang(selectedLang);
    setScreen("questions");
  }

  async function handleComplete(ans) {
    try {
      const result = await sendAnswersToBackend(ans, lang);
      setApiResult(result);
    } catch (error) {
      console.error("Backend error:", error);
      setApiResult({ diagnosis_key: "dx_inconclusive" });
    }

    setScreen("result");
  }

  function handleRestart() {
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

      <div
        role="note"
        style={{
          maxWidth: 720,
          margin: "14px auto 0",
          padding: "10px 16px",
          color: COLORS.textMuted,
          fontSize: 12,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        Demo only — use fictitious information. Do not enter real patient data.
        <br />
        Solo demostración — usá información ficticia. No ingreses datos reales de pacientes.
      </div>

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
    apiResult={apiResult}
    onRestart={handleRestart}
  />
)}
    </div>
  );
}
