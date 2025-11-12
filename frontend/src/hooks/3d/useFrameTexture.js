import * as THREE from "three";
import { useEffect } from "react";
import useFrameStore from "../../store/frameStore";

export default function useFrameTexture() {
  const url = useFrameStore((s) => s.frameTextureUrl);

  useEffect(() => {
    if (!url || !window.__frameModel) return;

    const model = window.__frameModel;
    const texture = new THREE.TextureLoader().load(url);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    model.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("frame")) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }, [url]);
}
