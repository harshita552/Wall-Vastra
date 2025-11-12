import React, { useRef, Suspense, useEffect, useMemo } from "react";
import { useFrameStore } from "../store/useFrameStore";
import { ArrowDownTrayIcon, DevicePhoneMobileIcon, PhotoIcon } from "@heroicons/react/24/outline";

const GlbFrame = React.lazy(() => import("./GlbFrame"));

/* cubic easing */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* Smooth tilt hook */
function useEasedTilt(target, duration = 400) {
  const [tilt, setTilt] = React.useState(target);
  const ref = React.useRef();

  useEffect(() => {
    cancelAnimationFrame(ref.current);
    const start = performance.now();
    const initial = tilt;

    const animate = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(progress);
      const value = initial + (target - initial) * eased;
      setTilt(value);

      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);

  return tilt;
}

export default function Frame3D() {
  const viewMode = useFrameStore((s) => s.viewMode);
  const setViewMode = useFrameStore((s) => s.setViewMode);

  const selectedMatStyle = useFrameStore((s) => s.matStyle);
  const frameThickness = useFrameStore((s) => s.frameThickness);
  const floatType = useFrameStore((s) => s.floatType);
  const matWidth = useFrameStore((s) => s.matValues);

  const glbRef = useRef(null);

  // Map every view to tilt
  const targetTilt = useMemo(() => {
    switch (viewMode) {
      case "side":
        return 0.6;
      case "context":
      case "front":
      default:
        return 1.5;
    }
  }, [viewMode]);

  const easedTilt = useEasedTilt(targetTilt);

  return (
    <div className="flex flex-col items-center w-full">
      {/* View switching buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("front")}
          className={`px-3 py-2 border rounded ${
            viewMode === "front" ? "bg-[#752650] text-white" : "bg-white"
          }`}
        >
          <DevicePhoneMobileIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => setViewMode("side")}
          className={`px-3 py-2 border rounded ${
            viewMode === "side" ? "bg-[#752650] text-white" : "bg-white"
          }`}
        >
          Side
        </button>

        <button
          onClick={() => setViewMode("context")}
          className={`px-3 py-2 border rounded ${
            viewMode === "context" ? "bg-[#752650] text-white" : "bg-white"
          }`}
        >
          Context
        </button>

        <button
          onClick={() => setViewMode("ar")}
          className={`px-3 py-2 border rounded ${
            viewMode === "ar" ? "bg-[#752650] text-white" : "bg-white"
          }`}
        >
          <PhotoIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 3D VIEWPORT */}
      <div className="relative w-full h-[400px]">
        {/* AR */}
        {viewMode === "ar" && (
          <model-viewer
            src="/frame_1_naming.glb"
            ar
            auto-rotate
            camera-controls
            className="w-full h-full"
          />
        )}

        {/* 3D Front/Side/Context */}
        {viewMode !== "ar" && (
          <Suspense fallback={<div>Loading 3D...</div>}>
            <GlbFrame
              ref={glbRef}
              targetTilt={easedTilt}
              selectedMatStyle={selectedMatStyle}
              frameThickness={frameThickness}
              floatType={floatType}
              matWidth={matWidth}
            />
          </Suspense>
        )}
      </div>

      {/* Download */}
      {viewMode !== "ar" && (
        <button
          onClick={() => glbRef.current?.downloadFrame()}
          className="mt-3 border px-4 py-2 rounded"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
