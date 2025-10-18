import React from "react";
import "../App.css";
import {
  PhotoIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function Frame3D({
  frameWidth = 600,
  frameHeight = 450,
  frameColor = "#faf4d0",
  matColor = "#ffffff",
  artBg = "#c7cacc",
  acrylicOpacity = 0.08,
  canvasEdge = "wrap-sides",
  frameThickness = 30,
}) {
  const frameStyle = {
    "--frame-color": frameColor,
    "--mat-color": matColor,
    "--media-bg": artBg,
    "--acrylic-opacity": acrylicOpacity,
    "--frame-thickness": `${frameThickness}px`,
    "--frame-width": `${frameWidth}px`,
    "--frame-height": `${frameHeight}px`,
  };

  const buttonStyle = {
    border: "1px solid gray",
    borderRadius: "8px",
    background: "transparent",
    padding: "8px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#333",
  };

  const iconClass = "w-5 h-5 text-gray-700";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100vh", // prevent double scroll
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // better for top alignment
        backgroundColor: "transparent",
        marginTop: "20px", // reduce some spacing
        overflow: "hidden", // prevents outer scroll
      }}

    >
      {/* 🔹 Top Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button style={buttonStyle} title="Front View">
          <DevicePhoneMobileIcon className={iconClass} />

          {/* <span>Front View</span> */}
        </button>
        <button style={buttonStyle} title="Side View">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <title>Side View</title>
            <path
              fill="none"
              fillRule="evenodd"
              stroke="#5a5a5aff"
              strokeWidth="2"
              d="M8 6.8198039v10.3603922l8 1.6V5.2198039l-8 1.6z"
            ></path>
          </svg>
          {/* <span>Side View</span> */}
        </button>

        <button style={buttonStyle} title="AR View">
          <PhotoIcon className={iconClass} />
          {/* <span>AR View</span> */}
        </button>
      </div>

      {/* 🖼️ Frame */}
      <div id="scene">
        <div className="frame" style={frameStyle}>
          <div className="face frame-backing"></div>
          <div className="frame-backing-left"></div>
          <div className="frame-backing-top"></div>
          <div className="face frame-mat"></div>
          <div className="face frame-front"></div>
          <div className="face frame-media">
            <div className="media-shine"></div>
            <div className="media-shine shine-2"></div>
          </div>
          <div className="face frame-acrylic"></div>

          <div className={`frame-side left ${canvasEdge}`}></div>
          <div className={`frame-side right ${canvasEdge}`}></div>
          <div className={`frame-side top ${canvasEdge}`}></div>
          <div className={`frame-side bottom ${canvasEdge}`}></div>
        </div>
      </div>

      {/* 🔻 Bottom Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-5px",
        }}
      >
        <button style={buttonStyle} title="Download">
          <ArrowDownTrayIcon className={iconClass} />
          {/* <span>Download</span> */}
        </button>
      </div>
    </div>
  );
}
