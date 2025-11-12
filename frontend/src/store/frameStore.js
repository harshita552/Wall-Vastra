import { create } from "zustand";
import { debounce } from "lodash";

const useFrameStore = create((set, get) => ({

    frameOptions: [
  {
    name: "Black Maple",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/black-maple2-swatch.jpg"
  },
  {
    name: "White Maple",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/white-maple4-swatch.jpg"
  }
],
  // Art dimensions (inches)
  width: 8,
  height: 10,

  // Aspect ratio lock
  lockAspect: true,

  // Frame texture
  frameTextureUrl: null,

  // Mat style
  matStyle: "none",

  // Debounced setters
  setWidth: debounce((w) => {
    set((state) => {
      // aspect ratio lock
      if (state.lockAspect && state.height > 0) {
        const aspect = state.width / state.height;
        return {
          width: w,
          height: Number((w / aspect).toFixed(2)),
        };
      }
      return { width: w };
    });
  }, 60), // ✅ 60ms debounce for smooth and reactive feel

  setHeight: debounce((h) => {
    set((state) => {
      if (state.lockAspect && state.width > 0) {
        const aspect = state.width / state.height;
        return {
          height: h,
          width: Number((h * aspect).toFixed(2)),
        };
      }
      return { height: h };
    });
  }, 60),

  toggleAspectLock: () =>
    set((state) => ({ lockAspect: !state.lockAspect })),

  setFrameTextureUrl: (url) => set({ frameTextureUrl: url }),
}));



export default useFrameStore;
