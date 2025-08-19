import Cards from "@/components/card";
import ServiceCards from "@/components/service-cards";
import { Navbar1 } from "@/components/navbar1";
import Image from "next/image";
import { ParticlesDemo } from "@/components/Particles";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";

export default function Home() {
  return (

    <>
      <ParticlesDemo />
      <Navbar1 />
      <ServiceCards />
      <Cards />
      <div className="block">
      <StackedCircularFooter />
    </div>
    </>

  );
}
