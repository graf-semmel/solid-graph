// EditableText.tsx
import React, { useEffect, useRef } from "react";
import "./EditableText.css";

interface EditableTextProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onChange?: (newText: string) => void;
  onResize?: (newHeight: number) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  width,
  height,
  text,
  onChange,
  onResize,
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // select all text when the component is mounted
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      console.log(entries);
      for (let entry of entries) {
        if (onResize && entry.contentRect.height > height) {
          onResize(entry.contentRect.height);
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [height, onResize]);

  const handleBlur = () => {
    if (textRef.current) {
      onChange && onChange(textRef.current.textContent || "");
    }
  };

  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        ref={textRef}
        className="editable-text"
        contentEditable
        onBlur={handleBlur}
      >
        {text}
      </div>
    </foreignObject>
  );
};

export default EditableText;
