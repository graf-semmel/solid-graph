import { RectProps } from "../shapes/Rect";
import { Tool } from "./Canvas";

export function SelectionTool(
  setRects: React.Dispatch<React.SetStateAction<RectProps[]>>
): Tool {
  return {
    onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => {
      console.log("on mouse down");
      return;
    },
    onMouseMove: (event: React.MouseEvent<SVGSVGElement>) => {
      return;
    },
    onMouseUp: () => {
      return;
    },
    onShapeClick: (id: string, event: React.MouseEvent<SVGElement>) => {
      console.log("selecting shape", id);
      setRects((prevRects) =>
        prevRects.map((rect) => ({
          ...rect,
          isSelected: rect.id === id,
        }))
      );
    },
  };
}
