import { useState } from "react";
import Header from "./components/Header";
import RoleScreen from "./components/RoleScreen";
import AdvancedPatientFlow from "./components/AdvancedPatientFlow";
import ThankYouScreen from "./components/ThankYouScreen";
import PhysicianView from "./components/PhysicianView";
import { COLORS } from "./styles/colors";
import { sendAnswersToBackend } from "./services/diagnosisApi";
import { saveLatestPatientSubmission } from "./services/patientSubmissionStorage";

export default function App() {
  const [screen, setScreen] = useState("role");
  const lang = "en";

  function handleRoleSelect(selectedRole) {
    setScreen(selectedRole === "patient" ? "questions" : "physician");
  }

  async function handleComplete(ans) {
    saveLatestPatientSubmission(ans);

    try {
      await sendAnswersToBackend(ans, lang);
    } catch (error) {
      console.error("Backend error:", error);
    }

    setScreen("thank-you");
  }

  function handleRestart() {
    setScreen("role");
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
      </div>

      {screen === "role" && <RoleScreen onSelect={handleRoleSelect} />}

      {screen === "questions" && (
        <AdvancedPatientFlow
          lang={lang}
          onComplete={handleComplete}
          onBack={() => setScreen("role")}
        />
      )}

      {screen === "thank-you" && <ThankYouScreen onRestart={handleRestart} />}

      {screen === "physician" && <PhysicianView onBack={handleRestart} />}
    </div>
  );
}
