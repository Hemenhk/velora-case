import { z } from "zod"

/** Accepts "180", "180,5" and "180.5"; an empty field becomes NaN so zod reports it. */
export const toNumber = (value: unknown) =>
  value === "" || value == null
    ? Number.NaN
    : Number(String(value).replace(",", "."))

export const bodySchema = z.object({
  age: z
    .number({ error: "Fyll i din ålder" })
    .int("Ange åldern i hela år")
    .min(18, "Behandlingen är för dig som är 18 år eller äldre")
    .max(100, "Kontrollera åldern"),
  height: z
    .number({ error: "Fyll i din längd" })
    .min(120, "Ange längden i centimeter")
    .max(230, "Kontrollera längden"),
  weight: z
    .number({ error: "Fyll i din vikt" })
    .min(40, "Ange vikten i kilo")
    .max(350, "Kontrollera vikten"),
})
export type BodyValues = z.infer<typeof bodySchema>

const SWEDISH_MOBILE = /^(\+46|0046|0)7\d{8}$/

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Skriv ditt förnamn"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => SWEDISH_MOBILE.test(v.replace(/[\s-]/g, "")),
      "Ange ett svenskt mobilnummer, till exempel 070 123 45 67"
    ),
  email: z.email("Kontrollera e-postadressen, till exempel namn@exempel.se"),
})
export type ContactValues = z.infer<typeof contactSchema>
