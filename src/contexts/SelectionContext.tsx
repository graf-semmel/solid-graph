// SelectionContext.tsx
import React, { createContext, useContext, useState } from "react";

interface SelectionContextProps {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const SelectionContext = createContext<SelectionContextProps | undefined>(
  undefined
);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SelectionContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};