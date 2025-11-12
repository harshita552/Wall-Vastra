import React from "react";
import Cropper from "react-easy-crop";

export default function UploadImage({
  selectedFile,
  onFileChange,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onApply,
  onCancel,
}) {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-2">Upload Image</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files[0])}
        className="w-full p-2 border rounded-md"
      />

      {selectedFile && (
        <>
          <div className="relative w-full h-64 bg-gray-100 mt-3">
            <Cropper
              image={URL.createObjectURL(selectedFile)}
              crop={crop}
              zoom={zoom}
              aspect={undefined}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={onApply}
              className="bg-[#752650] text-white px-4 py-2 rounded hover:bg-gray-200 hover:text-black"
            >
              Apply
            </button>

            <button
              onClick={onCancel}
              className="border px-4 py-2 rounded hover:bg-black hover:text-white"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
