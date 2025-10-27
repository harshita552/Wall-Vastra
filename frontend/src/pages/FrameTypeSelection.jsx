// src/pages/FrameTypeSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function FrameTypeSelection() {
    const navigate = useNavigate();

    const frameOptions = [
        {
            id: 1,
            name: "Single Frame",
            imageUrl:
                "https://images.pexels.com/photos/2098456/pexels-photo-2098456.jpeg",
            description:
                "Personalize your photos, art prints, posters, or any artwork. Choose this option if you have just one frame to customize.",
        },
        {
            id: 2,
            name: "Gallery Frames",
            imageUrl:
                "https://images.pexels.com/photos/2098456/pexels-photo-2098456.jpeg",
            description:
                "Transform any room in your home with a stunning gallery wall. This option lets you choose from our curated wall gallery templates and customize each frame to suit your style.",
        },
        {
            id: 3,
            name: "Collage Frame",
            imageUrl:
                "https://images.pexels.com/photos/2098456/pexels-photo-2098456.jpeg",
            description:
                "Tell your story with a custom collage frame. Pick a layout, upload your photos, and we’ll print and frame them—each beautifully set in its own mat window.",
        },
    ];

    const handleSelect = (optionName) => {
        console.log(`Selected: ${optionName}`);
        navigate("/layout"); // Update route if needed
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 md:px-8 ">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                What would you like to customise?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
                Choose below or{" "}
                <a
                    href="https://wa.me/919899354550?text=Hi%20Team%20Wall%20Vastra,%20I%20am%20looking%20to%20customize%20my%20wall%20art.%20I%20am%20uncertain%20on%20a%20few%20things,%20requesting%20a%20call%20back."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-medium underline"
                >
                    WhatsApp us
                </a>{" "}
                if you have questions.
            </p>

            {/* Cards container */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
                {frameOptions.map((option) => (
                    <div key={option.id} className="flex justify-center w-full">
                        {/* Frame card */}
                        <div
                            className="group cursor-pointer bg-gray-100 rounded-lg p-5 flex flex-col justify-between items-center w-full max-w-sm h-[420px] shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                            onClick={() => handleSelect(option.name)}
                        >
                            {/* Image */}
                            <div className="bg-gray-200 w-full h-52 rounded-lg border border-gray-300 overflow-hidden flex justify-center items-center">
                                <div className="w-full h-full bg-white border-2 border-gray-300 shadow-inner flex justify-center items-center">
                                    <img
                                        src={option.imageUrl}
                                        alt={option.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Heading */}
                            <h5 className="text-gray-800 font-semibold text-lg mt-4 text-center">
                                {option.name}
                            </h5>

                            {/* Short description */}
                            <p className="text-gray-600 text-sm text-center mt-1">
                                {option.description}
                            </p>

                            {/* Select button */}
                            <button
                                className="mt-4 bg-gray-300 text-gray-800 px-6 py-2 font-medium
                                           hover:bg-gray-500 hover:text-white transition-opacity 
                                           md:opacity-0 md:group-hover:opacity-100"
                            >
                                Select
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
