import { restaurantsVoiceAgentConfig } from "../_components/industry-configs"
import { IndustryVoiceAgentPage } from "../_components/industry-voice-agent-page"

export default function RestaurantsServicePage() {
  return <IndustryVoiceAgentPage config={restaurantsVoiceAgentConfig} />
}
