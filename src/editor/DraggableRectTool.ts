// DraggableRectTool.ts
import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

const NEW_RECT_ID = "rect-new";

export const DraggableRectTool = (
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>,
  currentOffset: { x: number; y: number }
): Tool => {
  let isDragging = false;
  let startX: number = 0;
  let startY: number = 0;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    console.group("DraggableRectTool");
    console.log("onMouseDown");

    isDragging = true;
    startX = event.clientX - currentOffset.x;
    startY = event.clientY - currentOffset.y;

    const newRect: RectProps = {
      id: NEW_RECT_ID,
      title: "New Rect",
      x: startX,
      y: startY,
      width: 0,
      height: 0,
      isSelected: true,
    };

    setRects((prevRects) => [
      ...prevRects.map((p) => ({ ...p, isSelected: false })),
      newRect,
    ]);
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    console.log("onMouseMove");

    if (!isDragging) return;

    const currentX = event.clientX - currentOffset.x;
    const currentY = event.clientY - currentOffset.y;
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    setRects((prevRects) =>
      prevRects.map((rect) => {
        if (rect.id === NEW_RECT_ID) {
          return {
            ...rect,
            width,
            height,
            x: currentX < startX ? currentX : startX,
            y: currentY < startY ? currentY : startY,
          };
        }
        return rect;
      })
    );
  }

  function onMouseUp() {
    console.log("onMouseUp");

    if (!isDragging) return;

    isDragging = false;
    setRects((prevRects) => {
      const newRectIndex = prevRects.findIndex(
        (rect) => rect.id === NEW_RECT_ID
      );

      if (newRectIndex === -1) {
        console.warn("new rect not found");
        console.groupEnd();
        return prevRects;
      }

      const newRect = prevRects[newRectIndex];
      if (newRect.width <= 10 || newRect.height <= 10) {
        console.log("new rect too small, removing");
        console.groupEnd();
        return prevRects.filter((rect) => rect.id !== NEW_RECT_ID);
      }

      newRect.id = `rect-${Date.now()}`;
      console.log("adding new rect", newRect);
      console.groupEnd();
      return prevRects;
    });
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
};
