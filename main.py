from text import TEXTS
from utils import choose_language
from tree_builder import build_tree
from questionnaire import collect_answers, print_summary, validate_answers, print_warnings


def main():
    lang = choose_language()

    print(TEXTS[lang]["title"])
    print(TEXTS[lang]["disclaimer"])

    tree_root = build_tree()
    answers = collect_answers(lang)

    warnings = validate_answers(answers)
    diagnosis_key = tree_root.evaluate(answers)

    print_summary(lang, answers)
    print_warnings(lang, warnings)
    print(TEXTS[lang]["final_result"] + TEXTS[lang][diagnosis_key])


if __name__ == "__main__":
    main()