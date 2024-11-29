// BaseShape.tsx
import React, { useMemo } from "react";
import "./BaseShape.css";
import { useSelection } from "../contexts/SelectionContext";

interface BaseShapeProps {
  id: string;
  x: number;
  y: number;
  children: React.ReactNode;
}

const BaseShape: React.FC<BaseShapeProps> = ({ id, x, y, children }) => {
  const { selectedId, setSelectedId } = useSelection();
  const selected = selectedId === id;

  const handleClick = (e: React.MouseEvent<SVGGElement>) => {
    console.log(`Clicked ${id}`);
    setSelectedId(id);
    e.stopPropagation();
  };

  return (
    <g
      onClick={handleClick}
      transform={`translate(${x}, ${y})`}
      className={selected ? "base-shape active" : "base-shape"}
    >
      {children}
    </g>
  );
};

export default BaseShape;
