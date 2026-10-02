import { create } from "zustand"
import {
  STEPS,
  type Answers,
  type Body,
  type MultiId,
  type StepId,
} from "./quiz"
import type { ContactValues } from "./schemas"

const emptyAnswers: Answers = {
  motivation: [],
  history: [],
  conditions: [],
  safety: [],
}

type FlowState = {
  index: number
  /** 1 = forward, -1 = back. Drives the slide direction between steps. */
  direction: 1 | -1
  answers: Answers
  slot: string | null
  contact: ContactValues | null

  next: () => void
  back: () => void
  goTo: (step: StepId) => void
  restart: () => void
  setGoal: (goal: string) => void
  toggle: (id: MultiId, value: string, exclusive?: string) => void
  setBody: (body: Body) => void
  setSlot: (slot: string | null) => void
  setContact: (contact: ContactValues) => void
}

export const useFlow = create<FlowState>()((set) => ({
  index: 0,
  direction: 1,
  answers: emptyAnswers,
  slot: null,
  contact: null,

  next: () =>
    set((s) => ({
      index: Math.min(s.index + 1, STEPS.length - 1),
      direction: 1,
    })),
  back: () =>
    set((s) => {
      let i = s.index - 1
      if (STEPS[i] === "analyzing") i -= 1 // never land on the loading screen when going back
      return { index: Math.max(i, 0), direction: -1 }
    }),
  goTo: (step) =>
    set((s) => {
      const i = STEPS.indexOf(step)
      return { index: i, direction: i >= s.index ? 1 : -1 }
    }),
  restart: () =>
    set({
      index: 0,
      direction: -1,
      answers: emptyAnswers,
      slot: null,
      contact: null,
    }),

  setGoal: (goal) => set((s) => ({ answers: { ...s.answers, goal } })),
  toggle: (id, value, exclusive) =>
    set((s) => {
      const current = s.answers[id]
      let next: string[]
      if (current.includes(value)) next = current.filter((v) => v !== value)
      else if (value === exclusive) next = [value]
      else next = [...current.filter((v) => v !== exclusive), value]
      return { answers: { ...s.answers, [id]: next } }
    }),
  setBody: (body) => set((s) => ({ answers: { ...s.answers, body } })),
  setSlot: (slot) => set({ slot }),
  setContact: (contact) => set({ contact }),
}))

export const useStep = () => useFlow((s) => STEPS[s.index])
