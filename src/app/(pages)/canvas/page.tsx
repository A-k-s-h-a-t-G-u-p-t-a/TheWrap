// app/(pages)/canvas/page.tsx
"use client";

import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(() => import("@/components/Excalidraw"), {
  ssr: false,
  loading: () => <p>Loading canvas...</p>,
});

const CanvasPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900">
      <ExcalidrawWrapper />
    </div>
  );
};

export default CanvasPage;
