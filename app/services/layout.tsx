import type { ReactNode } from "react"

export default function ServicesLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <div className="services-route">{children}</div>
}
