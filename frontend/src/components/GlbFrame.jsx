import React, { Suspense, useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import frameModel from "../assets/frame_1_naming.glb";
import getCroppedImg from "../utils/cropImage"; // ✅ correct import


// Frame 3D model component
function FrameModel({ defaultTilt = 1.5, hoverTilt = 0.6, targetTilt, locked = false, frameTexture, selectedMatStyle = "No Mat",   frameThickness = 1, // ✅ Add default

}) {
  const { scene } = useGLTF(frameModel);
  const modelRef = useRef();
  const hoverRef = useRef(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


  // Center + recolor
  useEffect(() => {
    if (!modelRef.current) return;
    // Center the model
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    modelRef.current.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    modelRef.current.position.y -= size.y * 0.02;
    modelRef.current.rotation.y = defaultTilt;

    // ✅ Log all mesh names and recolor mat
    console.log("---- Mesh Names in Frame ----");

    modelRef.current.traverse((child) => {
      if (child.isMesh) {
        // Hide second mats by default
        if (
          ["Second_Mat_top", "Second_Mat_Bottom", "Second_Mat_left", "Second_Mat_right"].includes(child.name)
        ) {
          // Fully transparent material
          child.material = new THREE.MeshStandardMaterial({
            color: "white",
            transparent: true,
            opacity: 0,
            // roughness: 0.6,
            // metalness: 0.2,
          });
          child.material.needsUpdate = true;
        }

        // Hide Frame_Backside by default
        if (child.name === "Frame_Backside") {
          child.visible = false;
        }
        if (child.isMesh && child.material) {
          // Only change the inner mesh (e.g., named 'Inner' or 'Photo')
          if (child.name.toLowerCase().includes("inner") || child.name.toLowerCase().includes("photo")) {
            const prev = child.material;
            child.material = new THREE.MeshBasicMaterial({
              map: prev?.map || null,
              color: prev?.color || new THREE.Color(0xffffff),
              transparent: prev?.transparent || false,
              opacity: prev?.opacity ?? 1,
            });
            child.material.needsUpdate = true;
          }
        }

      }

      if (child.isMesh && child.name === "FRAME_TOP") {
        if (frameTexture) {
          const texture = new THREE.TextureLoader().load(frameTexture);
          texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;

          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.6,
          });
          child.material.needsUpdate = true;
        }
      }
      if (child.isMesh) {
        console.log(child.name);
        // Recolor mat meshes
        if (
          ["First_Mat_top", "First_Mat_bottom", "First_Mat_left", "First_Mat_right"].includes(child.name)
        ) {
          child.material = new THREE.MeshBasicMaterial({ color: child.material.color });
          child.material.needsUpdate = true;
        }
      }

      if (!modelRef.current) return;

      modelRef.current.traverse((child) => {
        if (child.isMesh && child.name === "Photo") {
          window.__photoMesh = child; // expose globally
        }
      });
    });
    console.log("---- End of Mesh Names ----");

    // Expose this model globally for FrameCustomizer access
    window.__frameModel = modelRef.current;
    const applyFrameSize = (widthScale, heightScale) => {
      if (!modelRef.current) return;
      modelRef.current.scale.set(widthScale, heightScale, widthScale);
    };

    // Expose this function globally so input boxes can call it
    window.__applyFrameSize = applyFrameSize;

  }, [defaultTilt]);
  // ✅ Mat visibility logic — completely safe, stable dependency array
  useEffect(() => {
    if (!modelRef.current) return;

    const model = modelRef.current;

    model.traverse((child) => {
      if (!child.isMesh) return;

      const isFirstMat =
        child.name === "First_Mat_top" ||
        child.name === "First_Mat_bottom" ||
        child.name === "First_Mat_left" ||
        child.name === "First_Mat_right";

      const isSecondMat =
        child.name === "Second_Mat_top" ||
        child.name === "Second_Mat_Bottom" || // exact GLB name
        child.name === "Second_Mat_left" ||
        child.name === "Second_Mat_right";

      // Hide all by default
      if (isFirstMat || isSecondMat) child.visible = false;

      switch (selectedMatStyle) {
        case "Single Mat":
          if (isFirstMat) {
            child.visible = true;
            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            child.material.needsUpdate = true;
          }
          break;

        case "Single Mat + Double Mat":
          // ✅ Outer white mat
          if (isFirstMat) {
            child.visible = true;
            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            child.material.needsUpdate = true;
          }

          // ✅ Inner dark mat
          if (isSecondMat) {
            child.visible = true;
            child.material = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
            child.material.needsUpdate = true;

            // ✅ Bring inner mat slightly forward to avoid overlap issues
            child.position.z = 0.035;

            // ✅ Slightly enlarge the second mat to close visible line between borders
            child.scale.x *= 1.002; // widen a touch
            child.scale.y *= 1.002; // height a touch
          }
          break;

        // 🏝️ ISLAND (white base + lifted mat with shadow feel)
        case "Island":
          if (isFirstMat || isSecondMat) {
            child.visible = true;

            if (isSecondMat) {
              // Flat white mat that doesn’t change on tilt
              child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
              });
              child.material.needsUpdate = true;
            }
          }
          break;

        default:
          break;
      }
    });
  }, [selectedMatStyle]);

// ✅ Reactively update frame thickness
useEffect(() => {
  const model = window.__frameModel;
  if (!model) return;

  const frame = model.getObjectByName("FRAME_TOP");
  if (!frame) return;

  // Store original scale/pos only once
  if (!frame.userData.originalScale) {
    frame.userData.originalScale = frame.scale.clone();
    frame.userData.originalPos = frame.position.clone();
  }

  const { x, y, z } = frame.userData.originalScale;
  const { z: origZ } = frame.userData.originalPos;

  // ✅ Apply thickness on Z-axis
  frame.scale.set(x, y, z * frameThickness);

  // ✅ Push forward to avoid sinking
  const forwardOffset = 0.25 * (frameThickness - 1);
  frame.position.z = origZ + forwardOffset;

  frame.updateMatrixWorld(true);
}, [frameThickness]);


  // Smooth rotation: hover + targetTilt
  useFrame(() => {
    if (!modelRef.current) return;

    // Lock front view if needed
    if (locked) {
      modelRef.current.rotation.y = defaultTilt;
      return;
    }

    // Smooth rotation between default, hover, or manual tilt
    const rot = hoverRef.current ? hoverTilt : (targetTilt ?? defaultTilt);
    modelRef.current.rotation.y += (rot - modelRef.current.rotation.y) * 0.05;

    // 🎨 Dynamic lighting effect based on current rotation
    const currentTilt = modelRef.current.rotation.y;

    // Get directional light by name (ensure it's added in <Canvas>)
    const light = modelRef.current.parent?.getObjectByName("dynamicLight");
    if (light) {
      // Adjust light intensity and direction based on tilt
      light.intensity = THREE.MathUtils.lerp(0.9, 1.5, Math.abs(Math.cos(currentTilt)));
      light.position.x = Math.sin(currentTilt) * 10;
      light.position.z = Math.cos(currentTilt) * 10;
    }

    // Adjust frame material reflectiveness based on tilt
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material && child.material.metalness !== undefined) {
        child.material.metalness = THREE.MathUtils.lerp(0.1, 0.4, Math.abs(Math.cos(currentTilt)));
        child.material.roughness = THREE.MathUtils.lerp(0.7, 0.3, Math.abs(Math.cos(currentTilt)));
      }
    });
  });

  const handleApplyCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      URL.createObjectURL(selectedFile),
      croppedAreaPixels
    );

    const texture = new THREE.TextureLoader().load(croppedImageUrl);
    texture.flipY = false;

    if (window.__photoMesh) {
      window.__photoMesh.material.map = texture;
      window.__photoMesh.material.needsUpdate = true;

      // 🧠 Auto-adjust frame based on image aspect ratio
      const img = new Image();
      img.src = croppedImageUrl;
      img.onload = () => {
        const aspect = img.width / img.height;
        const baseHeight = 10;
        const newWidth = baseHeight * aspect;
        window.__applyFrameSize(newWidth / 8, baseHeight / 10); // scale proportionally to your reference base
      };
    }
  };


  return (
    <primitive
      ref={modelRef}
      object={scene}
      onPointerOver={() => !locked && (hoverRef.current = true)}
      onPointerOut={() => !locked && (hoverRef.current = false)}
    />
  );
}

// Forward ref to allow download
const GlbFrame = forwardRef(({ targetTilt, locked = false, frameTexture, selectedMatStyle }, ref) => {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadFrame: () => {
      if (!sceneRef.current || !cameraRef.current) return;

      const offCanvas = document.createElement("canvas");
      offCanvas.width = canvasRef.current.width;
      offCanvas.height = canvasRef.current.height;

      const renderer = new THREE.WebGLRenderer({
        canvas: offCanvas,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(offCanvas.width, offCanvas.height);

      renderer.render(sceneRef.current, cameraRef.current);

      const dataURL = offCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "frame.png";
      link.click();

      renderer.dispose();
    },
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        aspectRatio: "1 / 1",
        margin: "0 auto",
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ fov: 35, near: 0.1, far: 1000, position: [0, 0, 15] }}
        onCreated={({ gl, scene, camera }) => {
          sceneRef.current = scene;
          cameraRef.current = camera;

          // ✅ No tone mapping, shadows, or light effects
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = false;
        }}
      >

        <Suspense fallback={null}>
          <FrameModel
            defaultTilt={1.5}
            hoverTilt={0.6}
            targetTilt={targetTilt}
            locked={locked}
            frameTexture={frameTexture}
            selectedMatStyle={selectedMatStyle} // ✅ ADD THIS
          />

          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableRotate={false} enablePan={false} target={[0, 0, 0]} enableZoom={false} />
      </Canvas>
    </div>
  );
});

export default GlbFrame;
