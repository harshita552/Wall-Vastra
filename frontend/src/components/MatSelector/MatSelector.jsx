import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function MatSelector({ selectedMatStyle, onChange, matOptions = [] }) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(selectedMatStyle);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="bg-white rounded-md overflow-hidden border shadow-sm">
      <table className="table-auto w-full text-sm">
        <tbody>
          {/* Header */}
          <tr
            onClick={toggleOpen}
            className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200"
          >
            <td className="px-3 py-2 text-gray-700 font-semibold">
              Mat Style
              <br />
              <span className="text-xs text-gray-500">{selectedMatStyle}</span>
            </td>
            <td className="px-3 py-2 flex justify-end">
              <ChevronRightIcon
                className={`w-5 h-5 transition-transform duration-300 ${
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
                  open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 px-3 py-3 space-y-2 border-t border-gray-200">
                  {matOptions.map((item) => (
                    <div
                      key={item.title}
                      className="flex justify-between items-center bg-white border p-2 rounded hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>

                      <input
                        type="radio"
                        name="matStyle"
                        className="accent-[#4598e2] w-4 h-4"
                        value={item.title}
                        checked={temp === item.title}
                        onChange={() => setTemp(item.title)}
                      />
                    </div>
                  ))}

                  {/* Buttons */}
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => {
                        onChange(temp);
                        setOpen(false);
                      }}
                      className="bg-[#752650] text-white px-4 py-2 rounded hover:bg-gray-200 hover:text-black"
                    >
                      APPLY
                    </button>

                    <button
                      onClick={() => {
                        setTemp(selectedMatStyle);
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
