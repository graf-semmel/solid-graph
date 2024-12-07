// DraggableRectTool.ts
import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export const DraggableRectTool = (
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>,
  currentOffset: { x: number; y: number }
): Tool => {
  let isDragging = false;
  let startX: number = 0;
  let startY: number = 0;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    isDragging = true;
    startX = event.clientX - currentOffset.x;
    startY = event.clientY - currentOffset.y;

    const newRect = {
      id: `rect${Date.now()}`,
      title: `Rect ${Date.now()}`,
      shapeProps: {
        x: startX,
        y: startY,
        width: 0,
        height: 0,
      },
      isSelected: false,
    };

    setRects((prevRects) => [...prevRects, newRect]);
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    if (!isDragging) return;

    const currentX = event.clientX - currentOffset.x;
    const currentY = event.clientY - currentOffset.y;
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    setRects((prevRects) => {
      return prevRects.map((rect, index) => {
        if (index !== prevRects.length - 1) return rect;

        rect.shapeProps = {
          ...rect.shapeProps,
          width,
          height,
          x: currentX < startX ? currentX : rect.shapeProps.x,
          y: currentY < startY ? currentY : rect.shapeProps.y,
        };

        return rect;
      });
    });
  }

  function onMouseUp() {
    if (!isDragging) return;

    isDragging = false;
    // check if the rect is too small
    setRects((prevRects) => {
      const lastRect = prevRects[prevRects.length - 1];
      if (lastRect.shapeProps.width < 10 || lastRect.shapeProps.height < 10) {
        return prevRects.slice(0, prevRects.length - 1);
      }
      console.log("New rect added successfully");

      return prevRects;
    });
  }

  function onShapeClick(id: string, event: React.MouseEvent<SVGElement>) {
    return;
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick,
  };
};
