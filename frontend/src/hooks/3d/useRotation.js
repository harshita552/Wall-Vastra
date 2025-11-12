import { useState, useCallback } from "react";

export default function useRotation() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [last, setLast] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    setDragging(true);
    setLast({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;

      setRotation((prev) => ({
        x: prev.x + dy * 0.5,
        y: prev.y - dx * 0.5,
      }));

      setLast({ x: e.clientX, y: e.clientY });
    },
    [dragging, last]
  );

  const onMouseUp = useCallback(() => setDragging(false), []);

  return {
    rotation,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
    },
  };
}
