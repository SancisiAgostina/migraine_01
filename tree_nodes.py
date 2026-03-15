class LeafNode:
    def __init__(self, diagnosis_key):
        self.diagnosis_key = diagnosis_key

    def evaluate(self, answers):
        return self.diagnosis_key


class QuestionNode:
    def __init__(self, question_key, yes_branch, no_branch):
        self.question_key = question_key
        self.yes_branch = yes_branch
        self.no_branch = no_branch

    def evaluate(self, answers):
        if answers.get(self.question_key, False):
            return self.yes_branch.evaluate(answers)
        return self.no_branch.evaluate(answers)


class DecisionNode:
    def __init__(self, condition_function, yes_branch, no_branch):
        self.condition_function = condition_function
        self.yes_branch = yes_branch
        self.no_branch = no_branch

    def evaluate(self, answers):
        if self.condition_function(answers):
            return self.yes_branch.evaluate(answers)
        return self.no_branch.evaluate(answers)