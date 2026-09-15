import { useState } from "react";
import { buildAssessmentPlan, DIAGNOSES, getPlanValidation } from "./assessmentPlanState";
import "./providerExam.css";

export default function AssessmentPlan({ state, onChange }) {
  const [copyStatus, setCopyStatus] = useState("");
  const generated = buildAssessmentPlan(state);
  const validation = getPlanValidation(state);
  const draftStale = state.draftSource !== generated;

  function update(key, value) {
    setCopyStatus("");
    onChange((current) => ({ ...current, [key]: value }));
  }

  function field(key, label, options = {}) {
    return (
      <label className="exam-field">
        {label}
        <input type="text" {...options} value={state[key]} onChange={(event) => update(key, event.target.value)} />
      </label>
    );
  }

  function select(key, label, options) {
    return (
      <label className="exam-field">
        {label}
        <select value={state[key]} onChange={(event) => update(key, event.target.value)}>
          <option value="">Not documented</option>
          {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
      </label>
    );
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(state.draft);
      setCopyStatus("Note copied.");
    } catch {
      setCopyStatus("Could not copy automatically. Select and copy the note below.");
    }
  }

  return (
    <section className="provider-exam" aria-labelledby="assessment-plan-title">
      <p className="exam-eyebrow">Healthcare Provider Documentation</p>
      <h2 id="assessment-plan-title">Assessment &amp; Plan</h2>
      <p className="exam-help">Complete the assessment and plan, then generate a note to review and edit. Clinical decisions are entered by the healthcare provider.</p>
      <div className="exam-grid">
        {field("age", "Age (years)", { type: "number", min: 0, step: 1 })}
        {select("sex", "Sex", [["M", "M"], ["F", "F"]])}
      </div>
      <label className="exam-field">
        History summary
        <textarea rows={14} placeholder="Review the patient's screening, headache characteristics, aura symptoms and notes…" value={state.history} onChange={(event) => update("history", event.target.value)} />
      </label>
      <p className="exam-help">Patient answers are grouped by screening, headache characteristics, aura symptoms and notes. Review and edit each section before generating the note.</p>
      {select("consistency", "Symptoms", [["consistent", "Consistent with"], ["not-consistent", "Not consistent with"]])}
      <fieldset className="exam-group" style={{ marginTop: 16 }}>
        <legend>Diagnosis considered</legend>
        {DIAGNOSES.map((diagnosis) => (
          <label className="exam-check" key={diagnosis}>
            <input type="checkbox" checked={Boolean(state.diagnoses[diagnosis])} onChange={(event) => update("diagnoses", { ...state.diagnoses, [diagnosis]: event.target.checked })} />
            <span>{diagnosis[0].toUpperCase() + diagnosis.slice(1)}</span>
          </label>
        ))}
      </fieldset>
      <div className="exam-grid">
        {select("neurologicalExam", "Neurological examination", [["normal", "Normal"], ["abnormal", "Abnormal"]])}
        {select("imaging", "Imaging plan", [["none", "Do not recommend imaging"], ["obtain", "Will obtain imaging"]])}
      </div>
      {state.imaging === "obtain" && field("imagingType", "Imaging type")}
      <div className="exam-grid">
        {field("medication", "Medication name")}
        {field("dose", "Dose / instructions")}
      </div>
      <label className="exam-check" style={{ marginTop: 16 }}>
        <input type="checkbox" checked={state.diary} onChange={(event) => update("diary", event.target.checked)} />
        <span>Patient instructed to keep headache diary.</span>
      </label>
      <label className="exam-check">
        <input type="checkbox" checked={state.aiUsed} onChange={(event) => update("aiUsed", event.target.checked)} />
        <span>Artificial intelligence clinical decision support tool utilized but final clinical decisions made by me.</span>
      </label>
      <p className="exam-help">Confirm only if an AI clinical decision support tool was used during this encounter. This form generates a template from your entries.</p>
      <div className="exam-grid">
        {field("followUp", "RTC / follow-up interval", { type: "number", min: 1, step: 1 })}
        <label className="exam-field">Follow-up unit
          <select value={state.followUpUnit} onChange={(event) => update("followUpUnit", event.target.value)}>
            <option value="weeks">weeks</option><option value="months">months</option>
          </select>
        </label>
      </div>
      {field("minutes", "Encounter time (minutes)", { type: "number", min: 0, step: 1 })}
      <label className="exam-field">Additional assessment / plan notes
        <textarea rows={3} value={state.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      {validation && <p className="exam-help" role="status" style={{ marginTop: 14 }}>{validation}</p>}
      <button className="exam-button" type="button" disabled={Boolean(validation)} onClick={() => {
        onChange((current) => ({ ...current, draft: generated, draftSource: generated }));
        setCopyStatus("");
      }}>{state.draft ? "Regenerate note from fields" : "Generate A+P note"}</button>
      {state.draft && (
        <>
          <label className="exam-field">A+P note — review and edit
            <textarea rows={10} value={state.draft} onChange={(event) => update("draft", event.target.value)} />
          </label>
          <p className="exam-help">Regenerating replaces edits in this note. The note is kept during this review and is not submitted to a patient record.</p>
          {draftStale && <p className="exam-help" role="status">The fields have changed. Regenerate the note to include those changes before copying.</p>}
          <button className="exam-button exam-button-secondary" type="button" disabled={draftStale || Boolean(validation)} onClick={copyDraft}>Copy A+P note</button>
        </>
      )}
      {copyStatus && <p className="exam-help" role="status">{copyStatus}</p>}
    </section>
  );
}
