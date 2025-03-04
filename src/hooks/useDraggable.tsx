// Rectangle.tsx
import React, { useState } from "react";

export interface DragState {
  isDragging: boolean;
  initialMousePosition: { x: number; y: number };
  currentOffset: { x: number; y: number };
  initialParentIndex: number;
}

export function useDraggable(rectRef: React.RefObject<SVGRectElement>) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    initialMousePosition: { x: 0, y: 0 },
    currentOffset: { x: 0, y: 0 },
    initialParentIndex: -1,
  });

  function onMouseDown(event: React.MouseEvent<SVGRectElement>) {
    if (!rectRef.current) return;

    const parent = rectRef.current.parentNode;
    const children = Array.from(parent!.children);
    const initialParentIndex = children.indexOf(rectRef.current);
    console.log("initialParentIndex", initialParentIndex, rectRef);

    setDragState((prevState) => ({
      ...prevState,
      isDragging: true,
      initialMousePosition: { x: event.clientX, y: event.clientY },
      initialParentIndex,
    }));

    parent!.appendChild(rectRef.current);
    event.stopPropagation();
  }

  function onMouseMove(event: React.MouseEvent<SVGRectElement>) {
    if (!dragState.isDragging) return;

    setDragState((prevState) => {
      if (!prevState.isDragging) return prevState;

      const deltaX = event.clientX - prevState.initialMousePosition.x;
      const deltaY = event.clientY - prevState.initialMousePosition.y;

      return {
        ...prevState,
        currentOffset: {
          x: prevState.currentOffset.x + deltaX,
          y: prevState.currentOffset.y + deltaY,
        },
        initialMousePosition: { x: event.clientX, y: event.clientY },
      };
    });
    event.stopPropagation();
  }

  function onMouseUp() {
    if (!dragState.isDragging) return;

    if (rectRef.current && dragState.initialParentIndex !== -1) {
      const parent = rectRef.current.parentNode;
      const children = Array.from(parent!.children);
      const initialParentIndex = dragState.initialParentIndex;

      if (initialParentIndex < children.length) {
        parent!.insertBefore(rectRef.current, children[initialParentIndex]);
      } else {
        parent!.appendChild(rectRef.current);
      }
    }

    setDragState((prevState) => ({
      ...prevState,
      isDragging: false,
    }));
  }

  return {
    dragState,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
