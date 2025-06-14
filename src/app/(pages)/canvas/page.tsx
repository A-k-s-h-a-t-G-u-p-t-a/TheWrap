"use client";
import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper: React.FC = () => {
  console.info(convertToExcalidrawElements([{
    type: "rectangle",
    id: "rect-1",
    width: 186.47265625,
    height: 141.9765625,
    x: 0,
    y: 0,
  },]));
  return (
    <div className="w-full h-full">
      <Excalidraw />
    </div>
  );
};
export default ExcalidrawWrapper;