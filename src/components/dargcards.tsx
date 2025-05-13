import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo() {
  const items = [
    {
      title: "How can I do this task better?",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "Why does their work look more polished than mine?",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Is there even an AI tool for this?",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "I waste so much time testing different AI tools.",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Which tool gives the best results for my use case?",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "I don't know which tool to trust.",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "I don't know which tool to use.",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 text-center">
        <p className="mx-auto max-w-md text-3xl font-black text-white md:text-5xl dark:text-neutral-700">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">TheWrap</span>
          <span className="mx-2 text-neutral-400 dark:text-neutral-600">–</span>
          <span className="text-neutral-400 dark:text-neutral-600">your AI compass.</span>
        </p>
      </div>
      {items.map((item, index) => (
        <DraggableCardBody key={index} className={item.className}>
          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}