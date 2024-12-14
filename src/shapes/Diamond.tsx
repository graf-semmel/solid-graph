// Diamond.tsx
import React, { useState } from "react";
import { EditableText } from "./EditableText";
import "./Diamond.css";
import { ShapeProps } from "./Shape";

export const Diamond: React.FC<ShapeProps> = ({
  id,
  text: initialText = "",
  isSelected,
  isEditingText,
  x,
  y,
  width,
  height,
}) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(isEditingText);

  const onClick = (event: React.MouseEvent<SVGPathElement>) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const onTextChange = (newText: string) => {
    setText(newText);
    setIsEditing(false);
  };

  const diamondPath = `
    M ${x + width / 2} ${y}
    L ${x + width} ${y + height / 2}
    L ${x + width / 2} ${y + height}
    L ${x} ${y + height / 2}
    Z
  `;

  return (
    <g className="diamond">
      <path
        id={id}
        d={diamondPath}
        className="diamond-shape draggable"
        onClick={onClick}
      />
      <EditableText
        x={x}
        y={y}
        width={width}
        height={height}
        text={text}
        isEditing={isEditing}
        onTextChange={onTextChange}
      />
    </g>
  );
};
