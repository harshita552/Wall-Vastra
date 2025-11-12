import { useEffect } from "react";

export default function usePhotoScale(widthInches, heightInches) {
  useEffect(() => {
    const model = window.__frameModel;
    if (!model) return;

    const INCH = 0.0254;
    const w = widthInches * INCH;
    const h = heightInches * INCH;

    const photo = model.getObjectByName("Photo");
    const frameTop = model.getObjectByName("FRAME_TOP");
    const frameBack = model.getObjectByName("Frame_Backside");

    if (photo) photo.scale.set(w, h, 1);

    const border = 0.04;
    [frameTop, frameBack].forEach(mesh => {
      if (mesh) {
        mesh.scale.x = w + border;
        mesh.scale.y = h + border;
      }
    });

    const mats = [
      "First_Mat_top","First_Mat_bottom","First_Mat_left","First_Mat_right",
      "Second_Mat_top","Second_Mat_Bottom","Second_Mat_left","Second_Mat_right"
    ];

    mats.forEach(name => {
      const m = model.getObjectByName(name);
      if (m) {
        m.scale.x = w + border * 2;
        m.scale.y = h + border * 2;
      }
    });
  }, [widthInches, heightInches]);
}
