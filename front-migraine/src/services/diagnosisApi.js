const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function sendAnswersToBackend(mappedAnswers, lang) {
  const payload = {
    ...mappedAnswers,
    language: lang,
  };

  const response = await fetch(`${API_URL}/diagnose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch diagnosis");
  }

  return await response.json();
}

export async function transcribeAudio(audioBlob, lang) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 30_000);

  let response;
  try {
    response = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": audioBlob.type || "audio/webm",
        "X-Language": lang,
      },
      body: audioBlob,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 503 && result.error === "Audio transcription is not configured") {
      throw new Error(
        "Voice transcription is not configured. Add DEEPGRAM_API_KEY to the backend .env file and restart the backend."
      );
    }

    throw new Error(result.error || "Failed to transcribe audio");
  }

  return result;
}
