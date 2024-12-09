import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export const SelectionTool = (
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
): Tool => {
  let tool: Tool | null = null;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    console.group("SelectionTool");
    console.log("on mouse down");
    const target = event.target as SVGElement;
    if (target.classList.contains("draggable")) {
      tool = DragElementTool(setRects);
    }
    if (target.classList.contains("resizable")) {
      tool = ResizeElementTool(setRects);
    }
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
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
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
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
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
          switch (resizeDirection) {
            case "n":
              return {
                ...rect,
                y: rect.y + deltaY,
                height: rect.height - deltaY,
              };
            case "s":
              return {
                ...rect,
                height: rect.height + deltaY,
              };
            case "e":
              return {
                ...rect,
                width: rect.width + deltaX,
              };
            case "w":
              return {
                ...rect,
                x: rect.x + deltaX,
                width: rect.width - deltaX,
              };
            case "ne":
              return {
                ...rect,
                y: rect.y + deltaY,
                height: rect.height - deltaY,
                width: rect.width + deltaX,
              };
            case "nw":
              return {
                ...rect,
                x: rect.x + deltaX,
                y: rect.y + deltaY,
                width: rect.width - deltaX,
                height: rect.height - deltaY,
              };
            case "se":
              return {
                ...rect,
                height: rect.height + deltaY,
                width: rect.width + deltaX,
              };
            case "sw":
              return {
                ...rect,
                x: rect.x + deltaX,
                width: rect.width - deltaX,
                height: rect.height + deltaY,
              };
          }
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
