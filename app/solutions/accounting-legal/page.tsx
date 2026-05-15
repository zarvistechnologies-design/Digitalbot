"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function AccountingPage() {
  return <IndustrySolutionPage config={solutionPages["accounting-legal"]} />
}
