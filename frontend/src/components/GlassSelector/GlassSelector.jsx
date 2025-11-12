import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function GlassSelector({ selectedGlass, onChange, glassOptions = [] }) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(selectedGlass);

  return (
    <div className="bg-white rounded-md overflow-hidden border shadow-sm">
      <table className="table-auto w-full text-sm">
        <tbody>
          <tr
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer bg-white hover:bg-gray-100 border-b border-gray-200"
          >
            <td className="px-3 py-2 text-gray-700 font-semibold">
              Glass Type
              <br />
              <span className="text-xs text-gray-500">{selectedGlass}</span>
            </td>

            <td className="px-3 py-2 flex justify-end">
              <ChevronRightIcon
                className={`w-5 h-5 transition-transform ${open ? "rotate-90" : ""}`}
              />
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="p-0">
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                  {glassOptions.map((item) => (
                    <div
                      key={item.title}
                      className="flex justify-between items-center p-2 border bg-white rounded hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>

                      <input
                        type="radio"
                        name="glass"
                        value={item.title}
                        checked={temp === item.title}
                        onChange={() => setTemp(item.title)}
                        className="accent-[#4598e2] w-4 h-4"
                      />
                    </div>
                  ))}

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
                        setTemp(selectedGlass);
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
