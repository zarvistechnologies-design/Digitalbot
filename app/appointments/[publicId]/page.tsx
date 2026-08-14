import type { Metadata } from "next";
import AppointmentList from "./appointment-list";

export const metadata: Metadata = {
  title: "Upcoming Appointments | DigitalBot.AI",
  description: "A secure, shared view of a doctor's upcoming appointments.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function PublicAppointmentsPage({ params }: { params: { publicId: string } }) {
  return <AppointmentList publicId={params.publicId} />;
}
