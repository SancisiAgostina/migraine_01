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


def build_patient_view(diagnosis_key, language="en"):
    is_spanish = language == "es"

    if diagnosis_key == "dx_migraine_aura":
        if is_spanish:
            return {
                "result_title": "Posible migraña con aura",
                "result_description": "Sus respuestas podrían ser compatibles con migraña con aura.",
                "next_steps": [
                    "Por favor, consulte estos síntomas con un médico.",
                    "Registre cuándo aparecen los dolores de cabeza y qué síntomas los acompañan.",
                    "Busque atención médica urgente si aparecen signos de alarma."
                ]
            }
        return {
            "result_title": "Possible migraine with aura",
            "result_description": "Your answers may be consistent with migraine with aura.",
            "next_steps": [
                "Please discuss these symptoms with a doctor.",
                "Track when your headaches happen and what symptoms appear.",
                "Seek urgent medical care if warning signs appear."
            ]
        }

    if diagnosis_key == "dx_migraine_no_aura":
        if is_spanish:
            return {
                "result_title": "Posible migraña sin aura",
                "result_description": "Sus respuestas podrían ser compatibles con migraña sin aura.",
                "next_steps": [
                    "Por favor, consulte estos síntomas con un médico.",
                    "Registre cuándo aparecen los dolores de cabeza y qué síntomas los acompañan.",
                    "Descanse en un ambiente oscuro y tranquilo durante los episodios si lo necesita."
                ]
            }
        return {
            "result_title": "Possible migraine without aura",
            "result_description": "Your answers may be consistent with migraine without aura.",
            "next_steps": [
                "Please discuss these symptoms with a doctor.",
                "Track when your headaches happen and what symptoms appear.",
                "Rest in a quiet, dark environment during episodes if needed."
            ]
        }

    if diagnosis_key == "dx_tension":
        if is_spanish:
            return {
                "result_title": "Posible cefalea tensional",
                "result_description": "Sus respuestas podrían ser más compatibles con una cefalea tensional.",
                "next_steps": [
                    "Por favor, consulte estos síntomas con un médico.",
                    "Observe con qué frecuencia aparecen los dolores de cabeza.",
                    "Registre si el estrés, la postura o el sueño afectan sus síntomas."
                ]
            }
        return {
            "result_title": "Possible tension-type headache",
            "result_description": "Your answers may be more consistent with a tension-type headache.",
            "next_steps": [
                "Please discuss these symptoms with a doctor.",
                "Monitor how often the headaches happen.",
                "Track whether stress, posture, or sleep affect your symptoms."
            ]
        }

    if is_spanish:
        return {
            "result_title": "Resultado no concluyente",
            "result_description": "No hay suficiente información para sugerir un resultado claro.",
            "next_steps": [
                "Por favor, revise sus síntomas con un médico.",
                "Complete nuevamente el cuestionario si es necesario.",
                "Busque atención médica urgente si aparecen signos de alarma."
            ]
        }

    return {
        "result_title": "Inconclusive result",
        "result_description": "There is not enough information to suggest a clear result.",
        "next_steps": [
            "Please review your symptoms with a doctor.",
            "Complete the questionnaire again if needed.",
            "Seek urgent care if warning signs appear."
        ]
    }


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

        side_data = normalize_side(answers.get("pain_side"))
        answers["unilateral"] = side_data["unilateral"]
        answers["bilateral"] = side_data["bilateral"]

        intensity_data = normalize_intensity(answers.get("pain_intensity"))
        answers["mild_moderate"] = intensity_data["mild_moderate"]
        answers["moderate_severe"] = intensity_data["moderate_severe"]

        tree_root = build_tree()
        diagnosis_key = tree_root.evaluate(answers)

        if not diagnosis_key:
            diagnosis_key = "dx_inconclusive"

        lipton_score = compute_lipton_score(answers)
        lipton_positive = lipton_score >= 2

        patient_view = build_patient_view(diagnosis_key, language)

        doctor_view = {
            "diagnosis_key": diagnosis_key,
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