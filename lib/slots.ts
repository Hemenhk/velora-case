/** Mocked availability. Deterministic per date, so a refresh shows the same times. */

export type Day = { key: string; date: Date; slots: string[] }

const pad = (n: number) => String(n).padStart(2, "0")
export const toDayKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildDays(now = new Date(), count = 14): Day[] {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const weekday = date.getDay()
    // Sunday closed, Saturday short day, weekdays 08–20
    const [start, end, density] =
      weekday === 0
        ? [0, 0, 0]
        : weekday === 6
          ? [9 * 60, 14 * 60, 0.35]
          : [8 * 60, 20 * 60, 0.42]
    const rand = seeded(
      date.getFullYear() * 1000 + date.getMonth() * 40 + date.getDate()
    )
    const slots: string[] = []
    for (let m = start; m < end; m += 20) {
      if (rand() > density) continue
      if (i === 0 && m <= nowMinutes + 30) continue
      slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`)
    }
    return { key: toDayKey(date), date, slots }
  })
}

export function groupSlots(slots: string[]) {
  const groups = [
    { label: "Förmiddag", slots: slots.filter((s) => s < "12:00") },
    {
      label: "Eftermiddag",
      slots: slots.filter((s) => s >= "12:00" && s < "17:00"),
    },
    { label: "Kväll", slots: slots.filter((s) => s >= "17:00") },
  ]
  return groups.filter((g) => g.slots.length)
}

/** "2026-10-06T13:20" -> Date */
export function parseSlot(slot: string) {
  const [day, time] = slot.split("T")
  const [y, mo, d] = day.split("-").map(Number)
  const [h, mi] = time.split(":").map(Number)
  return new Date(y, mo - 1, d, h, mi)
}

export function endTime(slot: string, minutes = 15) {
  const end = new Date(parseSlot(slot).getTime() + minutes * 60_000)
  return `${pad(end.getHours())}:${pad(end.getMinutes())}`
}

const longDate = new Intl.DateTimeFormat("sv-SE", {
  weekday: "long",
  day: "numeric",
  month: "long",
})
const shortWeekday = new Intl.DateTimeFormat("sv-SE", { weekday: "short" })

export const formatLongDate = (d: Date) => longDate.format(d)
export const formatWeekday = (d: Date) =>
  shortWeekday.format(d).replace(".", "")

export function relativeDay(d: Date, now = new Date()) {
  const diff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86_400_000
  )
  if (diff === 0) return "idag"
  if (diff === 1) return "imorgon"
  return formatLongDate(d)
}

export function firstAvailable(days: Day[]) {
  const day = days.find((d) => d.slots.length)
  return day ? `${day.key}T${day.slots[0]}` : null
}
