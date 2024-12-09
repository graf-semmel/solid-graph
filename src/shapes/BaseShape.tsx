// BaseShape.tsx
import React, { useEffect, useRef, useState } from "react";
import "./BaseShape.css";

interface BaseShapeProps {
  id: string;
  isSelected: boolean;
  onShapeClick: (id: string, event: React.MouseEvent<SVGGElement>) => void;
  children: React.ReactNode;
}

const BaseShape: React.FC<BaseShapeProps> = ({
  id,
  isSelected,
  onShapeClick,
  children,
}) => {
  const shapeRef = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState<DOMRect | null>(null);
  const handles = bbox
    ? [
        { x: bbox.x - 5, y: bbox.y - 5 },
        { x: bbox.x + bbox.width - 5, y: bbox.y - 5 },
        { x: bbox.x - 5, y: bbox.y + bbox.height - 5 },
        { x: bbox.x + bbox.width - 5, y: bbox.y + bbox.height - 5 },
      ]
    : [];

  useEffect(() => {
    if (shapeRef.current) {
      const boundingBox = shapeRef.current.getBBox();
      setBbox(boundingBox);
    }
  }, [children]);

  const handleClick = (e: React.MouseEvent<SVGGElement>) => {
    console.log(`Clicked ${id}`);
    onShapeClick(id, e);
  };

  return (
    <g>
      <g
        ref={shapeRef}
        onClick={handleClick}
        className={isSelected ? "base-shape active" : "base-shape"}
      >
        {children}
      </g>
      {isSelected && bbox && (
        <g className="resize-handles">
          {handles.map((handle, index) => (
            <rect
              key={index}
              x={handle.x}
              y={handle.y}
              width={10}
              height={10}
              className="resize-handle"
            />
          ))}
        </g>
      )}
    </g>
  );
};

export default BaseShape;
