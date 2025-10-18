import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function FrameModel({ tilt = 0.4, desiredHeight = 3 }) {
  const glbUrl = require("../assets/frame_1_naming.glb");
  const { scene } = useGLTF(glbUrl);
  const modelRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!modelRef.current) return;

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center the model
    modelRef.current.position.sub(center);

    // Scale model based on desired height
    const scaleFactor = desiredHeight / size.y; // scale by Y height
    modelRef.current.scale.setScalar(scaleFactor);

    // Position camera to fit full frame
    const fov = (camera.fov * Math.PI) / 180;
    const distance = (desiredHeight / 2) / Math.tan(fov / 2);
    camera.position.set(0, 0, distance * 1.3); // extra padding
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Recolor Second Mat
    modelRef.current.traverse((child) => {
      if (child.isMesh) {
        if (["Second_Mat_top", "Second_Mat_Bottom"].includes(child.name))
          child.material.color.set("white");
        if (["Second_Mat_left", "Second_Mat_right"].includes(child.name))
          child.material.color.set("red");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredHeight]); // only primitive dependency

  // Apply tilt for better viewing
  scene.rotation.set(0, tilt, 0);

  return <primitive ref={modelRef} object={scene} />;
}

export default function GlbFrame() {
  // desiredHeight = controls how "zoomed" the model is
  const [desiredHeight] = useState(3); // you can change this dynamically

  return (
    <div
      style={{
        width: "100%",
        height: "600px", // container height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: "50px",
        padding: "50px",
      }}
    >
      <Canvas
        style={{ width: "100%", minheight: "300px" }}
        camera={{ position: [0, 0, 6], fov: 30 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FrameModel tilt={0.4} desiredHeight={desiredHeight} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={true} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
