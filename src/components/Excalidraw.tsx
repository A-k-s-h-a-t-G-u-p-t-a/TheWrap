import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@excalidraw/excalidraw/index.css";

// Type for Excalidraw elements
type ExcalidrawElement = {
  id: string;
  type: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: unknown;
};

// Type for the Excalidraw API
type ExcalidrawAPI = {
  getSceneElements: () => readonly ExcalidrawElement[];
  // Add other methods as needed
};

// Use dynamic import for the Excalidraw component
const ExcalidrawComponent = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="w-full h-[70vh] flex items-center justify-center">Loading Excalidraw...</div>,
  }
);

export default function ExcalidrawCanvas({
  onSummary,
}: {
  onSummary: (summary: string[]) => void;
}) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after component mounts
    setIsLoaded(true);
  }, []);

  const handleWrapIt = async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    
    const textOnly = elements
      .filter((el: ExcalidrawElement) => el.type === "text")
      .map((el: ExcalidrawElement) => el.text || "")
      .join("\n");

    if (!textOnly) return;

    try {
      // Send text to summarizer API
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textOnly }),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const { summary } = await res.json();
      const points = summary.split("\n").filter((line: string) => line.trim() !== "");
      onSummary(points);
    } catch (error) {
      console.error("Error summarizing content:", error);
      onSummary(["Error generating summary. Please try again."]);
    }
  };

  return (
    <div className="w-full h-[100vh] border border-zinc-700 rounded-md overflow-hidden">
      {isLoaded && (
        <ExcalidrawComponent
          theme="dark"
          gridModeEnabled={true}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          renderTopRightUI={() => (
            <button
              className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded"
              onClick={handleWrapIt}
            >
              Wrap It
            </button>
          )}
        />
      )}
    </div>
  );
}