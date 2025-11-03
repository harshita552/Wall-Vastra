import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { PhotoIcon, DevicePhoneMobileIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import GlbFrame from "./GlbFrame";

export default function Frame3D({ selectedMatStyle, frameThickness, floatType, matWidth }) {
  const [targetTilt, setTargetTilt] = useState(1.5); // front view
  // const [selectedMatStyle, setSelectedMatStyle] = useState("No Mat");

  const [showContextView, setShowContextView] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [contextSize, setContextSize] = useState({ width: 300, height: 300 });
  const iconClass = "w-5 h-5 text-gray-700";

  const glbRef = useRef(null);

  
  // Responsive overlay size
  useEffect(() => {
    const updateSize = () => {
      setContextSize(window.innerWidth < 640 ? { width: 200, height: 200 } : { width: 300, height: 300 });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="frame3d-container" style={{ width: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
      {/* Top Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-5 px-2 sm:px-4">
        {/* Front View */}
        <button onClick={() => { setTargetTilt(1.5); setShowContextView(false); setShowAR(false); }} className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-transparent px-3 py-2 rounded-md hover:bg-gray-100 hover:border-gray-600">
          <DevicePhoneMobileIcon className={iconClass} />
        </button>

        {/* Side View */}
        <button onClick={() => { setTargetTilt(0.6); setShowContextView(false); setShowAR(false); }} className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-transparent px-3 py-2 rounded-md hover:bg-gray-100 hover:border-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <title>Side View</title>
            <path fill="none" fillRule="evenodd" stroke="#5a5a5aff" strokeWidth="2" d="M8 6.8198v10.36l8 1.6V5.22l-8 1.6z"></path>
          </svg>
        </button>

        {/* In Context View (locked front view) */}
        <button onClick={() => { setShowContextView(true); setShowAR(false); }} className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-transparent px-3 py-2 rounded-md hover:bg-gray-100 hover:border-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <g fill="none" fillRule="nonzero" transform="translate(3 3)">
              <g fill="#5a5a5aff" transform="translate(0 9)">
                <path d="M4 4h10v2H4zM6 0h6c1.1045695 0 2 .8954305 2 2v1H4V2c0-1.1045695.8954305-2 2-2z" />
                <circle cx="1.5" cy="3.5" r="1.5" />
                <circle cx="16.5" cy="3.5" r="1.5" />
                <path d="M2 4h2v3c0 .5522-.4477 1-1 1s-1-.4477-1-1V4zM14 4h2v3c0 .5522-.4477 1-1 1s-1-.4477-1-1V4z" />
              </g>
              <rect width="10" height="5" x="4" y="1" stroke="#5a5a5aff" strokeWidth="2" rx="1" />
            </g>
          </svg>
        </button>

        {/* AR View */}
        <button onClick={() => { setShowAR(true); setShowContextView(false); }} className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-transparent px-3 py-2 rounded-md hover:bg-gray-100 hover:border-gray-600">
          <PhotoIcon className={iconClass} />
        </button>
      </div>

      {/* 3D / Context / AR View */}
      <div className="relative w-full max-w-full h-[300px] sm:h-[500px] md:h-[550px] lg:h-[600px] px-2 -mt-4 sm:px-4">
        {!showAR && (
          showContextView ? (
            <div id="situ-bg-container" style={{ width: "100%", height: "100%", position: "relative" }}>
              <div id="situ-bg-0" style={{ width: "100%", height: "100%", backgroundImage: "url('https://resizer.simplyframed.com/dev/images/frame-preview/in-situ-table.png')", backgroundRepeat: "no-repeat", backgroundPosition: "bottom center", backgroundSize: "contain", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", width: `${contextSize.width}px`, height: `${contextSize.height}px`, transform: "translate(-50%, -50%)" }}>
                  <GlbFrame ref={glbRef} targetTilt={1.5} locked={true} frameWidth={contextSize.width} frameHeight={contextSize.height} />
                </div>
              </div>
            </div>
          ) : (
            <GlbFrame ref={glbRef} targetTilt={targetTilt} selectedMatStyle={selectedMatStyle} frameThickness={frameThickness} floatType={floatType} matWidth={matWidth}  />
          )
        )}

        {/* AR View */}
        <model-viewer style={{ display: showAR ? "block" : "none", width: "100%", height: "100%", backgroundColor: "#fff", position: "absolute", top: 0, left: 0 }}
          src="/frame_1_naming.glb"
          ar
          ar-modes="scene-viewer quick-look webxr"
          camera-controls
          auto-rotate
        />
      </div>

      {/* Download Button */}
      {!showAR && (
        <div className="flex justify-center  sm:px-4">
          <button onClick={() => glbRef.current?.downloadFrame()} className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-transparent px-3 py-2 rounded-md hover:bg-gray-100 hover:border-gray-600">
            <ArrowDownTrayIcon className={iconClass} />
          </button>
        </div>
      )}
    </div>
  );
}
