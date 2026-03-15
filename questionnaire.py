from text import TEXTS
from utils import ask_yes_no


def ask_question(question_key, lang, answers):
    if question_key not in answers:
        answers[question_key] = ask_yes_no(TEXTS[lang][question_key], lang)
    return answers[question_key]


def collect_answers(lang):
    answers = {}

    ask_question("aura_any", lang, answers)

    if answers["aura_any"]:
        ask_question("aura_gradual", lang, answers)
        ask_question("aura_duration", lang, answers)
        ask_question("aura_followed_headache", lang, answers)

    ask_question("migraine_duration", lang, answers)
    ask_question("unilateral", lang, answers)
    ask_question("pulsating", lang, answers)
    ask_question("moderate_severe", lang, answers)
    ask_question("worse_activity", lang, answers)
    ask_question("nausea", lang, answers)
    ask_question("light_sensitive", lang, answers)
    ask_question("sound_sensitive", lang, answers)

    ask_question("tension_duration", lang, answers)
    ask_question("bilateral", lang, answers)
    ask_question("pressure", lang, answers)
    ask_question("mild_moderate", lang, answers)

    return answers


def validate_answers(answers):
    warnings = []

    if answers.get("unilateral", False) and answers.get("bilateral", False):
        warnings.append("contradiction_side")

    if answers.get("moderate_severe", False) and answers.get("mild_moderate", False):
        warnings.append("contradiction_intensity")

    return warnings


def print_summary(lang, answers):
    print(TEXTS[lang]["answers_title"])

    ordered_labels = [
        ("aura_any", "label_aura_any"),
        ("aura_gradual", "label_aura_gradual"),
        ("aura_duration", "label_aura_duration"),
        ("aura_followed_headache", "label_aura_followed_headache"),
        ("migraine_duration", "label_migraine_duration"),
        ("unilateral", "label_unilateral"),
        ("pulsating", "label_pulsating"),
        ("moderate_severe", "label_moderate_severe"),
        ("worse_activity", "label_worse_activity"),
        ("nausea", "label_nausea"),
        ("light_sensitive", "label_light_sensitive"),
        ("sound_sensitive", "label_sound_sensitive"),
        ("tension_duration", "label_tension_duration"),
        ("bilateral", "label_bilateral"),
        ("pressure", "label_pressure"),
        ("mild_moderate", "label_mild_moderate"),
    ]

    for key, label_key in ordered_labels:
        if key in answers:
            value_text = TEXTS[lang]["yes"] if answers[key] else TEXTS[lang]["no"]
            print(f"- {TEXTS[lang][label_key]}: {value_text}")


def print_warnings(lang, warnings):
    if not warnings:
        return

    print("\n" + TEXTS[lang]["warnings_title"])

    for warning in warnings:
        print("- " + TEXTS[lang][warning])