import { useFrameStore } from "../../store/useFrameStore";

export default function FrameSelector() {
  // safe default: [] if undefined
  const frameOptions = useFrameStore(s => s.frameOptions || []);
  const setFrameColor = useFrameStore(s => s.setFrameColor);
  const frameColor = useFrameStore(s => s.frameColor);

  return (
    <div className="bg-white p-3 rounded-md shadow-sm border">
      <h3 className="font-semibold mb-2">Frame Type</h3>

      {frameOptions.length === 0 && (
        <p className="text-gray-500 text-sm">No frames available</p>
      )}

      <div className="flex flex-wrap gap-2">
        {frameOptions.map(frame => (
          <div
            key={frame.name}
            className="relative cursor-pointer"
            onClick={() => setFrameColor(frame.src)}
          >
            <img
              src={frame.src}
              alt={frame.name}
              className={`w-12 h-12 rounded border ${
                frameColor === frame.src ? "border-[#752650]" : "border-gray-300"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
