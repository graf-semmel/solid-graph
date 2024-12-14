export type ShapeType = "rect" | "ellipse" | "diamond";

export interface ShapeProps {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  text?: string;
  isEditingText: boolean;
  onTextChange?: (text: string) => void;
}
