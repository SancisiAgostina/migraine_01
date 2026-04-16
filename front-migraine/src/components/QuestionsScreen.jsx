import { useEffect, useState } from "react";
import { COLORS } from "../styles/colors";
import { QUESTIONS } from "../data/questions";
import { UI } from "../data/uiText";

export default function QuestionsScreen({ lang, onComplete, onBack }) {
  const ui = UI[lang];
  const allQuestions = QUESTIONS[lang];

  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [textValue, setTextValue] = useState("");

  const visibleQuestions = allQuestions.filter((q) => {
    if (!q.showIf) return true;
    return q.showIf(answers);
  });

  const q = visibleQuestions[current];
  const total = visibleQuestions.length;
  const progress = Math.round(((current + 1) / total) * 100);
  const isLast = current === total - 1;

  useEffect(() => {
    if (!q) return;

    if (q.type === "text") {
      setTextValue(answers[q.id] || "");
    } else {
      setTextValue("");
    }
  }, [current, q, answers]);

  function saveAnswer(value) {
    const updatedAnswers = {
      ...answers,
      [q.id]: value,
    };

    setAnswers(updatedAnswers);

    if (isLast) {
      onComplete(updatedAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleBinaryAnswer(value) {
    saveAnswer(value);
  }

  function handleMultipleChoiceAnswer(value) {
    saveAnswer(value);
  }

  function getIntensityStyles(value) {
    if (value === "mild") {
      return {
        bg: "#EAF5EE",
        border: "#2E7D4F",
        text: "#2E7D4F",
      };
    }
  
    if (value === "moderate") {
      return {
        bg: "#FEF5E7",
        border: "#B7600A",
        text: "#B7600A",
      };
    }
  
    return {
      bg: "#FEF0EE",
      border: "#C0392B",
      text: "#C0392B",
    };
  }

  function handleTextContinue() {
    const finalText = textValue.trim();

    if (q.maxLength && finalText.length > q.maxLength) {
      return;
    }

    saveAnswer(finalText);
  }

  function handleSkipText() {
    saveAnswer("");
  }

  function goBack() {
    if (current === 0) {
      onBack();
    } else {
      setCurrent((c) => c - 1);
    }
  }

  if (!q) return null;

  return (
    <div style={{ padding: "24px 24px 36px", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 500 }}>
            {ui.question(current + 1, total)}
          </span>
          <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600 }}>
            {progress}%
          </span>
        </div>

        <div style={{ background: COLORS.borderLight, borderRadius: 99, height: 5 }}>
          <div
            style={{
              width: `${progress}%`,
              height: 5,
              background: COLORS.teal,
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 28, marginTop: 12 }}>
        {visibleQuestions.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= current ? COLORS.teal : COLORS.borderLight,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "24px 22px",
          marginBottom: 16,
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.55,
            marginBottom: 20,
          }}
        >
          {q.text}
        </p>

        {q.type === "binary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => handleBinaryAnswer(true)}
              style={{
                background: COLORS.bg,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "15px 16px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 15,
                color: COLORS.text,
                fontWeight: 500,
              }}
            >
              {lang === "es" ? "Sí" : "Yes"}
            </button>

            <button
              onClick={() => handleBinaryAnswer(false)}
              style={{
                background: COLORS.bg,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "15px 16px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 15,
                color: COLORS.text,
                fontWeight: 500,
              }}
            >
              {lang === "es" ? "No" : "No"}
            </button>
          </div>
        )}

        {q.type === "multiple_choice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleMultipleChoiceAnswer(option.value)}
                style={{
                  background: COLORS.bg,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "15px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 15,
                  color: COLORS.text,
                  fontWeight: 500,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

{q.type === "intensity_scale" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
      }}
    >
      {q.options.map((option) => {
        const styles = getIntensityStyles(option.value);

        return (
          <button
            key={option.value}
            onClick={() => handleMultipleChoiceAnswer(option.value)}
            style={{
              background: styles.bg,
              border: `2px solid ${styles.border}`,
              borderRadius: 14,
              padding: "18px 14px",
              cursor: "pointer",
              fontSize: 15,
              color: styles.text,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#2E7D4F",
        }}
      />
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#B7600A",
        }}
      />
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#C0392B",
        }}
      />
    </div>
  </div>
)}

        {q.type === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea
              value={textValue}
              onChange={(e) => {
                const nextValue = e.target.value;
                if (!q.maxLength || nextValue.length <= q.maxLength) {
                  setTextValue(nextValue);
                }
              }}
              placeholder={
                lang === "es"
                  ? "Podés agregar información extra para el médico..."
                  : "You can add any extra information for the doctor..."
              }
              style={{
                minHeight: 120,
                resize: "vertical",
                borderRadius: 12,
                border: `1.5px solid ${COLORS.border}`,
                padding: "14px 16px",
                fontSize: 14,
                color: COLORS.text,
                background: COLORS.bg,
                outline: "none",
              }}
            />

            <div
              style={{
                fontSize: 12,
                color: COLORS.textLight,
                textAlign: "right",
              }}
            >
              {textValue.length}/{q.maxLength || 500}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleTextContinue}
                style={{
                  background: COLORS.teal,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "15px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {isLast ? (lang === "es" ? "Ver resultado" : "See result") : ui.next}
              </button>

              <button
                onClick={handleSkipText}
                style={{
                  background: COLORS.bg,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "15px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontSize: 15,
                  color: COLORS.text,
                  fontWeight: 500,
                }}
              >
                {lang === "es" ? "Omitir" : "Skip"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={goBack}
          style={{
            flex: "0 0 auto",
            padding: "14px 20px",
            background: COLORS.white,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 12,
            color: COLORS.textMuted,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          ← {ui.back}
        </button>
      </div>
    </div>
  );
}