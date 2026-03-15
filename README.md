# migraine_01
# Backend - Headache Screening System

## Description

This project implements the **backend** of a headache screening system developed in **Python**.  
Its purpose is to classify, based on user responses, whether the case is compatible with:

- **Migraine with aura**
- **Migraine without aura**
- **Tension-type headache**
- **Inconclusive**

The system is designed with a **modular structure** and a **decision-tree-based logic**, making it clearer, easier to maintain, and more scalable.

---

## Backend objective

The backend is responsible for:

- asking questions to the user
- validating the input
- storing answers in memory
- evaluating diagnostic logic
- traversing the decision tree
- returning a final result

This system is intended for **educational purposes** and **does not replace professional medical care**.

---

## Technologies used

- **Python 3**
- Modular programming
- Decision trees
- Console input validation

---

## Project structure

```text
proyecto_migrana/
│
├── main.py
├── texts.py
├── utils.py
├── rules.py
├── tree_nodes.py
├── tree_builder.py
└── questionnaire.py

File description
main.py
This is the main entry point of the program.
 It coordinates the overall execution of the system:
language selection


question flow


tree evaluation


final result display


texts.py
Contains all system texts in both languages:
Spanish


English


It includes:
questions


error messages


results


warnings


summary labels


utils.py
Contains general helper functions, such as:
language selection


text normalization


yes/no input validation


counting True boolean values


rules.py
Contains the simplified diagnostic logic.
 This is where the system evaluates conditions compatible with:
migraine with aura


migraine without aura


tension-type headache


tree_nodes.py
Defines the classes that represent the decision tree nodes:
LeafNode


QuestionNode


DecisionNode


tree_builder.py
Builds the complete decision tree of the system, defining:
the root


the branches


the diagnostic leaves


questionnaire.py
Responsible for:
asking the user questions


storing answers


validating basic contradictions


displaying the answer summary



System logic
The backend uses a decision tree.
Tree root
The main root is the presence of symptoms compatible with aura before the headache.
Base question:
Did you have visual changes, tingling, or trouble speaking before the headache?


Main branches
If the answer is yes
The system evaluates aura-related criteria:
gradual onset


duration between 5 and 60 minutes


headache beginning within 1 hour afterward


If enough criteria are met:
Migraine with aura


If not:
the system continues evaluating migraine without aura


If the answer is no
The system evaluates criteria for:
Migraine without aura


then tension-type headache


Tree leaves
The possible final outputs are:
Compatible with migraine with aura


Compatible with migraine without aura


Compatible with tension-type headache


Inconclusive

System logic
The backend uses a decision tree.
Tree root
The main root is the presence of symptoms compatible with aura before the headache.
Base question:
Did you have visual changes, tingling, or trouble speaking before the headache?


Main branches
If the answer is yes
The system evaluates aura-related criteria:
gradual onset


duration between 5 and 60 minutes


headache beginning within 1 hour afterward


If enough criteria are met:
Migraine with aura


If not:
the system continues evaluating migraine without aura


If the answer is no
The system evaluates criteria for:
Migraine without aura


then tension-type headache


Tree leaves
The possible final outputs are:
Compatible with migraine with aura


Compatible with migraine without aura


Compatible with tension-type headache


Inconclusive



Implemented validations
The system includes validations to improve the robustness of user input.
Language validation
Accepted values:
es


en


Uppercase and lowercase are both accepted.
Yes/No answer validation
In Spanish, the system accepts:
si


sí


s


no


n


In English, it accepts:
yes


y


no


n


It also:
ignores leading and trailing spaces


asks again if the input is invalid


supports uppercase and lowercase input


Basic contradiction validation
The system detects some inconsistent answers, for example:
marking the pain as both one-sided and both-sided


marking the pain as both mild/moderate and moderate/strong


These contradictions do not stop execution, but they are shown as warnings.

Simplified criteria used
Migraine with aura
The system considers this compatible if:
aura-like symptoms occurred before the headache


and at least 2 temporal aura criteria are met


Migraine without aura
The system considers this compatible if:
headache duration is compatible


at least 2 typical migraine pain characteristics are present


associated symptoms are compatible


Tension-type headache
The system considers this compatible if:
duration is compatible


at least 2 typical tension-type characteristics are present


there is no nausea


light sensitivity and sound sensitivity do not appear together
Limitations
The system does not provide a real medical diagnosis


The implemented criteria are simplified


It does not cover all possible clinical variants


It does not replace professional evaluation
Possible future improvements
file-based result storage


patient history


explanation of the path followed in the tree


answer export


more clinical validations


support for more languages
