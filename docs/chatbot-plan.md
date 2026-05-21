# Safe chatbot integration plan

This project can use a chatbot as a clinical support tool, not as a direct diagnostic tool for patients.

## Recommended scope

The chatbot should process the patient's free-text or voice-transcribed note and extract structured information for professional review.

It should not:

- Provide a diagnosis directly to the patient.
- Replace the existing decision tree.
- Make treatment recommendations without professional review.
- Store or expose patient data unnecessarily.

## Suggested output

```json
{
  "symptoms_mentioned": ["nausea", "light sensitivity"],
  "duration": "not specified",
  "triggers": ["movement"],
  "medications_mentioned": [],
  "red_flags_mentioned": [],
  "uncertainty_notes": "The patient did not mention headache frequency."
}
```

## Suggested architecture

1. Patient completes the questionnaire.
2. Patient optionally writes or dictates an additional note.
3. Flask backend sends only that note text to the model.
4. Model returns structured JSON for physician review.
5. The physician view displays the extracted summary with the original note.

## Safety notes

- Keep the patient result neutral.
- Show diagnostic information only in the physician view.
- Add clear disclaimers that the tool does not replace medical evaluation.
- Avoid sending audio files; transcribe in the browser when possible and only send text.
