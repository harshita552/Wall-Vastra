import React, { Suspense, useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import getCroppedImg from "../utils/cropImage"; // ✅ correct import
import frameModel from "../assets/frame_1_naming.glb";

// Frame 3D model component
function FrameModel({ defaultTilt = 1.5, hoverTilt = 0.6, targetTilt, locked = false, frameTexture, selectedMatStyle = "No Mat", frameThickness = 1, // ✅ Add default
  floatType, matWidth = { top: 0, bottom: 0, left: 0, right: 0 }
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

    });
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.name === "Photo") {
        window.__photoMesh = child; // expose globally
      }
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
            // child.position.z = 0.035;

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

  useEffect(() => {
    // Identify meshes by name
    const firstMatMeshes = [];
    const secondMatMeshes = [];
    let photoMesh = null;

    scene.traverse((mesh) => {
      if (mesh.isMesh) {
        if (mesh.name.includes("First_Mat")) firstMatMeshes.push(mesh);
        if (mesh.name.includes("Second_Mat")) secondMatMeshes.push(mesh);
        if (mesh.name === "Photo") photoMesh = mesh;
      }
    });

    // ✅ Store original scales for reset reference
    const originalScales = {
      photo: photoMesh ? photoMesh.scale.clone() : new THREE.Vector3(1, 1, 1),
      firstMat: firstMatMeshes[0]
        ? firstMatMeshes[0].scale.clone()
        : new THREE.Vector3(1, 1, 1),
      secondMat: secondMatMeshes[0]
        ? secondMatMeshes[0].scale.clone()
        : new THREE.Vector3(1, 1, 1),
    };

    window.__updateMatScale = (value) => {
      const matScale = 1 / (1 + value * 0.03); // mats shrink inward
      const photoScale = 1 + value * 0.06; // photo expands outward

      // --- Scale only first mat inward ---
      firstMatMeshes.forEach((mesh) => {
        mesh.scale.setScalar(originalScales.firstMat.x * matScale);

        // ✅ Make mat area + inner space white
        if (mesh.material) {
          mesh.material.color = new THREE.Color("white");
          mesh.material.needsUpdate = true;
        }
      });

      // ✅ Make inner gray area white too (detect it by name)
      const innerGrayMesh = window.__frameModel?.getObjectByName("Inner_Back") ||
        window.__frameModel?.getObjectByName("Photo_Back") ||
        window.__frameModel?.getObjectByName("Back_Plane");

      if (innerGrayMesh && innerGrayMesh.material) {
        innerGrayMesh.material.color = new THREE.Color("white");
        innerGrayMesh.material.needsUpdate = true;
      }

      // --- Scale photo outward (uniformly) ---
      if (photoMesh) {
        const base = originalScales.photo;
        const newScale = photoScale;

        photoMesh.scale.set(
          base.x * newScale,
          base.y * newScale,
          base.z * 1
        );
      }
    };
    // Set initial mat = 0
    window.__updateMatScale(0);
  }, [scene]);

  // ✅ Reactively update frame thickness
  useEffect(() => {
    const model = window.__frameModel;
    if (!model) {
      console.log("Frame model not loaded yet");
      return;
    }
    const frame = model.getObjectByName("FRAME_TOP");
    if (!frame) return;
    if (!frame.userData.originalScale) {
      frame.userData.originalScale = frame.scale.clone();
      frame.userData.originalPos = frame.position.clone();
    }
    const { x, y, z } = frame.userData.originalScale;
    const { y: origY } = frame.userData.originalPos;
    // ✅ Boost the perceived thickness a bit
    const visualMultiplier = 1.3; // increase this for thicker look
    const adjustedThickness = 1 + (frameThickness - 1) * visualMultiplier;
    frame.scale.set(x, y * adjustedThickness, z);
    // ✅ Make it expand more outward (so less goes inward)
    const forwardOffset = 0.5 * (adjustedThickness - 1);
    frame.position.y = origY + forwardOffset;
    console.log("✅ Frame thickness changed (visual):", adjustedThickness);
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
  useEffect(() => {
    if (!scene) {
      console.log("⏳ Waiting for scene...");
      return;
    }

    // ✅ Register scene, camera, renderer globally
    if (!window.__scene) {
      window.__scene = scene;
      const renderer = scene?.renderer || window.__renderer;
      if (!window.__renderer && renderer) window.__renderer = renderer;
      if (!window.__camera && scene?.camera) window.__camera = scene.camera;
      console.log("✅ Scene registered globally.");
    }

    // --- Find meshes ---
    let photoMesh = null;
    const firstMatMeshes = [];
    const secondMatMeshes = [];

    scene.traverse((mesh) => {
      if (!mesh.isMesh) return;
      if (mesh.name === "Photo") photoMesh = mesh;
      if (mesh.name.includes("First_Mat")) firstMatMeshes.push(mesh);
      if (mesh.name.includes("Second_Mat")) secondMatMeshes.push(mesh);
    });

    if (!photoMesh) {
      console.log("⚠️ Photo mesh not found yet");
      return;
    }

    // --- Shadow Light Setup ---
    let shadowLight = scene.getObjectByName("photoShadowLight");
    if (!shadowLight) {
      shadowLight = new THREE.DirectionalLight(0xffffff, 0.6);
      shadowLight.position.set(2, 5, 5);
      shadowLight.castShadow = true;
      shadowLight.name = "photoShadowLight";
      scene.add(shadowLight);

      const helper = new THREE.DirectionalLightHelper(shadowLight, 0.2);
      helper.visible = false; // enable temporarily if needed
      scene.add(helper);

      console.log("💡 Added shadow light to scene");
    }

    // --- Enable shadow casting globally ---
    photoMesh.castShadow = true;
    photoMesh.receiveShadow = true;
    firstMatMeshes.forEach((m) => {
      m.castShadow = true;
      m.receiveShadow = true;
    });
    secondMatMeshes.forEach((m) => (m.visible = false));

    // --- Apply float types ---
    if (floatType === "none") {
      photoMesh.position.z = 0;
      shadowLight.intensity = 0.0;
      firstMatMeshes.forEach((m) => (m.visible = false)); // hide mat on default
      console.log("🟢 FloatType: None → no mat, no shadow");
    } else if (floatType === "sandwich") {
      photoMesh.position.z = 0.01;
      shadowLight.intensity = 0.6;
      firstMatMeshes.forEach((m) => (m.visible = true)); // show single mat
      console.log("🟡 FloatType: Sandwich → soft shadow, single mat visible");
    } else if (floatType === "elevated") {
      photoMesh.position.z = 0.05;
      shadowLight.intensity = 1.0;
      firstMatMeshes.forEach((m) => (m.visible = true)); // show single mat
      console.log("🔴 FloatType: Elevated → stronger shadow, single mat visible");
    }

    // --- Renderer shadow settings ---
    const renderer = window.__renderer || scene.renderer;
    if (renderer) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      console.log("🧩 Shadows enabled on renderer");
    }
  }, [floatType, scene]);

  useEffect(() => {
    if (!scene) return;

    const matMeshes = {
      top: null,
      bottom: null,
      left: null,
      right: null,
    };

    scene.traverse((mesh) => {
      if (!mesh.isMesh) return;
      if (mesh.name === "First_Mat_top") matMeshes.top = mesh;
      if (mesh.name === "First_Mat_bottom") matMeshes.bottom = mesh;
      if (mesh.name === "First_Mat_left") matMeshes.left = mesh;
      if (mesh.name === "First_Mat_right") matMeshes.right = mesh;
    });

    // Helper function: scale mat toward photo
    const adjustMat = (mesh, side, value) => {
      if (!mesh) return;
      if (!mesh.userData.originalScale) {
        mesh.userData.originalScale = mesh.scale.clone();
        mesh.userData.originalPos = mesh.position.clone();
      }

      const scale = mesh.userData.originalScale.clone();
      const pos = mesh.userData.originalPos.clone();

      const inward = value * 0.02; // adjust sensitivity

      switch (side) {
        case "top":
          mesh.scale.y = scale.y + inward;
          mesh.position.y = pos.y - inward / 2; // grow down toward photo
          break;
        case "bottom":
          mesh.scale.y = scale.y + inward;
          mesh.position.y = pos.y + inward / 2; // grow up toward photo
          break;
        case "left":
          mesh.scale.x = scale.x + inward;
          mesh.position.x = pos.x + inward / 2; // grow right toward photo
          break;
        case "right":
          mesh.scale.x = scale.x + inward;
          mesh.position.x = pos.x - inward / 2; // grow left toward photo
          break;
        default:
          break;
      }
    };

    // Apply adjustments
    adjustMat(matMeshes.top, "top", matWidth.top);
    adjustMat(matMeshes.bottom, "bottom", matWidth.bottom);
    adjustMat(matMeshes.left, "left", matWidth.left);
    adjustMat(matMeshes.right, "right", matWidth.right);
  }, [matWidth, scene]);

  const handleApplyCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      URL.createObjectURL(selectedFile),
      croppedAreaPixels
    );

    const texture = new THREE.TextureLoader().load(croppedImageUrl);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    if (window.__photoMesh) {
      window.__photoMesh.material.map = texture;
      window.__photoMesh.material.needsUpdate = true;

      // 🧠 Maintain frame size — only adjust Photo mesh aspect ratio
      const img = new Image();
      img.src = croppedImageUrl;
      img.onload = () => {
        const aspect = img.width / img.height;

        // Reset to original scale if not stored yet
        if (!window.__photoMesh.userData.originalScale) {
          window.__photoMesh.userData.originalScale = window.__photoMesh.scale.clone();
        }

        const original = window.__photoMesh.userData.originalScale.clone();

        // Adjust only width relative to height to maintain aspect
        window.__photoMesh.scale.set(
          original.y * aspect,
          original.y,
          original.z
        );

        console.log("📸 Adjusted photo aspect ratio only (no frame zoom).");
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
const GlbFrame = forwardRef(({ targetTilt, locked = false, frameTexture, selectedMatStyle, frameThickness, floatType, matWidth }, ref) => {
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
            frameThickness={frameThickness} // ✅ add this
            floatType={floatType} // ✅ ADD THIS LINE
            matWidth={matWidth}  // ✅ NEW PROP

          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableRotate={false} enablePan={false} target={[0, 0, 0]} enableZoom={false} />
      </Canvas>
    </div>
  );
});
export default GlbFrame;
