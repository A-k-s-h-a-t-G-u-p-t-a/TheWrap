import { DraggableCardDemo } from "@/components/dargcards";
import GlowingEffectDemoSecond from "@/components/Glowing-effect";
import { HeroHighlightDemo } from "@/components/hero";
import NavbarDemo from "@/components/navbardemo";
import { TimelineDemo } from "@/components/Timeline";
import { HeroHighlight,Highlight } from "@/components/ui/hero-highlight";
import { WavyBackground } from "@/components/ui/wavy-background";
import { motion } from "motion/react";


export default function Home() {
  return (
    <div>
      <NavbarDemo/>
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <HeroHighlightDemo/>
      </WavyBackground>
      <TimelineDemo></TimelineDemo>
      <div className="my-52">
        <GlowingEffectDemoSecond/>
      </div>
      {/* <DraggableCardDemo/> */}
      <DraggableCardDemo></DraggableCardDemo>
    </div>
  );
}
