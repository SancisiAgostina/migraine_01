from flask import Flask, request, jsonify
from flask_cors import CORS
from tree_builder import build_tree


app = Flask(__name__)
CORS(app)


@app.route("/diagnose", methods=["POST"])
def diagnose():
    answers = request.get_json()

    if not isinstance(answers, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    tree_root = build_tree()
    diagnosis_key = tree_root.evaluate(answers)

    return jsonify({
        "diagnosis_key": diagnosis_key
    })


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Migraine screening API is running"
    })


if __name__ == "__main__":
    app.run(debug=True)