import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useFrameStore } from "../../store/useFrameStore";

export default function ArtTypeSelector() {
  const artType = useFrameStore((s) => s.artType);
  const setArtType = useFrameStore((s) => s.setArtType);

  const artOptions = useFrameStore((s) => s.artOptions ?? [
    { title: "Photo Print", desc: "High quality photo printing" },
    { title: "Canvas Print", desc: "Printed on canvas" },
  ]);

  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(artType);

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm border">
      <table className="table-auto w-full text-sm">
        <tbody>
          <tr
            onClick={() => setOpen(!open)}
            className="cursor-pointer bg-white hover:bg-gray-100 border-b border-gray-200"
          >
            <td className="px-3 py-2 text-gray-700 font-semibold">
              Art Type
              <br />
              <span className="text-xs text-gray-500">{artType}</span>
            </td>
            <td className="px-3 py-2 flex justify-end">
              <ChevronRightIcon
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </td>
          </tr>

          {/* Dropdown */}
          <tr>
            <td colSpan={2} className="p-0">
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  open ? "max-h-[400px]" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 px-3 py-3 space-y-2 border-t border-gray-200">
                  {artOptions.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between p-2 border rounded bg-white hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-xs">{item.desc}</p>
                      </div>

                      <input
                        type="radio"
                        name="artType"
                        value={item.title}
                        checked={temp === item.title}
                        onChange={() => setTemp(item.title)}
                        className="accent-[#4598e2] w-4 h-4"
                      />
                    </div>
                  ))}

                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => {
                        setArtType(temp);
                        setOpen(false);
                      }}
                      className="bg-[#752650] text-white px-4 py-2 rounded hover:bg-gray-200 hover:text-black"
                    >
                      APPLY
                    </button>

                    <button
                      onClick={() => {
                        setTemp(artType);
                        setOpen(false);
                      }}
                      className="border px-4 py-2 rounded hover:bg-black hover:text-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
