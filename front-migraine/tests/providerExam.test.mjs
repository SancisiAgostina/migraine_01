import test from "node:test";
import assert from "node:assert/strict";
import { EXAM_ITEM_IDS, createPhysicalExamState, areAllExamItemsChecked, setAllExamItems } from "../src/components/physicalExamState.js";
import { buildAssessmentPlan, createAssessmentPlanState, getPlanValidation } from "../src/components/assessmentPlanState.js";
import { createInitialRedFlagsState, canShowTreatmentRecommendations, setAllRedFlagsAbsent, setRedFlagItem } from "../src/components/redFlagsState.js";

test("All normal selects each finding without inventing a reflex grade or clearing notes", () => {
  const initial = createPhysicalExamState();
  assert.equal(areAllExamItemsChecked(initial), false);
  const selected = setAllExamItems({ ...initial, notes: "Review finding" }, true);
  assert.equal(EXAM_ITEM_IDS.length, 23);
  assert.equal(areAllExamItemsChecked(selected), true);
  assert.equal(selected.reflexes, "");
  assert.equal(selected.notes, "Review finding");
  const partial = { ...selected, findings: { ...selected.findings, nad: false }, reflexes: "2" };
  assert.equal(areAllExamItemsChecked(partial), false);
  const cleared = setAllExamItems(partial, false);
  assert.equal(Object.values(cleared.findings).some(Boolean), false);
  assert.equal(cleared.reflexes, "2");
});

test("An empty assessment does not invent normal findings, imaging decisions, prescriptions, or AI use", () => {
  const state = createAssessmentPlanState();
  const note = buildAssessmentPlan(state);
  assert.equal(note, "Patient. History not documented.");
  assert.equal(getPlanValidation(state), "");
});

test("History retains explicit negatives and does not populate unanswered symptoms", () => {
  const state = createAssessmentPlanState({ answers: { nausea: false, light_sensitive: true } });
  assert.match(state.history, /nauseated[^\n]*\nAnswer: No/);
  assert.match(state.history, /light[^\n]*\nAnswer: Yes/);
  assert.doesNotMatch(state.history, /last 3 months/);
});

test("Both source-document A+P paths use only the clinician's explicit decisions", () => {
  const state = { ...createAssessmentPlanState(), age: "40", sex: "F", history: "Reported history.", consistency: "consistent", diagnoses: { migraine: true }, neurologicalExam: "normal", imaging: "none", medication: "Example medication", dose: "Example dose", diary: true, followUp: "2", followUpUnit: "months", minutes: "30" };
  assert.equal(getPlanValidation(state), "");
  const note = buildAssessmentPlan(state);
  assert.match(note, /Symptoms consistent with migraine\./);
  assert.match(note, /Neurological examination is normal\./);
  assert.match(note, /Do not recommend imaging\./);
  assert.match(note, /RTC 2 months\./);
  assert.match(note, /I spent 30 minutes/);
  assert.doesNotMatch(note, /Artificial intelligence/);
  const alternate = buildAssessmentPlan({ ...state, consistency: "not-consistent", neurologicalExam: "abnormal", imaging: "obtain", imagingType: "specified imaging", aiUsed: true });
  assert.match(alternate, /Symptoms are not consistent with migraine/);
  assert.match(alternate, /Will obtain specified imaging/);
  assert.doesNotMatch(alternate, /Do not recommend imaging/);
  assert.match(alternate, /Artificial intelligence/);
});

test("Incomplete prescription, imaging, and assessment entries require correction", () => {
  const state = createAssessmentPlanState();
  assert.match(getPlanValidation({ ...state, medication: "Example" }), /both the medication and dose/);
  assert.match(getPlanValidation({ ...state, imaging: "obtain" }), /imaging type/);
  assert.match(getPlanValidation({ ...state, diagnoses: { migraine: true } }), /symptom assessment/);
  assert.match(getPlanValidation({ ...state, followUp: "-1" }), /whole number/);
});

test("Examination selection does not bypass the existing red-flag treatment gate", () => {
  const redFlags = createInitialRedFlagsState();
  setAllExamItems(createPhysicalExamState(), true);
  assert.equal(canShowTreatmentRecommendations(redFlags), false);
  const absent = setAllRedFlagsAbsent(redFlags, true);
  assert.equal(canShowTreatmentRecommendations(absent), true);
  assert.equal(canShowTreatmentRecommendations(setRedFlagItem(absent, 0, true)), false);
});
