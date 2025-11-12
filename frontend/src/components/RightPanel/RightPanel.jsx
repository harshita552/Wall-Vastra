import React from "react";

import ArtTypeSelector from "../ArtTypeSelector/ArtTypeSelector";
import ArtDimensions from "../ArtDimensions/ArtDimensions";
import PrintTypeSelector from "../PrintTypeSelector/PrintTypeSelector";
import FrameSelector from "../FrameSelector/FrameSelector";
import MatSelector from "../MatSelector/MatSelector";
import GlassSelector from "../GlassSelector/GlassSelector";
import UploadImage from "../UploadImage/UploadImage";
import AIImageGenerator from "../AIImageGenerator/AIImageGenerator";

export default function RightPanel(props) {
  return (
    <div className="panel w-full flex flex-col space-y-6 px-2 sm:px-4">
      
      <ArtTypeSelector {...props} />
      <ArtDimensions {...props} />
      <PrintTypeSelector {...props} />
      <FrameSelector {...props} />
      <MatSelector {...props} />
      <GlassSelector {...props} />
      <UploadImage {...props} />
      <AIImageGenerator {...props} />

    </div>
  );
}
