import { useRef, useEffect } from "react";

export interface EditableTextProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isEditing: boolean;
  onTextChange: (text: string) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  width,
  height,
  text,
  isEditing,
  onTextChange,
}) => {
  const editableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editableDivRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editableDivRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isEditing]);

  function onTextChanged(event: React.FocusEvent<HTMLDivElement>) {
    onTextChange(event.target.textContent || "");
  }

  return isEditing ? (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      pointerEvents="none"
    >
      <div
        ref={editableDivRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={onTextChanged}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          wordWrap: "break-word",
        }}
      >
        {text}
      </div>
    </foreignObject>
  ) : (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      alignmentBaseline="middle"
      focusable="false"
      pointerEvents="none"
    >
      {text}
    </text>
  );
};
