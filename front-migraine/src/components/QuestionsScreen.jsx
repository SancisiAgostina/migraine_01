import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../styles/colors";
import { QUESTIONS } from "../data/questions";
import { UI } from "../data/uiText";
import { transcribeAudio } from "../services/diagnosisApi";

const BUTTON_TRANSITION = "transform 0.18s ease, box-shadow 0.18s ease";
const MAX_RECORDING_MS = 60_000;

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

function getVisibleQuestions(allQuestions, answers) {
  return allQuestions.filter((question) => {
    if (!question.showIf) return true;
    return question.showIf(answers);
  });
}

function getStepInfo(q, visibleQuestions, current, ui) {
  if (q.section === "transition") {
    return {
      label: ui.additionalPromptLabel,
      progress: 100,
      segments: 0,
      activeSegment: -1,
    };
  }

  const sectionQuestions = visibleQuestions.filter((question) => question.section === q.section);
  const sectionIndex = sectionQuestions.findIndex((question) => question.id === q.id);
  const sectionTotal = sectionQuestions.length;
  const safeCurrent = sectionIndex >= 0 ? sectionIndex + 1 : current + 1;
  const progress = sectionTotal > 0 ? Math.round((safeCurrent / sectionTotal) * 100) : 0;

  return {
    label: ui.question(safeCurrent, sectionTotal),
    progress,
    segments: sectionTotal,
    activeSegment: safeCurrent - 1,
  };
}

export default function QuestionsScreen({
  lang,
  simplified = false,
  onComplete,
  onBack,
}) {
  const ui = UI[lang];
  const allQuestions = simplified
    ? QUESTIONS[lang].filter((question) => question.section === "lipton")
    : QUESTIONS[lang];

  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [textValues, setTextValues] = useState({});
  const [voiceStatus, setVoiceStatus] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(allQuestions, answers),
    [allQuestions, answers]
  );

  const q = visibleQuestions[current];
  const isLast = current === visibleQuestions.length - 1;
  const stepInfo = q ? getStepInfo(q, visibleQuestions, current, ui) : null;
  const textValue = q?.type === "text" ? textValues[q.id] || "" : "";

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (recordingTimeoutRef.current) {
        window.clearTimeout(recordingTimeoutRef.current);
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function completeWithAnswers(updatedAnswers, mode) {
    onComplete({
      ...updatedAnswers,
      assessment_mode: mode,
    });
  }

  function saveAnswer(value) {
    const updatedAnswers = {
      ...answers,
      [q.id]: value,
    };

    if (q.id === "wants_additional_questions") {
      if (value === false) {
        setAnswers(updatedAnswers);
        completeWithAnswers(updatedAnswers, "basic_lipton");
        return;
      }

      const completeAnswers = {
        ...updatedAnswers,
        assessment_mode: "complete",
      };
      setAnswers(completeAnswers);
      setCurrent((prev) => prev + 1);
      return;
    }

    setAnswers(updatedAnswers);

    if (isLast) {
      completeWithAnswers(
        updatedAnswers,
        simplified ? "basic_lipton" : updatedAnswers.assessment_mode || "complete"
      );
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

  function stopRecording() {
    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
    }
  }

  async function toggleVoiceInput() {
    if (lang !== "en") {
      setVoiceStatus(ui.voiceEnglishOnly);
      return;
    }

    if (isListening) {
      stopRecording();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceStatus(ui.voiceUnsupported);
      return;
    }

    try {
      setIsRequestingPermission(true);
      setVoiceStatus(ui.voicePermissionRequest);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRequestingPermission(false);
      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];
      const mimeType = preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (recordingTimeoutRef.current) {
          window.clearTimeout(recordingTimeoutRef.current);
          recordingTimeoutRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (!isMountedRef.current) return;

        setIsListening(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        audioChunksRef.current = [];

        if (!audioBlob.size) {
          setVoiceStatus(ui.voiceEmpty);
          return;
        }

        setIsTranscribing(true);
        setVoiceStatus(ui.voiceProcessing);

        try {
          const result = await transcribeAudio(audioBlob, lang);
          const transcript = result.transcript?.trim();

          if (!transcript) {
            setVoiceStatus(ui.voiceEmpty);
            return;
          }

          setTextValues((prevValues) => {
            const previousText = prevValues[q.id] || "";
            const separator = previousText.trim() ? " " : "";
            const nextValue = `${previousText}${separator}${transcript}`;
            return {
              ...prevValues,
              [q.id]: q.maxLength ? nextValue.slice(0, q.maxLength) : nextValue,
            };
          });
          setVoiceStatus(ui.voiceAdded);
        } catch (error) {
          console.error("Deepgram transcription error:", error);
          setVoiceStatus(error.message || ui.voiceError);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setIsListening(false);
        setVoiceStatus(ui.voiceError);
      };

      recorder.start(1_000);
      setIsListening(true);
      setVoiceStatus(ui.voiceListening);
      recordingTimeoutRef.current = window.setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch (error) {
      console.error("Microphone access error:", error);
      setVoiceStatus(ui.voicePermissionDenied);
      setIsListening(false);
      setIsRequestingPermission(false);
    }
  }

  function goBack() {
    if (isListening || isTranscribing) return;

    if (current === 0) {
      onBack();
    } else {
      setCurrent((prev) => prev - 1);
    }
  }

  if (!q || !stepInfo) return null;

  return (
    <div style={{ padding: "24px 24px 36px", maxWidth: 520, margin: "0 auto" }}>
      {q.section !== "transition" && (
        <>
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
                {stepInfo.label}
              </span>
              <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600 }}>
                {stepInfo.progress}%
              </span>
            </div>

            <div style={{ background: COLORS.borderLight, borderRadius: 99, height: 5 }}>
              <div
                style={{
                  width: `${stepInfo.progress}%`,
                  height: 5,
                  background: COLORS.teal,
                  borderRadius: 99,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 28, marginTop: 12 }}>
            {Array.from({ length: stepInfo.segments }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 99,
                  background: i <= stepInfo.activeSegment ? COLORS.teal : COLORS.borderLight,
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </>
      )}

      {q.section === "transition" && (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "inline-block",
              background: COLORS.tealLight,
              color: COLORS.tealDark,
              borderRadius: 99,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2px",
            }}
          >
            {stepInfo.label}
          </div>
        </div>
      )}

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
            fontSize: q.section === "transition" ? 18 : 17,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.55,
            marginBottom: 20,
          }}
        >
          {q.text}
        </p>

        {(q.type === "binary" || q.type === "additional_prompt") && (
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
              <div style={{ height: 8, borderRadius: 999, background: "#2E7D4F" }} />
              <div style={{ height: 8, borderRadius: 999, background: "#B7600A" }} />
              <div style={{ height: 8, borderRadius: 999, background: "#C0392B" }} />
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
                  setTextValues((prevValues) => ({
                    ...prevValues,
                    [q.id]: nextValue,
                  }));
                }
              }}
              placeholder={
                lang === "es"
                  ? "Solo datos ficticios. No incluyas nombres ni información real..."
                  : "Fictitious data only. Do not include real names or personal information..."
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

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isTranscribing || isRequestingPermission || lang !== "en"}
                {...getAnimatedButtonHandlers("medium")}
                style={{
                  ...getActionButtonStyle(),
                  flex: "1 1 auto",
                  opacity: isTranscribing || isRequestingPermission || lang !== "en" ? 0.65 : 1,
                  cursor:
                    isTranscribing || isRequestingPermission
                      ? "wait"
                      : lang !== "en"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isTranscribing
                  ? ui.voiceProcessing
                  : isRequestingPermission
                  ? ui.voicePermissionRequest
                  : isListening
                  ? ui.voiceStop
                  : ui.voiceStart}
              </button>

              <div
                style={{
                  fontSize: 12,
                  color: COLORS.textLight,
                  textAlign: "right",
                  alignSelf: "center",
                  minWidth: 70,
                }}
              >
                {textValue.length}/{q.maxLength || 500}
              </div>
            </div>

            {voiceStatus && (
              <p style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 }}>
                {voiceStatus}
              </p>
            )}

            {lang !== "en" && !voiceStatus && (
              <p style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 }}>
                {ui.voiceEnglishOnly}
              </p>
            )}

            <button
              onClick={handleTextContinue}
              disabled={isListening || isTranscribing}
              {...getAnimatedButtonHandlers("medium")}
              style={{
                ...getActionButtonStyle({ primary: true }),
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                willChange: "transform, box-shadow",
                opacity: isListening || isTranscribing ? 0.65 : 1,
                cursor: isListening || isTranscribing ? "not-allowed" : "pointer",
              }}
            >
              {isLast
                ? lang === "es"
                  ? "Terminar cuestionario"
                  : "Finish Questionnaire"
                : ui.next}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={goBack}
          disabled={isListening || isTranscribing}
          {...getAnimatedButtonHandlers("medium")}
          style={{
            ...getBackButtonStyle(),
            opacity: isListening || isTranscribing ? 0.65 : 1,
            cursor: isListening || isTranscribing ? "not-allowed" : "pointer",
          }}
        >
          ← {ui.back}
        </button>
      </div>
    </div>
  );
}
