import HeroSection from "@/components/home/hero-section";
import DemoSection from "@/components/home/demo-section";
import BgGradient from "@/components/common/bg-gradient";
export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
      </div>
      {/* <HowItWorksSection /> */}
      {/* <PricingSection /> */}
      {/* <CTASection /> */}
    </div>
  );
}
