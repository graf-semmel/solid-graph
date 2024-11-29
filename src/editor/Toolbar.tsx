// Toolbar.tsx
import React, { useState } from "react";
import "./Toolbar.css";
import { Icons } from "./Icons";

const Toolbar: React.FC = () => {
  const [activeIcon, setActiveIcon] = useState<number | null>(null);

  const icons = [
    { component: <Icons.DragMoveIcon />, id: 1 },
    { component: <Icons.Pointer />, id: 2 },
  ];

  const handleIconClick = (id: number) => {
    setActiveIcon(id);
  };

  return (
    <div className="toolbar">
      {icons.map((icon, index) => (
        <div
          className={`icon-container ${activeIcon === icon.id ? "active" : ""}`}
          key={index}
          onClick={() => handleIconClick(icon.id)}
        >
          {icon.component}
          <span className="icon-number">{icon.id}</span>
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
