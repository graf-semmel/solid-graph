// DiagramEditor.tsx
import React, { ReactNode, useState } from "react";
import Rect, { RectProps } from "../shapes/Rect";
import { SelectionProvider } from "../contexts/SelectionContext";
import "./Canvas.css";
import Toolbar from "./Toolbar";

const Canvas: React.FC = () => {
  const [rects, setRects] = useState<RectProps[]>([]);

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rectWidth = 200;
    const rectHeight = 100;
    const canvas = event.currentTarget;
    const canvasRect = canvas.getBoundingClientRect();
    const newRect: RectProps = {
      id: `rect${rects.length + 1}`,
      x: event.clientX - canvasRect.left - rectWidth / 2,
      y: event.clientY - canvasRect.top - rectHeight / 2,
      width: rectWidth,
      height: rectHeight,
      title: `Rect ${rects.length + 1}`,
    };
    setRects([...rects, newRect]);
  };

  return (
    <div className="canvas-container">
      <Toolbar />
      <svg className="canvas" onClick={handleCanvasClick}>
        <SelectionProvider>
          {rects.map((rect) => (
            <Rect key={rect.id} {...rect} />
          ))}
        </SelectionProvider>
      </svg>
    </div>
  );
};

export default Canvas;
