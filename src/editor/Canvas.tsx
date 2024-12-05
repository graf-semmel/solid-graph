// DiagramEditor.tsx
import React, { useState, useRef } from "react";
import Rect, { RectProps } from "../shapes/Rect";
import { SelectionProvider } from "../contexts/SelectionContext";
import "./Canvas.css";
import { Toolbar, ToolType, useTool } from "./Toolbar";
import useCanvasDrag from "./useCanvasDrag";

const Canvas: React.FC = () => {
  const [rects, setRects] = useState<RectProps[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);
  const { dragState, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCanvasDrag();
  const { activeTool } = useTool();

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (dragState.isDragging || activeTool === "grab") return;

    const rectWidth = 200;
    const rectHeight = 100;
    const canvas = event.currentTarget;
    const canvasRect = canvas.getBoundingClientRect();
    const newRect: RectProps = {
      id: `rect${rects.length + 1}`,
      x:
        event.clientX -
        canvasRect.left -
        rectWidth / 2 -
        dragState.currentOffset.x,
      y:
        event.clientY -
        canvasRect.top -
        rectHeight / 2 -
        dragState.currentOffset.y,
      width: rectWidth,
      height: rectHeight,
      title: `Rect ${rects.length + 1}`,
    };
    setRects([...rects, newRect]);
  };

  function handleToolChange(tool: ToolType) {}

  function getCursor() {
    if (activeTool === "grab") {
      if (dragState.isDragging) {
        return "grabbing";
      } else {
        return "grab";
      }
    } else {
      return "default";
    }
  }

  return (
    <div className="canvas-container">
      <Toolbar onToolChange={handleToolChange} />
      <svg
        ref={canvasRef}
        className="canvas"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: getCursor() }}
      >
        <g
          id="canvas-content"
          style={{
            transform: `translate(${dragState.currentOffset.x}px, ${dragState.currentOffset.y}px)`,
          }}
        >
          <SelectionProvider>
            {rects.map((rect) => (
              <Rect key={rect.id} {...rect} />
            ))}
          </SelectionProvider>
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
