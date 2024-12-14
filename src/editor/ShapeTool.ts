import { ShapeProps, ShapeType } from "../shapes/Shape";
import { Tool } from "./Canvas";

const NEW_SHAPE_ID = "__new_shape__";

export const ShapeTool = (
  setShapes: React.Dispatch<React.SetStateAction<ShapeProps[]>>,
  currentOffset: { x: number; y: number },
  shapeType: ShapeType
): Tool => {
  let isDragging = false;
  let startX: number = 0;
  let startY: number = 0;

  function onMouseDown(event: React.MouseEvent<SVGSVGElement>) {
    console.group("ShapeTool");
    console.log("onMouseDown");

    isDragging = true;
    startX = event.clientX - currentOffset.x;
    startY = event.clientY - currentOffset.y;

    const newShape: ShapeProps = {
      id: NEW_SHAPE_ID,
      type: shapeType,
      text: "New shape",
      x: startX,
      y: startY,
      width: 0,
      height: 0,
      isSelected: true,
      isEditingText: false,
    };

    setShapes((existingShapes) => [
      ...existingShapes.map((p) => ({
        ...p,
        isSelected: false,
        isEditingText: false,
      })),
      newShape,
    ]);
  }

  function onMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    console.log("onMouseMove");

    if (!isDragging) return;

    const currentX = event.clientX - currentOffset.x;
    const currentY = event.clientY - currentOffset.y;
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    setShapes((existingShapes) =>
      existingShapes.map((shape) => {
        if (shape.id === NEW_SHAPE_ID) {
          return {
            ...shape,
            width,
            height,
            x: currentX < startX ? currentX : startX,
            y: currentY < startY ? currentY : startY,
          };
        }
        return shape;
      })
    );
  }

  function onMouseUp() {
    console.log("onMouseUp");

    if (!isDragging) return;

    isDragging = false;
    setShapes((existingShapes) => {
      const newShapeIndex = existingShapes.findIndex(
        (shape) => shape.id === NEW_SHAPE_ID
      );

      if (newShapeIndex === -1) {
        console.warn("new shape not found");
        console.groupEnd();
        return existingShapes;
      }

      const newShape = existingShapes[newShapeIndex];
      if (newShape.width <= 10 || newShape.height <= 10) {
        console.log("new shape too small, removing");
        console.groupEnd();
        return existingShapes.filter((shape) => shape.id !== NEW_SHAPE_ID);
      }

      newShape.id = `shape-${Date.now()}`;
      newShape.isEditingText = true;
      console.log("adding new shape", newShape);
      console.groupEnd();
      return [...existingShapes];
    });
  }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onShapeClick: () => {},
  };
};
