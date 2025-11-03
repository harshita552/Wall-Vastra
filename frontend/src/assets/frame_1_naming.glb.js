// src/assets/frame_1_naming.glb.js
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

// Import both GLBs
import baseFrame from "./frame_1.glb";
import compFrame from "./finalglb_comp.glb";

/**
 * Combined Frame Model — exported as frameModel
 * so you can still import it the same way.
 */
export default function FrameModel() {
  const group = useRef();
  const frame = useGLTF(baseFrame);
  const comp = useGLTF(compFrame);

  useEffect(() => {
    // Ensure both models are aligned at origin
    frame.scene.position.set(0, 0, 0);
    comp.scene.position.set(0, 0, 0);
  }, []);

  const combined = new THREE.Group();
  combined.add(frame.scene);
  combined.add(comp.scene);

  return { scene: combined, frame, comp, group };
}
