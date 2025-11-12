import { useEffect } from "react";

export default function useFrameModel() {
  useEffect(() => {
    if (!window.__frameModel) return;
    console.log("✅ Frame model attached globally");
  }, []);

  return window.__frameModel;
}
