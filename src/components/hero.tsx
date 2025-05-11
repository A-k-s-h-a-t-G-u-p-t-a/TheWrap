"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight className="mt-40">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Know Every Secret AI Tool —{" "}
        Everything You Need in {" "}
        <Highlight className="text-black dark:text-white">
         One Place.
        </Highlight>
      </motion.h1>
      <div className="mt-10 flex justify-center gap-4">
        <button className="px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:scale-105 transition">
          Explore Tools
        </button>
        <button className="px-6 py-3 rounded-2xl border border-black dark:border-white text-black dark:text-white font-semibold hover:scale-105 transition">
          Join The Wrap
        </button>
      </div>
    </HeroHighlight>
  );
}
