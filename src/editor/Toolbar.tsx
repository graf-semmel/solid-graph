// Toolbar.tsx
import React, { createContext, useContext, useState } from "react";
import "./Toolbar.css";
import { Icons } from "./Icons";

export type ToolType = "grab" | "select" | "rect";

type Tool = {
  icon: JSX.Element;
  type: ToolType;
  key: string;
};

const tools: Tool[] = [
  { icon: <Icons.DragMoveIcon />, type: "grab", key: "1" },
  { icon: <Icons.Pointer />, type: "select", key: "2" },
  { icon: <Icons.Rect />, type: "rect", key: "3" },
];

export const Toolbar: React.FC<{
  onToolChange?: (tool: ToolType) => void;
}> = ({ onToolChange }) => {
  const { activeTool, setActiveTool } = useTool();

  const handleIconClick = (type: ToolType) => {
    if (onToolChange) {
      onToolChange(type);
    }
    setActiveTool(type);
  };

  return (
    <div className="toolbar">
      {tools.map((icon, index) => (
        <div
          className={`icon-container ${activeTool === icon.type ? "active" : ""}`}
          key={index}
          onClick={() => handleIconClick(icon.type)}
        >
          {icon.icon}
          <span className="icon-key">{icon.key}</span>
        </div>
      ))}
    </div>
  );
};

interface ToolContextProps {
  activeTool: ToolType | null;
  setActiveTool: (tool: ToolType | null) => void;
}

const ToolContext = createContext<ToolContextProps | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTool, setActiveTool] = useState<ToolType | null>("select");
  console.log("active tool", activeTool);
  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = (): ToolContextProps => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useTool must be used within a ToolProvider");
  }
  return context;
};
