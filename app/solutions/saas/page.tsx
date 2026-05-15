"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function SaasPage() {
  return <IndustrySolutionPage config={solutionPages.saas} />
}
