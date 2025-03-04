import React, { useState } from "react";
import { EditableText } from "./EditableText";
import "./Rect.css";
import { ShapeProps } from "./Shape";

export const Rect: React.FC<ShapeProps> = ({
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

  const onClick = (event: React.MouseEvent<SVGRectElement>) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const onTextChange = (newText: string) => {
    setText(newText);
    setIsEditing(false);
  };

  return (
    <g className="rect">
      <rect
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        className="rect-shape draggable"
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
