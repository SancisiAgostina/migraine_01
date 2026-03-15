from text import TEXTS


def normalize_text(text):
    return text.strip().lower()


def choose_language():
    while True:
        lang = normalize_text(input(TEXTS["es"]["choose_language"]))

        if lang in ("es", "en"):
            return lang

        print(TEXTS["es"]["invalid_language"])


def ask_yes_no(question_text, lang):
    while True:
        answer = normalize_text(input(question_text + TEXTS[lang]["yes_no_suffix"]))

        if answer == "":
            print(TEXTS[lang]["invalid_yes_no"])
            continue

        if lang == "es":
            yes_values = ("si", "sí", "s")
            no_values = ("no", "n")
        else:
            yes_values = ("yes", "y")
            no_values = ("no", "n")

        if answer in yes_values:
            return True
        if answer in no_values:
            return False

        print(TEXTS[lang]["invalid_yes_no"])


def count_true(*values):
    total = 0
    for value in values:
        if value:
            total += 1
    return total