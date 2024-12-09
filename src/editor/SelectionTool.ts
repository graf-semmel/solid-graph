import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export const SelectionTool = (
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
): Tool => {
  let isDragging = false;
  let startX: number = 0;
  let startY: number = 0;
  let selectedElementId: string | null = null;

  function handleMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    // check if target has draggable attribute
    const target = event.target as SVGElement;
    console.debug("SelectionTool", "on mouse down", target);

    if (!target.hasAttribute("draggable")) return;
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

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
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

  function handleMouseUp() {
    console.debug("SelectionTool", "on mouse up");
    isDragging = false;
    selectedElementId = null;
  }

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onShapeClick: () => {},
  };
};
