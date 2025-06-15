"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Make sure you use shadcn/ui or your own button
import { ExternalLinkIcon } from "lucide-react"; // Optional icon

type AITool = {
  id: string;
  title: string;
  description: string;
  link: string;
};

type Props = {
  tool: AITool;
};

function AIToolCard({ tool }: Props) {
    return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition max-w-md w-full">
        <div className="flex items-center gap-4">
          {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
            <span className="text-black font-bold text-xl">⚙️</span>
          </div> */}
          <div>
            <h3 className="text-white font-semibold text-base">{tool.title}</h3>
            <p className="text-muted-foreground text-sm">
              {tool.description}
            </p>
          </div>
        </div>
        <a href={tool.link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="text-white border-white hover:bg-white/10">
            View
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}

export default AIToolCard;
