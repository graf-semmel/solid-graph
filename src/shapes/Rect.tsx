// Rectangle.tsx
import React, { useState } from "react";
import "./Rect.css";
import BaseShape from "./BaseShape";
import EditableText from "./EditableText";

export interface RectProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

const Rect: React.FC<RectProps> = ({ id, x, y, width, height, title }) => {
  const [text, setText] = useState(title);
  const [rectHeight, setRectHeight] = useState(height);

  const handleResize = (newHeight: number) => {
    setRectHeight(newHeight);
    console.log(`Resized to ${newHeight}`);
  };

  return (
    <BaseShape {...{ x, y, id }}>
      <g className="rect">
        <rect width={width} height={rectHeight} className="rect-shape" />
        <EditableText
          x={0}
          y={0}
          width={width}
          height={rectHeight}
          text={text}
          onChange={setText}
          onResize={handleResize}
        />
      </g>
    </BaseShape>
  );
};

export default Rect;
