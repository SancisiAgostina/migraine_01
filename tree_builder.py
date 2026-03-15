from tree_nodes import LeafNode, QuestionNode, DecisionNode
from rules import has_valid_aura, has_migraine_without_aura, has_tension_headache


def build_tree():
    leaf_migraine_aura = LeafNode("dx_migraine_aura")
    leaf_migraine_no_aura = LeafNode("dx_migraine_no_aura")
    leaf_tension = LeafNode("dx_tension")
    leaf_inconclusive = LeafNode("dx_inconclusive")

    tension_decision = DecisionNode(
        condition_function=has_tension_headache,
        yes_branch=leaf_tension,
        no_branch=leaf_inconclusive
    )

    migraine_no_aura_decision = DecisionNode(
        condition_function=has_migraine_without_aura,
        yes_branch=leaf_migraine_no_aura,
        no_branch=tension_decision
    )

    aura_valid_decision = DecisionNode(
        condition_function=has_valid_aura,
        yes_branch=leaf_migraine_aura,
        no_branch=migraine_no_aura_decision
    )

    root = QuestionNode(
        question_key="aura_any",
        yes_branch=aura_valid_decision,
        no_branch=migraine_no_aura_decision
    )

    return root