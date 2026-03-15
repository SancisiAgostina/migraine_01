from utils import count_true


def has_valid_aura(answers):
    aura_criteria = count_true(
        answers.get("aura_gradual", False),
        answers.get("aura_duration", False),
        answers.get("aura_followed_headache", False)
    )
    return answers.get("aura_any", False) and aura_criteria >= 2


def has_migraine_without_aura(answers):
    pain_features = count_true(
        answers.get("unilateral", False),
        answers.get("pulsating", False),
        answers.get("moderate_severe", False),
        answers.get("worse_activity", False)
    )

    associated_symptoms = (
        answers.get("nausea", False) or
        (answers.get("light_sensitive", False) and answers.get("sound_sensitive", False))
    )

    return (
        answers.get("migraine_duration", False) and
        pain_features >= 2 and
        associated_symptoms
    )


def has_tension_headache(answers):
    tension_features = count_true(
        answers.get("bilateral", False),
        answers.get("pressure", False),
        answers.get("mild_moderate", False),
        not answers.get("worse_activity", False)
    )

    max_one_light_sound = not (
        answers.get("light_sensitive", False) and
        answers.get("sound_sensitive", False)
    )

    return (
        answers.get("tension_duration", False) and
        tension_features >= 2 and
        not answers.get("nausea", False) and
        max_one_light_sound
    )