// src/store/useFrameStore.js
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useFrameStore = create(
  subscribeWithSelector((set) => ({
    // state
    artType: "Photo Print",
    artWidth: 8,
    artHeight: 10,
    aspectLocked: true,

    printType: "Glossy Print",
    glassType: "Simple Acrylic Glass",
    matStyle: "No Mat",
    matValues: { top: 0, bottom: 0, left: 0, right: 0 },
    matBorder: 0,

    frameThickness: 1,
    frameColor: "#f5f5f5",
    frameTexture: null,

    floatType: "none",

    selectedFile: null,
    croppedImageURL: null,

    aiPrompt: "",
    aiImage: null,
    aiGenerating: false,

    rotationTilt: 1.5,
    viewMode: "front",

    // actions (NO side-effects)
    setArtType: (value) => set({ artType: value }),
    setPrintType: (value) => set({ printType: value }),
    setGlassType: (value) => set({ glassType: value }),

    setMatStyle: (value) => set({ matStyle: value }),
    setMatValue: (side, value) =>
      set((state) => ({ matValues: { ...state.matValues, [side]: value } })),
    setMatBorder: (value) => set({ matBorder: value }),

    setFrameThickness: (value) => set({ frameThickness: value }),
    setFrameColor: (value) => set({ frameColor: value }),
    setFrameTexture: (value) => set({ frameTexture: value }),

    setArtDimensions: (w, h) => set({ artWidth: w, artHeight: h }),
    setAspectLocked: (value) => set({ aspectLocked: value }),

    setViewMode: (mode) => set({ viewMode: mode }),
    setRotationTilt: (v) => set({ rotationTilt: v }),

    setSelectedFile: (file) => set({ selectedFile: file }),
    setCroppedImageURL: (url) => set({ croppedImageURL: url }),

    setAIPrompt: (value) => set({ aiPrompt: value }),
    setAIImage: (value) => set({ aiImage: value }),
    setAIGenerating: (value) => set({ aiGenerating: value }),
  }))
);
