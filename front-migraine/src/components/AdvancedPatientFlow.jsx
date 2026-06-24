import QuestionsScreen from "./QuestionsScreen";

export default function AdvancedPatientFlow({ lang, onComplete, onBack }) {
  return (
    <QuestionsScreen
      lang={lang}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}
