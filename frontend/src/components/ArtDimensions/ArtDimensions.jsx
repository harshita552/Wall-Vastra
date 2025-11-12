import React from "react";
import { useFrameStore } from "../../store/useFrameStore";

export default function ArtDimensions() {
  const artWidth = useFrameStore((s) => s.artWidth);
  const artHeight = useFrameStore((s) => s.artHeight);
  const aspectLocked = useFrameStore((s) => s.aspectLocked);
  const setAspectLocked = useFrameStore((s) => s.setAspectLocked);
  const setArtDimensions = useFrameStore((s) => s.setArtDimensions);

  const handleWidth = (w) => {
    if (!w || w <= 0) return;
    if (aspectLocked) {
      const aspect = artWidth / artHeight;
      const h = Number((w / aspect).toFixed(2));
      setArtDimensions(w, h);
    } else {
      setArtDimensions(w, artHeight);
    }
  };

  const handleHeight = (h) => {
    if (!h || h <= 0) return;
    if (aspectLocked) {
      const aspect = artWidth / artHeight;
      const w = Number((h * aspect).toFixed(2));
      setArtDimensions(w, h);
    } else {
      setArtDimensions(artWidth, h);
    }
  };

  return (
    <div className="p-3 bg-white rounded-md border shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={aspectLocked}
          onChange={() => setAspectLocked(!aspectLocked)}
        />
        <label className="font-medium">Lock Aspect Ratio</label>
      </div>

      <div className="flex gap-4">
        <div>
          <label>Width (in)</label>
          <input
            type="number"
            value={artWidth}
            onChange={(e) => handleWidth(parseFloat(e.target.value))}
            className="border p-1 rounded w-20"
          />
        </div>
        <div>
          <label>Height (in)</label>
          <input
            type="number"
            value={artHeight}
            onChange={(e) => handleHeight(parseFloat(e.target.value))}
            className="border p-1 rounded w-20"
          />
        </div>
      </div>
    </div>
  );
}
