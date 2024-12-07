// Rectangle.tsx
import React, { useState } from "react";
import "./Rect.css";
import EditableText from "./EditableText";

export interface RectProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  isSelected: boolean;
}

const Rect: React.FC<RectProps> = ({ id, x, y, width, height, title }) => {
  const [text, setText] = useState(title);
  const [rectHeight, setRectHeight] = useState(height);

  const handleResize = (newHeight: number) => {
    setRectHeight(newHeight);
    console.log(`Resized to ${newHeight}`);
  };

  return (
    <g className="rect">
      <rect x={x} y={y} width={width} height={height} className="rect-shape" />
      {/* <EditableText
          x={0}
          y={0}
          width={width}
          height={rectHeight}
          text={text}
          onChange={setText}
          onResize={handleResize}
        /> */}
    </g>
  );
};

export default Rect;
