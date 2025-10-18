// src/components/ServiceWithFrame.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import Frame3D from "../components/Frame3D";

export default function ServiceWithFrame() {
  const navigate = useNavigate();
  const frameRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [service, setService] = useState("");

  const services = [
    { id: 1, name: "Print and Frame", description: "Upload an Image", path: "/layout" },
    { id: 2, name: "Frame only", description: "Custom Frame", path: "/layout" },
    { id: 3, name: "Mail in", description: "Send in artwork to be framed", path: "/layout" },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;
    setLastPos({ x: e.clientX, y: e.clientY });
    setRotation((prev) => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y - deltaX * 0.5,
    }));
  };

  const handleSelect = (service) => {
    setService(service.name);
    navigate(service.path);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen font-poppins">
      {/* Left Panel - Frame Preview */}
      <div
        className="lg:w-7/12 w-full h-1/2 lg:h-full bg-gray-50 flex justify-center items-center perspective-1000"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Frame3D
          rotation={rotation}
          frameWidth={600}
          frameHeight={450}
          frameColor="#000"
          matColor="#ffffff"
          acrylicOpacity={0.08}
          frameThickness={30}
        />
      </div>

      {/* Right Panel - Service Selection */}
      <div className="lg:w-5/12 w-full h-1/2 lg:h-full bg-white flex flex-col gap-6 p-8">
        <h2 className="text-gray-800 font-bold text-2xl mb-4">
          SELECT YOUR SERVICE
        </h2>

        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s)}
            className="flex justify-between items-center bg-gray-100 text-gray-800 px-6 py-4 font-medium rounded-md shadow
                       hover:bg-[#752650] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="flex flex-col text-left">
              <span className="text-lg">{s.name}</span>
              <span className="text-sm text-gray-600">{s.description}</span>
            </div>
            <ArrowRightCircleIcon className="ml-4 w-7 h-7 text-gray-700 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
