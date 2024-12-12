// BaseShape.tsx
import React, { useEffect, useRef, useState } from "react";
import "./BaseShape.css";

interface BaseShapeProps {
  id: string;
  isSelected: boolean;
  onShapeClick: (id: string, event: React.MouseEvent<SVGGElement>) => void;
  children: React.ReactNode;
}

const CornerHandles: React.FC<{
  bbox: DOMRect;
  handleSize: number;
  id: string;
  offset: number;
}> = ({ bbox, handleSize, id, offset }) => {
  const cornerHandles = [
    {
      x: bbox.x - handleSize / 2 - offset,
      y: bbox.y - handleSize / 2 - offset,
      label: "nw",
    },
    {
      x: bbox.x + bbox.width - handleSize / 2 + offset,
      y: bbox.y - handleSize / 2 - offset,
      label: "ne",
    },
    {
      x: bbox.x - handleSize / 2 - offset,
      y: bbox.y + bbox.height - handleSize / 2 + offset,
      label: "sw",
    },
    {
      x: bbox.x + bbox.width - handleSize / 2 + offset,
      y: bbox.y + bbox.height - handleSize / 2 + offset,
      label: "se",
    },
  ];

  return (
    <>
      {cornerHandles.map((handle, index) => (
        <rect
          key={index}
          x={handle.x}
          y={handle.y}
          width={handleSize}
          height={handleSize}
          className="resizable corner"
          origin={`${handle.label}`}
          target={id}
        />
      ))}
    </>
  );
};

const EdgeHandles: React.FC<{
  bbox: DOMRect;
  handleSize: number;
  edgeHandleThickness: number;
  id: string;
  offset: number;
}> = ({ bbox, handleSize, edgeHandleThickness, id, offset }) => {
  const edgeHandles = [
    {
      x: bbox.x + handleSize / 2,
      y: bbox.y - edgeHandleThickness / 2 - offset,
      width: bbox.width - handleSize,
      height: edgeHandleThickness,
      label: "n",
    },
    {
      x: bbox.x + handleSize / 2,
      y: bbox.y + bbox.height - edgeHandleThickness / 2 + offset,
      width: bbox.width - handleSize,
      height: edgeHandleThickness,
      label: "s",
    },
    {
      x: bbox.x - edgeHandleThickness / 2 - offset,
      y: bbox.y + handleSize / 2,
      width: edgeHandleThickness,
      height: bbox.height - handleSize,
      label: "w",
    },
    {
      x: bbox.x + bbox.width - edgeHandleThickness / 2 + offset,
      y: bbox.y + handleSize / 2,
      width: edgeHandleThickness,
      height: bbox.height - handleSize,
      label: "e",
    },
  ];

  return (
    <>
      {edgeHandles.map((handle, index) => (
        <g key={index}>
          <rect
            className="resizable edge"
            target={id}
            origin={`${handle.label}`}
            x={handle.x - 5}
            y={handle.y - 5}
            width={handle.width + 10}
            height={handle.height + 10}
            fill="transparent"
          />
          <rect
            className="edge-forground"
            x={handle.x}
            y={handle.y}
            width={handle.width}
            height={handle.height}
            pointerEvents="none"
          />
        </g>
      ))}
    </>
  );
};

const BaseShape: React.FC<BaseShapeProps> = ({
  id,
  isSelected,
  onShapeClick,
  children,
}) => {
  const shapeRef = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState<DOMRect | null>(null);
  const handleSize = 10;
  const cornerHandleOffset = 10;
  const edgeHandleThickness = 2;
  const edgeHandleOffset = 10;

  useEffect(() => {
    if (shapeRef.current) {
      const boundingBox = shapeRef.current.getBBox();
      setBbox(boundingBox);
    }
  }, [children]);

  // const handleClick = (e: React.MouseEvent<SVGGElement>) => {
  // console.log(`Clicked ${id}`);
  // onShapeClick(id, e);
  // };

  return (
    <g>
      <g
        ref={shapeRef}
        // onClick={handleClick}
        className={isSelected ? "base-shape active" : "base-shape"}
      >
        {children}
      </g>
      {isSelected && bbox && (
        <g className="resize-handles">
          <CornerHandles
            bbox={bbox}
            handleSize={handleSize}
            id={id}
            offset={cornerHandleOffset}
          />
          <EdgeHandles
            bbox={bbox}
            handleSize={handleSize}
            edgeHandleThickness={edgeHandleThickness}
            id={id}
            offset={edgeHandleOffset}
          />
        </g>
      )}
    </g>
  );
};

export default BaseShape;
