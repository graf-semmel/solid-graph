import { Tool } from "./Canvas";

export interface CanvasState {
  isDragging: boolean;
  initialMousePosition: { x: number; y: number };
  currentOffset: { x: number; y: number };
}

export function DragCanvasTool(
  setDragState: React.Dispatch<React.SetStateAction<CanvasState>>
): Tool {
  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    setDragState((prevState) => ({
      ...prevState,
      isDragging: true,
      initialMousePosition: { x: event.clientX, y: event.clientY },
    }));
  }

  // Handle mouse move event to update the canvas offset
  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    if (!setDragState) return;

    setDragState((prevState) => {
      if (!prevState.isDragging) return prevState;

      const deltaX = event.clientX - prevState.initialMousePosition.x;
      const deltaY = event.clientY - prevState.initialMousePosition.y;

      return {
        ...prevState,
        currentOffset: {
          x: prevState.currentOffset.x + deltaX,
          y: prevState.currentOffset.y + deltaY,
        },
        initialMousePosition: { x: event.clientX, y: event.clientY },
      };
    });
  }

  // Handle mouse up event to stop dragging
  function onMouseUp() {
    return setDragState((prevState) => ({
      ...prevState,
      isDragging: false,
    }));
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
}
