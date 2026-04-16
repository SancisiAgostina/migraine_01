export async function sendAnswersToBackend(mappedAnswers, lang) {
    const payload = {
      ...mappedAnswers,
      language: lang,
    };
  
    const response = await fetch("http://127.0.0.1:5000/diagnose", {
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