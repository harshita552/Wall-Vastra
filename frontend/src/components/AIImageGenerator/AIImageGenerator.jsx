import React from "react";

export default function AIImageGenerator({
  prompt,
  isGenerating,
  generatedImage,
  onPromptChange,
  onGenerate,
  onApply,
  onCancel,
}) {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700">Generate via AI</h3>

      <textarea
        className="w-full border rounded p-2 mt-2"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Describe your idea"
        rows={3}
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={generatedImage ? onApply : onGenerate}
          disabled={isGenerating}
          className={`px-4 py-2 rounded text-white transition ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#752650] hover:bg-gray-200 hover:text-black"
          }`}
        >
          {isGenerating ? "Generating..." : generatedImage ? "Apply" : "Generate"}
        </button>

        <button
          onClick={onCancel}
          className="border px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          Cancel
        </button>
      </div>

      {generatedImage && (
        <img
          src={generatedImage}
          alt="Generated"
          className="w-full mt-3 rounded border"
        />
      )}
    </div>
  );
}
