# Migraine Screening App

This branch contains the simplified, English-only migraine screening demo.

> Demo safety: use fictitious information only. Do not enter real patient
> names, identifiers, medical records, audio, or other personal information.

The app uses decision-tree based logic to guide the user through a structured set of questions and generate a screening result. It is not intended to provide a medical diagnosis, but rather to support symptom organization and improve communication between patients and healthcare professionals.

## Simplified demo workflow

- The app opens directly on a Patient or Healthcare Provider view selector.
- The Patient flow starts with the three ID Migraine screening questions and then asks whether the patient wants to continue into the detailed headache questionnaire.
- After the detailed questionnaire, the app shows a neutral submission confirmation.
- The Patient flow does not show diagnoses, clinical interpretations, migraine types, tension-type headache results, or inconclusive results.
- The Healthcare Provider option opens the standalone clinical safety review directly.
- For demo purposes, the latest Patient submission is stored in the browser's local storage and displayed in the Healthcare Provider view.
- Migraine-specific provider content is shown only when at least two of the three ID Migraine responses are positive.
- Treatment recommendations are available only after the healthcare provider confirms that all headache red flags are absent.
- The advanced questionnaire is reused for the Patient flow without reintroducing language selection.

### Healthcare provider examination and documentation

The provider view includes a Physical Examination checklist after the headache
red-flag section, using the supplied examination template. “All normal” selects
the 23 finding checkboxes; the bilateral reflex grade remains a separate numeric
entry. Unchecked findings do not automatically mean abnormal. Additional findings
can be recorded in the examination notes.

The Assessment & Plan form provides editable history, clinician-selected assessment,
neurological examination status, imaging plan, medication and dose, diary advice,
follow-up and encounter time. Generate a draft, review/edit it, and copy it. No
diagnosis, imaging decision, or AI-use attestation is inferred from the checklist.
The form uses a local text template, not an AI service. Changing the form after
generation requires regenerating before copying; regeneration replaces draft edits.

Examination, red-flag and A+P entries survive navigation to and from treatment
recommendations during the same provider review. They are not persisted after a
reload or after leaving the provider review, and are not sent to the backend.

Provider logic checks: `cd front-migraine` then
`node --test tests/providerExam.test.mjs`.

## Main Goal

The main goal of this project is to create a clear, accessible, and clinically useful screening support tool for migraine and tension-type headache symptoms.

The application focuses on:

- Improving the user experience for patients.
- Organizing relevant symptom information.
- Providing a clearer healthcare-provider-oriented summary.
- Keeping the simplified demo focused and English-only.
- Building a maintainable structure for future improvements.

## Main Features

- Patient and healthcare provider entry views.
- Three-question Patient screening flow.
- Standalone Healthcare Provider safety review.
- Decision-tree based screening logic.
- Conditional question flow based on previous answers.
- Free-text notes for additional symptom context.
- Clearer result presentation for patients.
- More clinically relevant summary for healthcare providers.
- Responsive front-end interface.
- React front end connected to a Flask backend API.

## Tech Stack

### Front End

- React
- Vite
- JavaScript
- CSS

### Back End

- Python
- Flask
- Flask-CORS

## Project Structure

```txt
migraine_01/
│
├── api.py
│
├── README.md
│
├── front-migraine/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LanguageScreen.jsx
│   │   │   ├── QuestionsScreen.jsx
│   │   │   └── ResultScreen.jsx
│   │   │
│   │   ├── data/
│   │   │   ├── questions.js
│   │   │   └── uiText.js
│   │   │
│   │   ├── services/
│   │   │   └── diagnosisApi.js
│   │   │
│   │   ├── styles/
│   │   │   └── colors.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
````

# How It Works

The application collects the user's answers through a guided questionnaire.

The front end sends the collected answers to the Flask backend using the /diagnose endpoint. The backend evaluates the answers using a decision-tree structure and returns a diagnosis key. The front end then displays the corresponding result depending on the selected view and language.

## API Endpoints
GET /
Returns a basic confirmation message that the API is running.

POST /diagnose
Receives the user's answers and returns a screening result.

POST /transcribe
Receives browser-recorded audio and returns a Deepgram Nova-3 transcript. The
Deepgram API key is read only by the Flask backend and is never sent to the
browser.

### Deepgram setup

Create a local `.env` file beside `api.py`:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key
```

The Flask backend loads this file automatically when it starts. The key remains
server-side and the `.env` file is ignored by Git. Then start the React app from
`front-migraine` as usual. For this demo, voice
transcription is available only when English is selected and Nova-3 is fixed to
`en-US`. Audio recording stops automatically after 60 seconds and the
transcript is appended to the optional patient note.

Both development servers bind only to the local computer. Flask accepts browser
requests only from `http://127.0.0.1:5173` and `http://localhost:5173` by
default. Additional origins must be explicitly configured with
`FRONTEND_ORIGINS`; do not expose the development servers to a public network.

### Current Development Progress

Since the last review, the project has been improved in several areas:

Reorganized the front-end code into clearer sections.
Separated components, data, UI text, services, and styles.
Improved the question flow.
Added conditional visibility logic for questions.
Improved the separation between patient and healthcare provider result views.
Refined the user interface, spacing, layout, and button behavior.
Improved bilingual text organization.
Tested the connection between the React front end and the Flask backend.
Added clearer structure to support future improvements.
Current Development Focus

###The current focus is on improving:

Code clarity.
Internal documentation.
User experience.
Clinical result presentation.
Stability before adding larger new features.
Future Improvements

###Possible next steps include:

Adding more detailed internal comments.
Improving the README as the project evolves.
Refining the healthcare provider summary.
Improving the free-text notes section.
Exploring chatbot-based support to extract useful symptom information from patient notes.
Adding stronger input validation.
Expanding testing with more symptom combinations.
Continuing to review the clinical screening logic.
Important Note

This application is a screening support tool and does not replace professional medical evaluation.

The result provided by the app should be interpreted as an aid to organize symptoms before speaking with a healthcare professional.

Author

Developed by Agostina Sancisi.
