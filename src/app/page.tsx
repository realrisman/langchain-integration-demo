import {
  HeroSection,
  FeaturesSection,
  TechStackSection,
  Footer,
} from "@/components/home";

/**
 * Home page component
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <Footer />
    </main>
  );
}
