export default async function getCroppedImg(imageSrc, crop, flipHorizontally = false) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Default to full image if crop is not defined
  const cropX = Math.max(0, crop?.x || 0);
  const cropY = Math.max(0, crop?.y || 0);
  const cropWidth = crop?.width ? Math.min(image.width - cropX, crop.width) : image.width;
  const cropHeight = crop?.height ? Math.min(image.height - cropY, crop.height) : image.height;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // Smooth and clean rendering
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Optional horizontal flip
  if (flipHorizontally) {
    ctx.translate(cropWidth, 0);
    ctx.scale(-1, 1);
  }

  // Draw cropped area (no aspect ratio enforcement)
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  // Return cropped image as a Blob URL
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      },
      "image/jpeg",
      1 // maximum quality
    );
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}
