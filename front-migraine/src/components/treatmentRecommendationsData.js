export const INITIAL_THERAPIES = [
  { id: "ibuprofen", label: "Ibuprofen" },
  { id: "acetaminophen", label: "Acetaminophen" },
  { id: "naproxen", label: "Naproxen" },
  { id: "excedrin_migraine", label: "Excedrin Migraine" },
];

export const TRIPTANS = [
  {
    id: "sumatriptan",
    label:
      "Sumatriptan (Imitrex): Available in oral, nasal spray, and subcutaneous injection forms. Start at 50 mg.",
  },
  {
    id: "rizatriptan",
    label:
      "Rizatriptan (Maxalt): Available in both standard oral tablets and orally disintegrating tablets, which dissolve on the tongue without water. Start at 5 mg.",
  },
  { id: "eletriptan", label: "Eletriptan (Relpax): Start at 40 mg." },
  {
    id: "zolmitriptan",
    label:
      "Zolmitriptan (Zomig): Available as a tablet, orally disintegrating tablet, or nasal spray. Start at 2.5 mg.",
  },
  { id: "almotriptan", label: "Almotriptan (Axert): Start at 6.25 mg." },
  { id: "naratriptan", label: "Naratriptan (Amerge): Start at 2.5 mg." },
  { id: "frovatriptan", label: "Frovatriptan (Frova): Start at 2.5 mg." },
];

export const THIRD_LINE_THERAPIES = [
  {
    id: "rimegepant",
    label: "Rimegepant (Nurtec ODT): Orally disintegrating tablet. Start at 75 mg.",
  },
  { id: "ubrogepant", label: "Ubrogepant (Ubrelvy): Start at 50 mg." },
  { id: "atogepant", label: "Atogepant (Qulipta): Start at 30 mg." },
];

export const PROPHYLACTIC_MEDICATIONS = [
  {
    id: "topamax",
    label:
      "Topamax: Start at 25 mg at night and increase by 25 mg weekly until target dose of 50–100 mg twice a day is reached.",
  },
  {
    id: "depakote_er",
    label:
      "Depakote ER: Start at 500 mg at night and then increase after 1 week to 1000 mg daily. This can be divided as 500 mg twice daily.",
  },
  {
    id: "amitriptyline_propranolol",
    label:
      "Amitriptyline 10 or 25 mg nightly with or without propranolol 40 mg nightly.",
  },
];

export function shouldShowNeurologyNextStep(selectedTreatments) {
  return Boolean(selectedTreatments.topamax && selectedTreatments.depakote_er);
}
