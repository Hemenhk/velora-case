import type { Metadata, Viewport } from "next"
import "@fontsource-variable/fraunces/full.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Velora – Se om medicinsk viktminskning passar dig",
  description:
    "Svara på sex frågor och boka ett kostnadsfritt videosamtal med legitimerad vårdpersonal.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2e3eb",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
