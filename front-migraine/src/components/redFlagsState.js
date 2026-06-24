export const RED_FLAG_ITEMS = [
  "Abnormal neurological examination is present, such as papilledema or altered mental status.",
  "Signs of systemic illness are present, such as fever, stiff neck, or rash.",
  "Patient reports the worst headache ever.",
  "Headaches are progressing in frequency and severity.",
  "New headache in a patient older than 50 years.",
  "Sudden onset headache / thunderclap headache.",
  "New-onset headache in an immunocompromised patient or patient with cancer.",
  "Headache occurred after head trauma.",
  "Headache worsens with Valsalva.",
  "Headache is accompanied by “whooshing” sounds.",
];

export function createInitialRedFlagsState() {
  return {
    allAbsent: false,
    selectedItems: RED_FLAG_ITEMS.map(() => false),
  };
}

export function setAllRedFlagsAbsent(state, checked) {
  return {
    allAbsent: checked,
    selectedItems: checked
      ? state.selectedItems.map(() => false)
      : state.selectedItems,
  };
}

export function setRedFlagItem(state, index, checked) {
  return {
    allAbsent: false,
    selectedItems: state.selectedItems.map((isSelected, itemIndex) =>
      itemIndex === index ? checked : isSelected
    ),
  };
}

export function hasSelectedRedFlags(state) {
  return state.selectedItems.some(Boolean);
}

export function canShowTreatmentRecommendations(state) {
  return state.allAbsent && !hasSelectedRedFlags(state);
}
