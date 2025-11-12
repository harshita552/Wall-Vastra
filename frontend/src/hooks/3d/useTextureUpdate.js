import * as THREE from "three";

export default function useTextureUpdate() {
  return (textureUrl) => {
    const model = window.__frameModel;
    if (!model) return;

    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    model.traverse(child => {
      if (child.isMesh && child.name.toLowerCase().includes("frame")) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  };
}
