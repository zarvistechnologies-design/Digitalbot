"use client"

import { solutionPages } from "../industry-solution-data"
import { IndustrySolutionPage } from "../industry-solution-page"

export default function RecruitmentPage() {
  return <IndustrySolutionPage config={solutionPages.recruitment} />
}
