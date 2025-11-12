import { useEffect, useRef } from "react";
import useFrameStore from "../../store/frameStore";

export default function useAnimatedScale() {
  const width = useFrameStore((s) => s.width);
  const height = useFrameStore((s) => s.height);

  // ref to track animated state
  const currentScaleRef = useRef({ w: width, h: height });

  useEffect(() => {
    const frameModel = window.__frameModel;
    if (!frameModel) return;

    const INCH = 0.0254;
    const targetW = width * INCH;
    const targetH = height * INCH;

    const photo = frameModel.getObjectByName("Photo");
    if (!photo) return;

    // animation
    const animate = () => {
      const cs = currentScaleRef.current;
      const speed = 0.08; // smoothness factor

      // LERP width & height
      cs.w += (targetW - cs.w) * speed;
      cs.h += (targetH - cs.h) * speed;

      // update model
      photo.scale.set(cs.w, cs.h, 1);

      // If near target, stop animation
      if (Math.abs(cs.w - targetW) > 0.0001 || Math.abs(cs.h - targetH) > 0.0001) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [width, height]);
}
