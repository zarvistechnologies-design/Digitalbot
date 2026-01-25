import CustomerSupportLayoutClient from "./components/CustomerSupportLayoutClient";

export default function CustomerSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerSupportLayoutClient>{children}</CustomerSupportLayoutClient>;
}
