import React, { useState, useEffect } from "react";
import noUiSlider from "nouislider";
import * as THREE from "three";
import "nouislider/dist/nouislider.css";

export default function FrameCustomizer() {
    const [matBorder, setMatBorder] = useState(0); // default mat = 0
    const [matColor, setMatColor] = useState("rgb(33,33,33)"); // black as default
    // Initialize noUiSlider
useEffect(() => {
    const slider = document.getElementById("new_mat_slider");

    if (slider?.noUiSlider) {
        slider.noUiSlider.destroy();
    }

    if (slider) {
        noUiSlider.create(slider, {
            start: [matBorder],
            connect: "lower",
            range: { min: 0, max: 6 },
            step: 1,
            tooltips: {
                to: (value) => `${Math.round(value)}" Mat`,
                from: (value) => Number(value.replace('" Mat', "")),
            },
        });

        slider.noUiSlider.on("update", (values, handle) => {
            const newVal = Number(values[handle].replace('" Mat', ""));
            setMatBorder(newVal);

            // ✅ Update 3D mat + photo scaling
            if (window.__updateMatScale) {
                window.__updateMatScale(newVal);
            }
        });
    }

    return () => {
        if (slider?.noUiSlider) slider.noUiSlider.destroy();
    };
}, []);


    // Update mat, media, and scene dynamically
   // ✅ Update mat scale inside GLB model directly
  useEffect(() => {
    if (window.__updateMatScale) {
      window.__updateMatScale(matBorder);
    }
  }, [matBorder]);

    const colors = [
        { name: "Mat color: Black", value: "rgb(33,33,33)" },
        { name: "Mat color: White", value: "rgb(255,255,255)" },
        { name: "Mat color: Off white", value: "rgb(255, 254, 227)" },

        // Add more if needed
    ];

    // Change mat color on click (affects both UI and GLB model)
    const handleColorChange = (colorValue) => {
        setMatColor(colorValue);

        // ✅ Change mesh color inside the loaded GLB model
        if (window.__frameModel) {
            window.__frameModel.traverse((child) => {
                if (
                    child.isMesh &&
                    ["First_Mat_top", "First_Mat_bottom", "First_Mat_left", "First_Mat_right"].includes(child.name)
                ) {
                    child.material.color.set(new THREE.Color(colorValue));
                }
            });
        }
    };
    return (
        <div>
            {/* Slider with 50% width, left-aligned */}
            <div
                id="new_mat_slider"
                style={{
                    marginTop: "30px",
                    marginBottom: "20px",
                    marginLeft: 0,
                }}
            ></div>
            {/* Mat color buttons */}
            <label className="block text-gray-700 font-semibold mb-1">Mat Color</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {colors.map((c) => (
                    <button
                        key={c.name}
                        title={c.name}
                        onClick={() => handleColorChange(c.value)}
                        style={{
                            width: "35px",
                            height: "35px",
                            border:
                                matColor === c.value
                                    ? "3px solid #4598e2"
                                    : "1px solid #ccc",
                            backgroundColor: c.value,
                            cursor: "pointer",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
