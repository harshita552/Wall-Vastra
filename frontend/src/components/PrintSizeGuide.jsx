import React from "react";

export default function PrintSizeGuide({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-[20px] text-gray-700 mb-6 leading-relaxed">
         Print size options are based on the resolution of your photo upload. You can find the outer dimensions of your frame below the Finalize button as you customize.
        </h2>

        {/* Guide Items */}
        <div className="space-y-6">
          {/* Small */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-4">
            <img
              src="https://d29mtkonxnc5fw.cloudfront.net/site_assets/small-photo-sizes-example.jpg"
              alt="Small print size"
              className="rounded-md shadow-sm w-full sm:w-[40%] object-contain"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-800">Small</h3>
              <p className="text-gray-600 mt-1">Starting at $59</p>
            </div>
          </div>

          {/* Medium */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-4">
            <img
              src="https://d29mtkonxnc5fw.cloudfront.net/site_assets/medium-photo-sizes-example.jpg"
              alt="Medium print size"
              className="rounded-md shadow-sm w-full sm:w-[40%] object-contain"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-800">Medium</h3>
              <p className="text-gray-600 mt-1">Starting at $76</p>
            </div>
          </div>

          {/* Large */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src="https://d29mtkonxnc5fw.cloudfront.net/site_assets/large-photo-sizes-example.jpg"
              alt="Large print size"
              className="rounded-md shadow-sm w-full sm:w-[40%] object-contain"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-800">Large</h3>
              <p className="text-gray-600 mt-1">Starting at $129</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
