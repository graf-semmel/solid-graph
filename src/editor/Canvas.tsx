// DiagramEditor.tsx
import React, { useState, useRef } from "react";
import Rect, { RectProps } from "../shapes/Rect";
import "./Canvas.css";
import { Toolbar, ToolType } from "./Toolbar";
import { DragCanvasTool, CanvasState } from "./DragCanvasTool";
import { DraggableRectTool } from "./DraggableRectTool";
import BaseShape from "../shapes/BaseShape";
import { SelectionTool } from "./SelectionTool";

// Define the interface for the drag state
export interface Tool {
  onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseUp: () => void;
  onShapeClick: (id: string, event: React.MouseEvent<SVGElement>) => void;
}

const Canvas: React.FC = () => {
  const [rects, setRects] = useState<RectProps[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDragging: false,
    initialMousePosition: { x: 0, y: 0 },
    currentOffset: { x: 0, y: 0 },
  });
  const canvasRef = useRef<SVGSVGElement>(null);

  const [tool, setTool] = useState<Tool>(
    DraggableRectTool(setRects, canvasState.currentOffset)
  );

  function handleToolChange(tool: ToolType) {
    console.log("tool", tool);
    switch (tool) {
      case "grab":
        setTool(DragCanvasTool(setCanvasState));
        break;
      case "select":
        setTool(SelectionTool(setRects));
        break;
      case "rect":
        setTool(DraggableRectTool(setRects, canvasState.currentOffset));
        break;
    }
  }

  return (
    <div className="canvas-container">
      <Toolbar initialToolType={"rect"} onToolChange={handleToolChange} />
      <svg
        ref={canvasRef}
        className="canvas"
        onPointerDown={tool.onMouseDown}
        onPointerMove={tool.onMouseMove}
        onPointerUp={tool.onMouseUp}

        // onMouseDown={tool.onMouseDown}
        // onMouseMove={tool.onMouseMove}
        // onMouseUp={tool.onMouseUp}
      >
        <g
          id="canvas-content"
          style={{
            transform: `translate(${canvasState.currentOffset.x}px, ${canvasState.currentOffset.y}px)`,
          }}
        >
          {rects.map((rect) => (
            <BaseShape key={rect.id} {...rect} onShapeClick={tool.onShapeClick}>
              <Rect key={rect.id} {...rect} />
            </BaseShape>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
