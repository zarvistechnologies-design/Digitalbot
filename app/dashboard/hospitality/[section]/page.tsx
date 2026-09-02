import HospitalityWorkspace, {
  type HospitalitySection,
} from "../_components/HospitalityWorkspace";

export default function HospitalitySectionPage({
  params,
}: {
  params: { section: HospitalitySection };
}) {
  return <HospitalityWorkspace section={params.section} />;
}
