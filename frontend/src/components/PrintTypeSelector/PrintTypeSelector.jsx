import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function PrintTypeSelector({
  selectedPrintType,
  onChange,
  printTypes = [],
}) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(selectedPrintType);

  return (
    <div className="bg-white rounded-md overflow-hidden border shadow-sm">
      <table className="table-auto w-full text-sm">
        <tbody>
          <tr
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer bg-white hover:bg-gray-100 border-b border-gray-200"
          >
            <td className="px-3 py-2 font-semibold text-gray-700">
              Print Type
              <br />
              <span className="text-xs text-gray-500">{selectedPrintType}</span>
            </td>
            <td className="px-3 py-2 flex justify-end">
              <ChevronRightIcon
                className={`w-5 h-5 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="p-0">
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 px-3 py-3 border-t border-gray-200 space-y-2">
                  {printTypes.map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center p-2 bg-white border rounded hover:bg-gray-100"
                    >
                      <p>{item}</p>

                      <input
                        type="radio"
                        name="printType"
                        value={item}
                        checked={temp === item}
                        onChange={() => setTemp(item)}
                        className="accent-[#4598e2]"
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
                        setTemp(selectedPrintType);
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
