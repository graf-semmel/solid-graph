// DiagramEditor.tsx
import React, { useState, useRef, useEffect } from "react";
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

const initialRects: RectProps[] = [
  {
    id: "1",
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    isSelected: false,
  },
  {
    id: "2",
    x: -150,
    y: -150,
    width: 100,
    height: 100,
    isSelected: false,
  },
  {
    id: "3",
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    isSelected: false,
  },
];

const Canvas: React.FC = () => {
  const [rects, setRects] = useState<RectProps[]>(initialRects);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDragging: false,
    initialMousePosition: { x: 0, y: 0 },
    currentOffset: { x: 0, y: 0 },
  });
  const canvasRef = useRef<SVGSVGElement>(null);
  const toolTypeRef = useRef<ToolType>("rect");
  const [tool, setTool] = useState<Tool>(
    DraggableRectTool(setRects, canvasState.currentOffset)
  );

  useEffect(() => {
    // center the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      const offsetX = width / 2;
      const offsetY = height / 2;
      // update initial rects
      setRects(
        rects.map((rect) => ({
          ...rect,
          x: rect.x + offsetX,
          y: rect.y + offsetY,
        }))
      );
    }
  }, []);

  function handleToolChange(tool: ToolType) {
    console.log("select tool", tool);
    if (tool === toolTypeRef.current) {
      return;
    }

    if (tool !== "select") {
      setRects((prevRects) =>
        prevRects.map((rect) => ({ ...rect, isSelected: false }))
      );
    }

    toolTypeRef.current = tool;
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
      <Toolbar
        initialToolType={toolTypeRef.current}
        onToolChange={handleToolChange}
      />
      <svg
        ref={canvasRef}
        className={`canvas ${toolTypeRef.current}`}
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
