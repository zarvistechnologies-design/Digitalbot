import { healthcareVoiceAgentConfig } from "../_components/industry-configs"
import { IndustryVoiceAgentPage } from "../_components/industry-voice-agent-page"

export default function HealthcareServicePage() {
  return <IndustryVoiceAgentPage config={healthcareVoiceAgentConfig} />
}
