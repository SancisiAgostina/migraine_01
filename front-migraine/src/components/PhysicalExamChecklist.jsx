import { COLORS } from "../styles/colors";
import { EXAM_GROUPS, EXAM_ITEM_IDS, areAllExamItemsChecked, setAllExamItems } from "./physicalExamState";
import "./providerExam.css";

export default function PhysicalExamChecklist({ state, onChange }) {
  const allChecked = areAllExamItemsChecked(state);
  const checkedCount = EXAM_ITEM_IDS.filter((id) => state.findings[id]).length;

  function renderGroup(group) {
    return (
      <fieldset className="exam-group" key={group.title}>
        <legend>{group.title}:</legend>
        {group.reflexes && (
          <label className="exam-reflexes">
            <span>Reflexes</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              aria-label="Bilateral reflex grade"
              placeholder="—"
              value={state.reflexes}
              onChange={(event) => onChange((current) => ({ ...current, reflexes: event.target.value }))}
            />
            <span>+ B</span>
          </label>
        )}
        {group.items.map(([id, label]) => (
          <label className="exam-check" key={id}>
            <input
              type="checkbox"
              checked={Boolean(state.findings[id])}
              onChange={(event) => {
                const checked = event.target.checked;
                onChange((current) => ({ ...current, findings: { ...current.findings, [id]: checked } }));
              }}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <section className="provider-exam" aria-labelledby="physical-exam-title">
      <p className="exam-eyebrow">Healthcare Provider Examination</p>
      <h2 id="physical-exam-title">Physical Examination</h2>
      <p className="exam-help">Check the findings you have confirmed. Unchecked items are not documented as normal or abnormal.</p>

      <label className="exam-check exam-all" style={{ background: allChecked ? COLORS.greenBg : COLORS.tealLight }}>
        <input
          type="checkbox"
          checked={allChecked}
          ref={(element) => {
            if (element) element.indeterminate = checkedCount > 0 && !allChecked;
          }}
          onChange={(event) => {
            const checked = event.target.checked;
            onChange((current) => setAllExamItems(current, checked));
          }}
        />
        <span>All normal</span>
      </label>
      <p className="exam-help">Selects all checkboxes. Enter the reflex grade separately.</p>
      <p className="exam-count" role="status">{checkedCount} of {EXAM_ITEM_IDS.length} findings checked</p>

      <div className="exam-grid">{EXAM_GROUPS.filter((group) => !group.neuro).map(renderGroup)}</div>
      <h3 className="exam-neuro">Neuro:</h3>
      <div className="exam-grid">{EXAM_GROUPS.filter((group) => group.neuro).map(renderGroup)}</div>

      <label className="exam-field">
        Examination notes / abnormal findings
        <textarea
          rows={3}
          value={state.notes}
          placeholder="Document any additional findings…"
          onChange={(event) => onChange((current) => ({ ...current, notes: event.target.value }))}
        />
      </label>
    </section>
  );
}
