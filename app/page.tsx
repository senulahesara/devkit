import Cards from "@/components/card";
import ServiceCards from "@/components/service-cards";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/Particles";
import { StackedCircularFooter } from "@/components/stacked-circular-footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServiceCards />
      <Cards />
      <div className="block">
        <StackedCircularFooter />
      </div>
    </>
  );
}
