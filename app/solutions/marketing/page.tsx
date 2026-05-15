"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function MarketingPage() {
  return <IndustrySolutionPage config={solutionPages.marketing} />
}
