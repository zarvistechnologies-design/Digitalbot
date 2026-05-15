"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function HealthcarePage() {
  return <IndustrySolutionPage config={solutionPages.healthcare} />
}
