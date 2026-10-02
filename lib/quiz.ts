/**
 * Quiz content, step order and qualification logic.
 *
 * Medical assumptions (to be confirmed with Velora's medical lead):
 * - GLP-1 treatment is considered from BMI 30, or from BMI 27 with a
 *   weight-related condition (high blood pressure, type 2 diabetes,
 *   sleep apnoea, high blood lipids).
 * - Pregnancy/breastfeeding, a history of pancreatitis, personal or family
 *   history of medullary thyroid cancer / MEN2, and type 1 diabetes rule out
 *   treatment in this flow. Age must be 18+.
 * - The final decision is always made by a clinician in the consultation.
 */

export type StepId =
  | "welcome"
  | "goal"
  | "motivation"
  | "body"
  | "history"
  | "conditions"
  | "safety"
  | "analyzing"
  | "result"
  | "booking"
  | "details"
  | "confirmation"

export const STEPS: StepId[] = [
  "welcome",
  "goal",
  "motivation",
  "body",
  "history",
  "conditions",
  "safety",
  "analyzing",
  "result",
  "booking",
  "details",
  "confirmation",
]

export const CHAPTERS = ["Dina mål", "Om dig", "Din hälsa"] as const

export const QUESTION_STEPS: { id: StepId; chapter: number }[] = [
  { id: "goal", chapter: 0 },
  { id: "motivation", chapter: 0 },
  { id: "body", chapter: 1 },
  { id: "history", chapter: 1 },
  { id: "conditions", chapter: 2 },
  { id: "safety", chapter: 2 },
]

/** The four phases of the happy path, shown in the desktop side panel. */
export const PHASES = [
  { label: "Sex frågor", detail: "Ungefär två minuter" },
  { label: "Ditt resultat", detail: "Direkt när du har svarat" },
  { label: "Välj en tid", detail: "Kostnadsfritt videosamtal, 15 min" },
  { label: "Bekräftelse", detail: "Allt du behöver på SMS och e-post" },
]

export function phaseOf(step: StepId) {
  if (step === "analyzing" || step === "result") return 1
  if (step === "booking" || step === "details") return 2
  if (step === "confirmation") return 3
  return 0
}

export type Body = { age: number; height: number; weight: number }

export type Answers = {
  goal?: string
  motivation: string[]
  body?: Body
  history: string[]
  conditions: string[]
  safety: string[]
}

export type MultiId = "motivation" | "history" | "conditions" | "safety"
export type Option = { id: string; label: string; hint?: string }

type QuestionBase = { title: string; lead?: string; options: Option[] }
export type SingleQuestion = QuestionBase & { kind: "single"; id: "goal" }
export type MultiQuestion = QuestionBase & {
  kind: "multi"
  id: MultiId
  /** Option that clears every other choice, e.g. "Inget av det här" */
  exclusive?: string
  /** A short reply from the care team once something is selected */
  affirm?: (selected: string[]) => string | null
}
export type ChoiceQuestion = SingleQuestion | MultiQuestion

const goal: SingleQuestion = {
  kind: "single",
  id: "goal",
  title: "Hur mycket skulle du vilja gå ner i vikt?",
  lead: "Det finns inga fel svar. Det hjälper oss att förstå vart du vill.",
  options: [
    { id: "5-10", label: "5–10 kg" },
    { id: "10-20", label: "10–20 kg" },
    { id: "20-40", label: "20–40 kg" },
    { id: "40+", label: "Mer än 40 kg" },
    {
      id: "unsure",
      label: "Jag vet inte än",
      hint: "Det kan ni prata om tillsammans",
    },
  ],
}

const motivation: MultiQuestion = {
  kind: "multi",
  id: "motivation",
  title: "Vad skulle betyda mest för dig?",
  lead: "Välj gärna flera.",
  options: [
    { id: "energy", label: "Orka mer i vardagen" },
    { id: "body", label: "Må bättre i min kropp" },
    { id: "health", label: "Förbättra min hälsa" },
    { id: "confidence", label: "Känna mig tryggare i mig själv" },
    { id: "move", label: "Röra mig lättare" },
    { id: "other", label: "Något annat" },
  ],
  affirm: () =>
    "Vi tar med det här in i ditt samtal, så att planen utgår från det som är viktigt för dig.",
}

const history: MultiQuestion = {
  kind: "multi",
  id: "history",
  title: "Vad har du provat tidigare?",
  lead: "Välj allt som stämmer.",
  exclusive: "none",
  options: [
    { id: "diet", label: "Ändrat kosten eller räknat kalorier" },
    { id: "exercise", label: "Tränat mer" },
    { id: "programs", label: "Appar, program eller grupper" },
    { id: "medication", label: "Läkemedel för viktminskning" },
    { id: "none", label: "Inget av det här än" },
  ],
  affirm: (selected) =>
    selected.includes("none")
      ? "Då börjar vi från början, tillsammans."
      : "Många som kommer till oss har försökt i flera år. Vikten styrs till stor del av biologin, så viljestyrka räcker sällan hela vägen. Där kan medicinsk behandling göra skillnad.",
}

const conditions: MultiQuestion = {
  kind: "multi",
  id: "conditions",
  title: "Har du något av det här?",
  lead: "Det påverkar vilken behandling som passar dig.",
  exclusive: "none",
  options: [
    { id: "bloodpressure", label: "Högt blodtryck" },
    { id: "diabetes2", label: "Typ 2-diabetes eller förhöjt blodsocker" },
    { id: "apnea", label: "Sömnapné" },
    { id: "lipids", label: "Höga blodfetter" },
    { id: "joints", label: "Ont i leder eller rygg" },
    { id: "none", label: "Inget av det här" },
  ],
  affirm: (selected) =>
    selected.includes("none")
      ? "Bra att veta. Läkaren går ändå igenom din hälsa med dig i samtalet."
      : "Tack. Flera av de här brukar bli bättre när vikten går ner, och läkaren tar hänsyn till dem när ni väljer behandling.",
}

const safety: MultiQuestion = {
  kind: "multi",
  id: "safety",
  title: "Gäller något av det här dig?",
  lead: "Vissa läkemedel passar inte vid vissa tillstånd. Vi frågar för din säkerhet.",
  exclusive: "none",
  options: [
    {
      id: "pregnancy",
      label: "Jag är gravid, ammar eller planerar att bli gravid",
    },
    {
      id: "pancreatitis",
      label: "Jag har haft inflammation i bukspottkörteln",
    },
    {
      id: "thyroid",
      label:
        "Jag eller någon nära släkting har haft medullär sköldkörtelcancer eller MEN2",
    },
    { id: "diabetes1", label: "Jag har typ 1-diabetes" },
    { id: "none", label: "Inget av det här" },
  ],
}

export const QUESTIONS = { goal, motivation, history, conditions, safety }

export function assess(answers: Answers) {
  const body = answers.body
  const bmi = body ? body.weight / (body.height / 100) ** 2 : 0
  const hasRelatedCondition = answers.conditions.some((c) =>
    ["bloodpressure", "diabetes2", "apnea", "lipids"].includes(c)
  )
  const contraindicated = answers.safety.some((s) => s !== "none")
  const adult = (body?.age ?? 0) >= 18
  const eligible =
    adult &&
    !contraindicated &&
    (bmi >= 30 || (bmi >= 27 && hasRelatedCondition))
  return { bmi, eligible }
}

const GOAL_PHRASE: Record<string, string> = {
  "5-10": "gå ner 5–10 kg",
  "10-20": "gå ner 10–20 kg",
  "20-40": "gå ner 20–40 kg",
  "40+": "gå ner mer än 40 kg",
}

const MOTIVATION_PHRASE: Record<string, string> = {
  energy: "orka mer i vardagen",
  body: "må bättre i din kropp",
  health: "förbättra din hälsa",
  confidence: "känna dig tryggare i dig själv",
  move: "röra dig lättare",
}

/** "Du vill orka mer i vardagen, må bättre i din kropp och gå ner 10–20 kg." */
export function personalSummary(answers: Answers) {
  const parts = [
    ...answers.motivation
      .map((m) => MOTIVATION_PHRASE[m])
      .filter(Boolean)
      .slice(0, 2),
    answers.goal ? GOAL_PHRASE[answers.goal] : undefined,
  ].filter((p): p is string => Boolean(p))
  if (!parts.length) return null
  const list =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(", ")} och ${parts[parts.length - 1]}`
  return `Du vill ${list}.`
}
