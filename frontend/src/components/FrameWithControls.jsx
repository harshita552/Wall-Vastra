import React, { useState, useEffect } from "react";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

export default function FrameCustomizer() {
    const [matBorder, setMatBorder] = useState(0); // default mat = 0
    const [matColor, setMatColor] = useState("rgb(255,255,255)");

    // Initialize noUiSlider
    useEffect(() => {
        const slider = document.getElementById("new_mat_slider");
        if (slider && !slider.noUiSlider) {
            noUiSlider.create(slider, {
                start: matBorder,
                connect: "lower",
                range: { min: 0, max: 6 },
                step: 1,
                tooltips: true,
                format: {
                    to: (value) => `${Math.round(value)}" Mat`,
                    from: (value) => Number(value.replace('" Mat', "")),
                },
            });

            slider.noUiSlider.on("update", (values, handle) => {
                const newVal = Number(values[handle].replace('" Mat', ""));
                setMatBorder(newVal);
            });
        }
    }, []);

    // Update mat, media, and scene dynamically
    useEffect(() => {
        const frame = document.querySelector(".frame");
        const frameMat = frame?.querySelector(".frame-mat");
        const frameMedia = frame?.querySelector(".frame-media");
        const scene = document.getElementById("scene");

        const matPx = matBorder * 20; // scale mat for visual impact

        if (scene) {
            const baseWidth = 450;
            const baseHeight = 480;
            scene.style.width = `${baseWidth + matPx}px`;
            scene.style.height = `${baseHeight + matPx}px`;
        }

        if (frameMat) {
            frameMat.style.display = matBorder === 0 ? "none" : "block";
            frame.style.setProperty("--mat-border", `${matPx}px`);
        }

        if (frameMedia) {
            frameMedia.style.width = `calc(100% - ${matPx * 2}px)`;
            frameMedia.style.height = `calc(100% - ${matPx * 2}px)`;
        }
    }, [matBorder]);

    const colors = [
        { name: "White", value: "rgb(255,255,255)" },
        { name: "Black", value: "rgb(33,33,33)" },
        { name: "Beige", value: "rgb(245,245,220)" },
        { name: "Gray", value: "rgb(200,200,200)" },
        { name: "Ivory", value: "rgb(255,255,240)" },
        { name: "Charcoal", value: "rgb(54,54,54)" },
    ];

    const handleColorChange = (colorValue) => {
        setMatColor(colorValue);
        const frameBacking = document.querySelector(".frame-backing");
        if (frameBacking) frameBacking.style.backgroundColor = colorValue;
    };

    return (
        <div>
            {/* Slider with 50% width, left-aligned */}
            <div
                id="new_mat_slider"
                style={{
                    // width: "50%",
                    marginBottom: "20px",
                    marginLeft: 0,
                }}
            ></div>

            {/* Mat color buttons */}
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
