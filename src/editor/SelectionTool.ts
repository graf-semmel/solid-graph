import { ShapeProps } from "../shapes/Shape";
import { Tool } from "./Canvas";

export const SelectionTool = (
  setShapes: React.Dispatch<React.SetStateAction<ShapeProps[]>>
): Tool => {
  let tool: Tool | null = null;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    const target = event.target as SVGElement;
    if (target.classList.contains("draggable")) {
      console.group("DragElementTool");
      tool = DragElementTool(setShapes);
    }
    if (target.classList.contains("resizable")) {
      console.group("ResizeElementTool");
      tool = ResizeElementTool(setShapes);
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
  setShapes: React.Dispatch<React.SetStateAction<ShapeProps[]>>
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
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        shape.isSelected = false;
        if (shape.id === selectedElementId) {
          return { ...shape, isSelected: true };
        }
        return shape;
      })
    );
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    console.debug("SelectionTool", "on mouse move");
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        shape.isSelected = false;
        if (shape.id === selectedElementId) {
          return {
            ...shape,
            x: shape.x + deltaX,
            y: shape.y + deltaY,
            isSelected: true,
          };
        }
        return shape;
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

type ResizeDishapeion = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function ResizeElementTool(
  setShapes: React.Dispatch<React.SetStateAction<ShapeProps[]>>
): Tool {
  let isResizing = false;
  let startX: number = 0;
  let startY: number = 0;
  let targetId: string | null = null;
  let resizeDishapeion:
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
    resizeDishapeion = target.getAttribute("origin") as ResizeDishapeion;
    console.log("resize dishapeion", resizeDishapeion);

    isResizing = true;
    startX = event.clientX;
    startY = event.clientY;
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        shape.isSelected = false;
        if (shape.id === targetId) {
          return { ...shape, isSelected: true };
        }
        return shape;
      })
    );
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    if (!isResizing) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape.id === targetId) {
          let newShape = { ...shape };
          switch (resizeDishapeion) {
            case "n":
              newShape = {
                ...shape,
                y:
                  shape.height - deltaY >= minSize ? shape.y + deltaY : shape.y,
                height: Math.max(shape.height - deltaY, minSize),
              };
              break;
            case "s":
              newShape = {
                ...shape,
                height: Math.max(shape.height + deltaY, minSize),
              };
              break;
            case "e":
              newShape = {
                ...shape,
                width: Math.max(shape.width + deltaX, minSize),
              };
              break;
            case "w":
              newShape = {
                ...shape,
                x: shape.width - deltaX >= minSize ? shape.x + deltaX : shape.x,
                width: Math.max(shape.width - deltaX, minSize),
              };
              break;
            case "ne":
              newShape = {
                ...shape,
                y:
                  shape.height - deltaY >= minSize ? shape.y + deltaY : shape.y,
                height: Math.max(shape.height - deltaY, minSize),
                width: Math.max(shape.width + deltaX, minSize),
              };
              break;
            case "nw":
              newShape = {
                ...shape,
                x: shape.width - deltaX >= minSize ? shape.x + deltaX : shape.x,
                y:
                  shape.height - deltaY >= minSize ? shape.y + deltaY : shape.y,
                width: Math.max(shape.width - deltaX, minSize),
                height: Math.max(shape.height - deltaY, minSize),
              };
              break;
            case "se":
              newShape = {
                ...shape,
                height: Math.max(shape.height + deltaY, minSize),
                width: Math.max(shape.width + deltaX, minSize),
              };
              break;
            case "sw":
              newShape = {
                ...shape,
                x: shape.width - deltaX >= minSize ? shape.x + deltaX : shape.x,
                width: Math.max(shape.width - deltaX, minSize),
                height: Math.max(shape.height + deltaY, minSize),
              };
              break;
          }
          return newShape;
        }
        return shape;
      })
    );

    // Update startX and startY after applying the movement
    startX = event.clientX;
    startY = event.clientY;
  }

  function onMouseUp() {
    isResizing = false;
    targetId = null;
    resizeDishapeion = null;
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
}
