"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function InsurancePage() {
  return <IndustrySolutionPage config={solutionPages.insurance} />
}
