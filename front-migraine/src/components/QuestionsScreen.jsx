import { useEffect, useState } from "react";
import { COLORS } from "../styles/colors";
import { QUESTIONS } from "../data/questions";
import { UI } from "../data/uiText";

const BUTTON_TRANSITION = "transform 0.18s ease, box-shadow 0.18s ease";

function getButtonAnimation(level = "medium") {
    if (level === "soft") {
        return {
          hoverScale: 1.01,
          downScale: 0.995,
          hoverShadow: "0 4px 10px rgba(0,0,0,0.05)",
          downShadow: "0 2px 6px rgba(0,0,0,0.04)",
        };
      }

  return {
    hoverScale: 1.02,
    downScale: 0.98,
    hoverShadow: "0 8px 18px rgba(0,0,0,0.08)",
    downShadow: "0 4px 12px rgba(0,0,0,0.06)",
  };
}

function getAnimatedButtonHandlers(level = "medium") {
  const config = getButtonAnimation(level);

  return {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = `scale(${config.hoverScale})`;
      e.currentTarget.style.boxShadow = config.hoverShadow;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = `scale(${config.downScale})`;
      e.currentTarget.style.boxShadow = config.downShadow;
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = `scale(${config.hoverScale})`;
      e.currentTarget.style.boxShadow = config.hoverShadow;
    },
  };
}

function getIntensityStyles(value) {
  if (value === "mild") {
    return {
      bg: "#EAF5EE",
      border: "#2E7D4F",
      text: "#2E7D4F",
      glowHover: "0 0 0 3px rgba(46,125,79,0.12), 0 10px 24px rgba(46,125,79,0.18)",
      glowDown: "0 0 0 3px rgba(46,125,79,0.10), 0 6px 16px rgba(46,125,79,0.14)",
    };
  }

  if (value === "moderate") {
    return {
      bg: "#FEF5E7",
      border: "#B7600A",
      text: "#B7600A",
      glowHover: "0 0 0 3px rgba(183,96,10,0.12), 0 10px 24px rgba(183,96,10,0.18)",
      glowDown: "0 0 0 3px rgba(183,96,10,0.10), 0 6px 16px rgba(183,96,10,0.14)",
    };
  }

  return {
    bg: "#FEF0EE",
    border: "#C0392B",
    text: "#C0392B",
    glowHover: "0 0 0 3px rgba(192,57,43,0.12), 0 10px 24px rgba(192,57,43,0.18)",
    glowDown: "0 0 0 3px rgba(192,57,43,0.10), 0 6px 16px rgba(192,57,43,0.14)",
  };
}

function getIntensityButtonHandlers(value) {
  const styles = getIntensityStyles(value);

  return {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = styles.glowHover;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.97)";
      e.currentTarget.style.boxShadow = styles.glowDown;
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = styles.glowHover;
    },
  };
}

function getBaseButtonStyle() {
  return {
    borderRadius: 12,
    padding: "15px 16px",
    cursor: "pointer",
    fontSize: 15,
    transition: BUTTON_TRANSITION,
    willChange: "transform, box-shadow",
  };
}

function getOptionButtonStyle() {
  return {
    ...getBaseButtonStyle(),
    background: COLORS.bg,
    border: `1.5px solid ${COLORS.border}`,
    textAlign: "left",
    color: COLORS.text,
    fontWeight: 500,
  };
}

function getActionButtonStyle({ primary = false } = {}) {
  return {
    ...getBaseButtonStyle(),
    background: primary ? COLORS.teal : COLORS.bg,
    color: primary ? "#fff" : COLORS.text,
    border: primary ? "none" : `1.5px solid ${COLORS.border}`,
    textAlign: "center",
    fontWeight: primary ? 600 : 500,
  };
}

function getBackButtonStyle() {
  return {
    ...getBaseButtonStyle(),
    flex: "0 0 auto",
    padding: "14px 20px",
    background: COLORS.white,
    border: `1.5px solid ${COLORS.border}`,
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: 500,
  };
}

export default function QuestionsScreen({ lang, onComplete, onBack }) {
  const ui = UI[lang];
  const allQuestions = QUESTIONS[lang];

  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [textValue, setTextValue] = useState("");

  const visibleQuestions = allQuestions.filter((question) => {
    if (!question.showIf) return true;
    return question.showIf(answers);
  });

  const q = visibleQuestions[current];
  const total = visibleQuestions.length;
  const progress = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  const isLast = current === total - 1;

  useEffect(() => {
    if (!q) return;

    if (q.type === "text") {
      setTextValue(answers[q.id] || "");
    } else {
      setTextValue("");
    }
  }, [q, answers]);

  function saveAnswer(value) {
    const updatedAnswers = {
      ...answers,
      [q.id]: value,
    };

    setAnswers(updatedAnswers);

    if (isLast) {
      onComplete(updatedAnswers);
    } else {
      setCurrent((prev) => prev + 1);
    }
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
      setCurrent((prev) => prev - 1);
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
              onClick={() => saveAnswer(true)}
              {...getAnimatedButtonHandlers("soft")}
              style={getOptionButtonStyle()}
            >
              {lang === "es" ? "Sí" : "Yes"}
            </button>

            <button
              onClick={() => saveAnswer(false)}
              {...getAnimatedButtonHandlers("soft")}
              style={getOptionButtonStyle()}
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
                onClick={() => saveAnswer(option.value)}
                {...getAnimatedButtonHandlers("soft")}
                style={getOptionButtonStyle()}
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
                    onClick={() => saveAnswer(option.value)}
                    {...getIntensityButtonHandlers(option.value)}
                    style={{
                      ...getBaseButtonStyle(),
                      background: styles.bg,
                      border: `2px solid ${styles.border}`,
                      borderRadius: 14,
                      padding: "18px 14px",
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
  {...getAnimatedButtonHandlers("medium")}
  style={{
    ...getActionButtonStyle({ primary: true }),
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    willChange: "transform, box-shadow",
  }}
>
  {isLast ? (lang === "es" ? "Ver resultado" : "See result") : ui.next}
</button>

              <button
                onClick={handleSkipText}
                {...getAnimatedButtonHandlers("medium")}
                style={getActionButtonStyle()}
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
          {...getAnimatedButtonHandlers("medium")}
          style={getBackButtonStyle()}
        >
          ← {ui.back}
        </button>
      </div>
    </div>
  );
}