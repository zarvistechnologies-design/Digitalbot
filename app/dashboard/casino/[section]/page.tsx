import { CasinoOperationsView, type CasinoSection } from "../page";
import { notFound } from "next/navigation";

const sectionMap: Record<string, CasinoSection> = {
  reservations: "Reservations",
  "vip-guests": "VIP Guests",
  membership: "Membership",
  messages: "Messages",
  grievances: "Grievances",
};

export function generateStaticParams() {
  return Object.keys(sectionMap).map(section => ({ section }));
}

export default function CasinoSectionPage({ params }: { params: { section: string } }) {
  const section = sectionMap[params.section];
  if (!section) notFound();
  return <CasinoOperationsView initialSection={section} />;
}
