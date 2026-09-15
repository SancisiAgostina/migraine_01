export const EXAM_GROUPS = [
  { title: "General", items: [["nad", "In NAD"]] },
  { title: "HEENT", items: [["op", "OP clear"], ["neck", "Neck supple"]] },
  { title: "Lungs", items: [["lungs", "CTA B"]] },
  { title: "CV", items: [["rrr", "RRR"], ["s1s2", "Nl S1S2"], ["mrg", "Neg M/R/G"]] },
  { title: "Abd", items: [["abd", "Soft, NT, ND, nl BS"]] },
  { title: "Ext", items: [["ext", "Neg C/C/E"]] },
  { title: "MS", neuro: true, items: [["ms", "intact"]] },
  { title: "CN", neuro: true, items: [["cn", "2-12 nl"], ["fundi", "Fundi sharp"], ["vfftc", "VFFTC"]] },
  { title: "Motor", neuro: true, items: [["bulk", "Nl bulk, tone"], ["strength", "5/5 B"], ["drift", "Neg drift"]] },
  { title: "Sensory", neuro: true, items: [["sensory", "Nl LT, temp, VS"]] },
  { title: "Refl", neuro: true, items: [["toes", "Toes down B"]], reflexes: true },
  { title: "Gait/Coord", neuro: true, items: [["gait", "Narrow, neg Romberg"], ["tht", "Can T/H/T"], ["ffm", "Nl FFM"], ["fn", "Nl FN"], ["ram", "Nl RAM"]] },
];

export const EXAM_ITEM_IDS = EXAM_GROUPS.flatMap(({ items }) => items.map(([id]) => id));

export function createPhysicalExamState() {
  return { findings: {}, reflexes: "", notes: "" };
}

export function areAllExamItemsChecked(state) {
  return EXAM_ITEM_IDS.every((id) => state.findings[id] === true);
}

export function setAllExamItems(state, checked) {
  return { ...state, findings: Object.fromEntries(EXAM_ITEM_IDS.map((id) => [id, checked])) };
}
