from flask import Flask, request, jsonify
from flask_cors import CORS
from tree_builder import build_tree

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def normalize_side(side_value):
    if not isinstance(side_value, str):
        return {
            "normalized_side": None,
            "unilateral": False,
            "bilateral": False
        }

    side = side_value.strip().lower()

    if side in ["left", "right", "changes sides"]:
        return {
            "normalized_side": side,
            "unilateral": True,
            "bilateral": False
        }

    if side == "both sides":
        return {
            "normalized_side": side,
            "unilateral": False,
            "bilateral": True
        }

    return {
        "normalized_side": "not sure",
        "unilateral": False,
        "bilateral": False
    }

def normalize_intensity(intensity_value):
    if not isinstance(intensity_value, str):
        return {
            "pain_intensity": None,
            "mild_moderate": False,
            "moderate_severe": False
        }

    intensity = intensity_value.strip().lower()

    if intensity == "mild":
        return {
            "pain_intensity": "mild",
            "mild_moderate": True,
            "moderate_severe": False
        }

    if intensity == "moderate":
        return {
            "pain_intensity": "moderate",
            "mild_moderate": True,
            "moderate_severe": True
        }

    if intensity == "severe":
        return {
            "pain_intensity": "severe",
            "mild_moderate": False,
            "moderate_severe": True
        }

    return {
        "pain_intensity": "unknown",
        "mild_moderate": False,
        "moderate_severe": False
    }

def compute_lipton_score(answers):
    score = 0

    if answers.get("nausea") is True:
        score += 1

    if answers.get("light_sensitive") is True:
        score += 1

    if answers.get("worse_activity") is True:
        score += 1

    return score


def build_patient_view(language="en"):
    is_spanish = language == "es"

    if is_spanish:
        return {
            "result_title": "Gracias por completar el cuestionario",
            "result_description": "Tus respuestas fueron registradas para que las revise un profesional de salud.",
            "next_steps": [
                "Revisá los resultados con un profesional de salud calificado.",
                "Compartí detalles sobre frecuencia, duración, desencadenantes o medicación utilizada.",
                "Buscá atención médica urgente si los síntomas son repentinos, intensos o inusuales."
            ]
        }

    return {
        "result_title": "Thank you for completing the questionnaire",
        "result_description": "Your answers were recorded for healthcare professional review.",
        "next_steps": [
            "Review the results with a qualified healthcare professional.",
            "Share any details about frequency, duration, triggers, or medication use.",
            "Seek urgent medical care if symptoms are sudden, severe, or unusual."
        ]
    }


def get_diagnosis_label(diagnosis_key, language="en"):
    labels = {
        "en": {
            "dx_migraine_aura": "Compatible with migraine with aura",
            "dx_migraine_no_aura": "Compatible with migraine without aura",
            "dx_tension": "Compatible with tension-type headache",
            "dx_inconclusive": "Inconclusive",
            "lipton_positive": "Positive Lipton screening",
            "lipton_negative": "Non-positive Lipton screening"
        },
        "es": {
            "dx_migraine_aura": "Compatible con migraña con aura",
            "dx_migraine_no_aura": "Compatible con migraña sin aura",
            "dx_tension": "Compatible con cefalea tensional",
            "dx_inconclusive": "No concluyente",
            "lipton_positive": "Screening Lipton positivo",
            "lipton_negative": "Screening Lipton no positivo"
        }
    }

    return labels.get(language, labels["en"]).get(diagnosis_key, diagnosis_key)


@app.route("/diagnose", methods=["POST", "OPTIONS"])
def diagnose():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    try:
        answers = request.get_json(silent=True)

        if answers is None:
            return jsonify({"error": "Request body must be valid JSON"}), 400

        if not isinstance(answers, dict):
            return jsonify({"error": "JSON body must be an object"}), 400

        language = answers.get("language", "en")
        if language not in ["en", "es"]:
            language = "en"

        additional_notes = str(answers.get("additional_notes", "")).strip()
        assessment_mode = answers.get("assessment_mode", "complete")

        side_data = normalize_side(answers.get("pain_side"))
        answers["unilateral"] = side_data["unilateral"]
        answers["bilateral"] = side_data["bilateral"]

        intensity_data = normalize_intensity(answers.get("pain_intensity"))
        answers["mild_moderate"] = intensity_data["mild_moderate"]
        answers["moderate_severe"] = intensity_data["moderate_severe"]

        lipton_score = compute_lipton_score(answers)
        lipton_positive = lipton_score >= 2

        if assessment_mode == "basic_lipton":
            diagnosis_key = "lipton_positive" if lipton_positive else "lipton_negative"
        else:
            assessment_mode = "complete"
            tree_root = build_tree()
            diagnosis_key = tree_root.evaluate(answers)

            if not diagnosis_key:
                diagnosis_key = "dx_inconclusive"

        patient_view = build_patient_view(language)

        doctor_view = {
            "assessment_mode": assessment_mode,
            "diagnosis_key": diagnosis_key,
            "diagnosis_label": get_diagnosis_label(diagnosis_key, language),
            "lipton_score": lipton_score,
            "lipton_positive": lipton_positive,
            "answers_summary": {
                "pain_side": side_data["normalized_side"],
                "pain_intensity": intensity_data["pain_intensity"],
                "pulsating": answers.get("pulsating"),
                "worse_activity": answers.get("worse_activity"),
                "nausea": answers.get("nausea"),
                "light_sensitive": answers.get("light_sensitive"),
                "sound_sensitive": answers.get("sound_sensitive"),
                "migraine_duration": answers.get("migraine_duration"),
                "tension_duration": answers.get("tension_duration"),
                "pressure": answers.get("pressure"),
                "aura_any": answers.get("aura_any"),
                "aura_gradual": answers.get("aura_gradual"),
                "aura_duration": answers.get("aura_duration"),
                "aura_followed_headache": answers.get("aura_followed_headache")
            },
            "additional_notes": additional_notes
        }

        return jsonify({
            "diagnosis_key": diagnosis_key,
            "assessment_mode": assessment_mode,
            "patient_view": patient_view,
            "doctor_view": doctor_view
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Migraine screening API is running"
    })


if __name__ == "__main__":
    app.run(debug=True)