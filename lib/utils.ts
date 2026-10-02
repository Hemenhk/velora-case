export { cn } from "cn"

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "0701234567" / "+46 70 123 45 67" -> "070-123 45 67" */
export function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0046")) digits = "0" + digits.slice(4)
  else if (digits.startsWith("46")) digits = "0" + digits.slice(2)
  if (digits.length !== 10) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
}
