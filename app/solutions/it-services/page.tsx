"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function ItServicesPage() {
  return <IndustrySolutionPage config={solutionPages["it-services"]} />
}
