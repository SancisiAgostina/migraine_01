import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from flask import Flask, request, jsonify
from flask_cors import CORS
from tree_builder import build_tree


def load_local_environment():
    env_path = Path(__file__).with_name(".env")
    if not env_path.is_file():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("\"'")

        if key:
            os.environ.setdefault(key, value)


load_local_environment()

app = Flask(__name__)

DEFAULT_FRONTEND_ORIGINS = (
    "http://127.0.0.1:5173",
    "http://localhost:5173",
)
ALLOWED_FRONTEND_ORIGINS = tuple(
    origin.strip()
    for origin in os.environ.get(
        "FRONTEND_ORIGINS",
        ",".join(DEFAULT_FRONTEND_ORIGINS)
    ).split(",")
    if origin.strip()
)

CORS(
    app,
    resources={
        r"/diagnose": {
            "origins": ALLOWED_FRONTEND_ORIGINS,
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        },
        r"/transcribe": {
            "origins": ALLOWED_FRONTEND_ORIGINS,
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "X-Language"]
        }
    }
)

DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen"
MAX_AUDIO_BYTES = 10 * 1024 * 1024


def transcribe_with_deepgram(audio_bytes, content_type):
    api_key = os.environ.get("DEEPGRAM_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPGRAM_API_KEY is not configured")

    query = urlencode({
        "model": "nova-3",
        "language": "en-US",
        "smart_format": "true"
    })
    deepgram_request = Request(
        f"{DEEPGRAM_API_URL}?{query}",
        data=audio_bytes,
        headers={
            "Authorization": f"Token {api_key}",
            "Content-Type": content_type
        },
        method="POST"
    )

    with urlopen(deepgram_request, timeout=45) as response:
        result = json.loads(response.read().decode("utf-8"))

    channels = result.get("results", {}).get("channels", [])
    alternatives = channels[0].get("alternatives", []) if channels else []
    transcript = alternatives[0].get("transcript", "").strip() if alternatives else ""
    confidence = alternatives[0].get("confidence") if alternatives else None

    return {
        "transcript": transcript,
        "confidence": confidence,
        "model": "nova-3",
        "language": "en-US"
    }


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


@app.route("/transcribe", methods=["POST", "OPTIONS"])
def transcribe():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    if not os.environ.get("DEEPGRAM_API_KEY"):
        return jsonify({
            "error": "Audio transcription is not configured"
        }), 503

    content_type = (request.content_type or "").split(";")[0].strip().lower()
    if not content_type.startswith("audio/"):
        return jsonify({
            "error": "Request body must contain audio"
        }), 415

    content_length = request.content_length
    if content_length and content_length > MAX_AUDIO_BYTES:
        return jsonify({
            "error": "Audio file is too large"
        }), 413

    audio_bytes = request.get_data(cache=False)
    if not audio_bytes:
        return jsonify({
            "error": "Audio body is empty"
        }), 400

    if len(audio_bytes) > MAX_AUDIO_BYTES:
        return jsonify({
            "error": "Audio file is too large"
        }), 413

    language = request.headers.get("X-Language", "en")
    if language != "en":
        return jsonify({
            "error": "Audio transcription is available only in English for this demo"
        }), 400

    try:
        return jsonify(
            transcribe_with_deepgram(audio_bytes, content_type)
        ), 200
    except HTTPError as error:
        app.logger.warning(
            "Deepgram transcription failed with status %s",
            error.code
        )
        return jsonify({
            "error": "The audio transcription service rejected the request"
        }), 502
    except (URLError, TimeoutError):
        app.logger.warning("Deepgram transcription service is unavailable")
        return jsonify({
            "error": "The audio transcription service is unavailable"
        }), 503
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        app.logger.warning("Deepgram returned an invalid transcription response")
        return jsonify({
            "error": "The audio transcription response was invalid"
        }), 502


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
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )
