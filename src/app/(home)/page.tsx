import {
  HeroSection,
  FeaturesSection,
  TechStackSection,
  ImplementationSteps,
} from "@/components/home";

/**
 * Home page component
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between w-full">
      {/* Hero Section with Gradient Background */}
      <section className="w-full bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section className="w-full">
        <FeaturesSection />
      </section>

      {/* Tech Stack Section */}
      <section className="w-full">
        <TechStackSection />
      </section>

      {/* Implementation Steps */}
      <section className="w-full">
        <ImplementationSteps />
      </section>
    </div>
  );
}
