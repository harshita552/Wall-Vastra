import Frame3D from "../Frame3D";
import RightPanel from "../RightPanel/RightPanel";
import useRotation from "../../hooks/3d/useRotation";
import usePhotoScale from "../../hooks/3d/usePhotoScale";
import { useState } from "react";

export default function CollageLayoutSelector() {
  const { rotation, handlers } = useRotation();

  const [artWidth, setArtWidth] = useState(8);
  const [artHeight, setArtHeight] = useState(10);
  const [appliedDimensions, setAppliedDimensions] = useState({ width: 8, height: 10 });
  const [lockAspect, setLockAspect] = useState(true);

  usePhotoScale(artWidth, artHeight);  // ✅ auto-updates 3D

  return (
    <div className="flex">
      <div
        className="preview"
        {...handlers}
      >
        <Frame3D rotation={rotation} />
      </div>

      <RightPanel
        artWidth={artWidth}
        artHeight={artHeight}
        setArtWidth={setArtWidth}
        setArtHeight={setArtHeight}
        appliedDimensions={appliedDimensions}
        lockAspect={lockAspect}
        setLockAspect={setLockAspect}
      />
    </div>
  );
}
