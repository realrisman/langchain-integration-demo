import { Footer, TopNavigation } from "@/components/layout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
