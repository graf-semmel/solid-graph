// BaseShape.tsx
import React from "react";
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
  const handleClick = (e: React.MouseEvent<SVGGElement>) => {
    console.log(`Clicked ${id}`);
    onShapeClick(id, e);
  };

  return (
    <g
      onClick={handleClick}
      className={isSelected ? "base-shape active" : "base-shape"}
    >
      {children}
    </g>
  );
};

export default BaseShape;
