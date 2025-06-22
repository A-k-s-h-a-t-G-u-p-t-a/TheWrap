// app/(pages)/canvas/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ExcalidrawWrapper = dynamic(() => import("@/components/Excalidraw"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="animate-pulse text-white">Loading canvas...</div>
    </div>
  ),
});

const CanvasPage = () => {
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Excalidraw Canvas</h1>
      <ExcalidrawWrapper onSummary={setSummaryPoints} />

      {summaryPoints.length > 0 && (
        <div className="mt-6 max-w-2xl bg-zinc-800 p-4 rounded text-white w-full">
          <h2 className="text-xl font-bold mb-2">🧠 Key Points</h2>
          <ul className="list-disc list-inside space-y-1">
            {summaryPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CanvasPage;
