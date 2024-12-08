import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export function SelectionTool(
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
): Tool {
  let isDragging: boolean = false;
  let startX: number = 0;
  let startY: number = 0;
  let selectedElementId: string | null = null;

  return {
    onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => {
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
    },
    onMouseMove: (event: React.MouseEvent<SVGSVGElement>) => {
      console.debug("SelectionTool", "on mouse move");
      if (!isDragging) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      setRects((prevRects) =>
        prevRects.map((rect) => {
          if (rect.id === selectedElementId) {
            rect.shapeProps.x += deltaX;
            rect.shapeProps.y += deltaY;
            return rect;
          }
          return rect;
        })
      );

      // Update startX and startY after applying the movement
      startX = event.clientX;
      startY = event.clientY;
    },
    onMouseUp: () => {
      console.debug("SelectionTool", "on mouse up");
      isDragging = false;
      selectedElementId = null;
    },
    onShapeClick: (id: string, event: React.MouseEvent<SVGElement>) => {
      console.debug("SelectionTool", "on shape click", id);
    },
  };
}
