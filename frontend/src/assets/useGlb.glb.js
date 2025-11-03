import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

/**
 * Combine both GLB files and return one merged group.
 */
function useCombinedGlb() {
  const baseFrameUrl = new URL("./frame_1_naming.glb", import.meta.url).href;
  const compFrameUrl = new URL("./finalglb_comp.glb", import.meta.url).href;

  const frame = useGLTF(baseFrameUrl);
  const comp = useGLTF(compFrameUrl);

  useEffect(() => {
    frame.scene.position.set(0, 0, 0);
    comp.scene.position.set(0, 0, 0);
  }, [frame, comp]);

  const combined = new THREE.Group();
  combined.add(frame.scene);
  combined.add(comp.scene);

  return { scene: combined, frame, comp };
}

// ✅ Export with the same name as before
export default useCombinedGlb;
