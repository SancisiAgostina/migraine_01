export async function sendAnswers(answers) {
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(answers)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch diagnosis");
  }

  return await response.json();
}