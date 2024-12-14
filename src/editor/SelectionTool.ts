import { ShapeProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export const SelectionTool = (
  setRects: React.Dispatch<React.SetStateAction<ShapeProps[]>>
): Tool => {
  let tool: Tool | null = null;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    const target = event.target as SVGElement;
    if (target.classList.contains("draggable")) {
      console.group("DragElementTool");
      tool = DragElementTool(setRects);
    }
    if (target.classList.contains("resizable")) {
      console.group("ResizeElementTool");
      tool = ResizeElementTool(setRects);
    }
    console.log("on mouse down", target);
    tool?.onMouseDown(event);
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    console.log("on mouse move");
    tool?.onMouseMove(event);
  }

  function onMouseUp() {
    console.log("on mouse up");
    tool?.onMouseUp();
    tool = null;
    console.groupEnd();
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
};

function DragElementTool(
  setRects: React.Dispatch<React.SetStateAction<ShapeProps[]>>
): Tool {
  let isDragging = false;
  let startX: number = 0;
  let startY: number = 0;
  let selectedElementId: string | null = null;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    const target = event.target as SVGElement;
    if (!target.classList.contains("draggable")) {
      console.error("Element must have draggable class");
      return;
    }
    if (!target.id) {
      console.error("Draggable element must have an id");
      return;
    }

    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    selectedElementId = target.id;
    setRects((prevRects) =>
      prevRects.map((rect) => {
        rect.isSelected = false;
        if (rect.id === selectedElementId) {
          return { ...rect, isSelected: true };
        }
        return rect;
      })
    );
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    console.debug("SelectionTool", "on mouse move");
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    setRects((prevRects) =>
      prevRects.map((rect) => {
        rect.isSelected = false;
        if (rect.id === selectedElementId) {
          return {
            ...rect,
            x: rect.x + deltaX,
            y: rect.y + deltaY,
            isSelected: true,
          };
        }
        return rect;
      })
    );

    // Update startX and startY after applying the movement
    startX = event.clientX;
    startY = event.clientY;
  }

  function onMouseUp() {
    console.debug("SelectionTool", "on mouse up");
    isDragging = false;
    selectedElementId = null;
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function ResizeElementTool(
  setRects: React.Dispatch<React.SetStateAction<ShapeProps[]>>
): Tool {
  let isResizing = false;
  let startX: number = 0;
  let startY: number = 0;
  let targetId: string | null = null;
  let resizeDirection:
    | "n"
    | "s"
    | "e"
    | "w"
    | "ne"
    | "nw"
    | "se"
    | "sw"
    | null = null;
  const minSize = 20;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    const target = event.target as SVGElement;
    if (!target.classList.contains("resizable")) {
      console.error("Element must have resizable class");
      return;
    }
    if (!target.hasAttribute("target")) {
      console.error("Resizable element must have a target attribute");
      return;
    }
    targetId = target.getAttribute("target");
    console.log("target id", targetId);
    if (!target.hasAttribute("origin")) {
      console.error("Resizable element must have an origin attribute");
      return;
    }
    resizeDirection = target.getAttribute("origin") as ResizeDirection;
    console.log("resize direction", resizeDirection);

    isResizing = true;
    startX = event.clientX;
    startY = event.clientY;
    setRects((prevRects) =>
      prevRects.map((rect) => {
        rect.isSelected = false;
        if (rect.id === targetId) {
          return { ...rect, isSelected: true };
        }
        return rect;
      })
    );
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    if (!isResizing) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    setRects((prevRects) =>
      prevRects.map((rect) => {
        if (rect.id === targetId) {
          let newRect = { ...rect };
          switch (resizeDirection) {
            case "n":
              newRect = {
                ...rect,
                y: rect.height - deltaY >= minSize ? rect.y + deltaY : rect.y,
                height: Math.max(rect.height - deltaY, minSize),
              };
              break;
            case "s":
              newRect = {
                ...rect,
                height: Math.max(rect.height + deltaY, minSize),
              };
              break;
            case "e":
              newRect = {
                ...rect,
                width: Math.max(rect.width + deltaX, minSize),
              };
              break;
            case "w":
              newRect = {
                ...rect,
                x: rect.width - deltaX >= minSize ? rect.x + deltaX : rect.x,
                width: Math.max(rect.width - deltaX, minSize),
              };
              break;
            case "ne":
              newRect = {
                ...rect,
                y: rect.height - deltaY >= minSize ? rect.y + deltaY : rect.y,
                height: Math.max(rect.height - deltaY, minSize),
                width: Math.max(rect.width + deltaX, minSize),
              };
              break;
            case "nw":
              newRect = {
                ...rect,
                x: rect.width - deltaX >= minSize ? rect.x + deltaX : rect.x,
                y: rect.height - deltaY >= minSize ? rect.y + deltaY : rect.y,
                width: Math.max(rect.width - deltaX, minSize),
                height: Math.max(rect.height - deltaY, minSize),
              };
              break;
            case "se":
              newRect = {
                ...rect,
                height: Math.max(rect.height + deltaY, minSize),
                width: Math.max(rect.width + deltaX, minSize),
              };
              break;
            case "sw":
              newRect = {
                ...rect,
                x: rect.width - deltaX >= minSize ? rect.x + deltaX : rect.x,
                width: Math.max(rect.width - deltaX, minSize),
                height: Math.max(rect.height + deltaY, minSize),
              };
              break;
          }
          return newRect;
        }
        return rect;
      })
    );

    // Update startX and startY after applying the movement
    startX = event.clientX;
    startY = event.clientY;
  }

  function onMouseUp() {
    isResizing = false;
    targetId = null;
    resizeDirection = null;
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
}
