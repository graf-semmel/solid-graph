import React, { useState } from "react";
import { EditableText } from "./EditableText";
import "./Circle.css";
import { ShapeProps } from "./Shape";

const Ellipse: React.FC<ShapeProps> = ({
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

  const onClick = (event: React.MouseEvent<SVGEllipseElement>) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const onTextChange = (newText: string) => {
    setText(newText);
    setIsEditing(false);
  };

  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;

  return (
    <g className="ellipse">
      <ellipse
        id={id}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className="ellipse-shape draggable"
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

export default Ellipse;
