"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function FinancialServicesPage() {
  return <IndustrySolutionPage config={solutionPages["financial-services"]} />
}
