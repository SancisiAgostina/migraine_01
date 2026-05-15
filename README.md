# Migraine Screening App

This project is a bilingual migraine screening application designed to help organize headache-related symptoms before a medical consultation.

The app uses decision-tree based logic to guide the user through a structured set of questions and generate a screening result. It is not intended to provide a medical diagnosis, but rather to support symptom organization and improve communication between patients and healthcare professionals.

## Main Goal

The main goal of this project is to create a clear, accessible, and clinically useful screening support tool for migraine and tension-type headache symptoms.

The application focuses on:

- Improving the user experience for patients.
- Organizing relevant symptom information.
- Providing a clearer physician-oriented summary.
- Supporting both English and Spanish users.
- Building a maintainable structure for future improvements.

## Main Features

- Bilingual interface: English and Spanish.
- Patient and physician result views.
- Decision-tree based screening logic.
- Conditional question flow based on previous answers.
- Free-text notes for additional symptom context.
- Clearer result presentation for patients.
- More clinically relevant summary for physicians.
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

How It Works

The application collects the user's answers through a guided questionnaire.

The front end sends the collected answers to the Flask backend using the /diagnose endpoint. The backend evaluates the answers using a decision-tree structure and returns a diagnosis key. The front end then displays the corresponding result depending on the selected view and language.

API Endpoints
GET /
Returns a basic confirmation message that the API is running.

POST /diagnose
Receives the user's answers and returns a screening result.

Current Development Progress

Since the last review, the project has been improved in several areas:

Reorganized the front-end code into clearer sections.
Separated components, data, UI text, services, and styles.
Improved the question flow.
Added conditional visibility logic for questions.
Improved the separation between patient and physician result views.
Refined the user interface, spacing, layout, and button behavior.
Improved bilingual text organization.
Tested the connection between the React front end and the Flask backend.
Added clearer structure to support future improvements.
Current Development Focus

The current focus is on improving:

Code clarity.
Internal documentation.
User experience.
Clinical result presentation.
Stability before adding larger new features.
Future Improvements

Possible next steps include:

Adding more detailed internal comments.
Improving the README as the project evolves.
Refining the physician summary.
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