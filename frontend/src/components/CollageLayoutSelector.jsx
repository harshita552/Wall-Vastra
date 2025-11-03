import React, { useRef, useState } from "react";
import { ChevronRightIcon, InformationCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Frame3D from "./Frame3D.jsx";
import FrameCustomizer from "./FrameWithControls.jsx";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage.js"; // we’ll define this helper
import * as THREE from "three";

const CollageLayoutSelector = ({ onSelectLayout }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [service, setService] = useState("");
    const [image, setImage] = useState(null);
    const [openMatRow, setOpenMatRow] = useState(false);
    const [selectedService, setSelectedService] = React.useState("printAndFrame");
    const [showTooltip, setShowTooltip] = useState(false);
    const fileInputRef = useRef(null); // ✅ Create ref for file input
    const [selectedMatStyle, setSelectedMatStyle] = useState("No Mat");
    const [tempMatSelection, setTempMatSelection] = useState("No Mat");
    const handleFrameSelect = (textureUrl) => {
        setFrameColor(textureUrl);

        // 🔗 Update the 3D model instantly (if loaded)
        if (window.__frameModel) {
            window.__frameModel.traverse((child) => {
                if (child.isMesh && child.name === "FRAME_TOP") {
                    const texture = new THREE.TextureLoader().load(textureUrl);
                    texture.flipY = false;
                    texture.colorSpace = THREE.SRGBColorSpace;

                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
            });
        }
    };

    const matOptions = [
        { title: "No Mat", desc: "No mat applied to the frame." },
        { title: "Single Mat", desc: "Single mat for a classic look." },
        { title: "Single Mat + Double Mat", desc: "Layered mat for depth." },
        { title: "Island", desc: "Floating mat for modern style." },
    ];

    const frameOptions = [
        {
            name: "Black Maple",
            desc: "Hard to go wrong with this versatile and timeless profile. This smooth, satin finished frame pairs well with almost any artwork or photograph.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/black-maple2-swatch.jpg"
        },
        {
            name: "White Maple",
            desc: "Another classic found in many homes. With its smooth, satin finish, this profile is perfect for a contemporary look or to enhance vibrant colors.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/white-maple4-swatch.jpg"
        },
        {
            name: "Natural Maple",
            desc: "This blonde shade of maple with natural grain is a perfect choice for adding a pop of color that is still soft on the eyes.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-maple2-swatch.jpg"
        },
        {
            name: "Natural Walnut",
            desc: "A rich medium-dark wood tone that is versatile enough for a range of decor styles, from modern to bohemian.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-walnut-swatch.jpg"
        },
        {
            name: "Weathered Black",
            desc: "Dark, midnight hues wash over but do not fully hide the wood grain in this rougher take on a modern black frame.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/weathered-black-swatch.jpg"
        },
        {
            name: "Weathered Grey",
            desc: "The texture and finish evoke an old barn aesthetic, while the slimmer shape of this profile adds a modern twist.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/weathered-grey-swatch.jpg"
        },
        {
            name: "Weathered Natural",
            desc: "The sandy color and wide lines of the grain in this profile bring to mind a beach house or remote cabin feel.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/weathered-natural-swatch.jpg"
        },
        {
            name: "Academie Black",
            desc: "The gold trim creates a lavish contrast to the darker base, creating a dressed up version of our Gallery Black profile.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/academie-black-swatch.jpg"
        },
        {
            name: "Academie Gold",
            desc: "A vintage profile that will stand out in any space with its elegant contours, gold finish and subtle flecks.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/academie-gold-swatch.jpg"
        },
        {
            name: "Academie Silver",
            desc: "A silver, champagne profile perfect for classing up extra special artwork and moments caught on camera.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/academie-silver-swatch.jpg"
        },
        {
            name: "Kota Pecan",
            desc: "The golden pecan stain over a fine wood grain makes this frame timeless and versatile.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/kota-pecan-swatch.jpg"
        },
        {
            name: "Kota Cherry",
            desc: "The deep cherry stain over a fine wood grain makes this frame timeless and versatile.",
            src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/kota-cherry-swatch.jpg"
        }
    ];

    // Art Type selection
    const [openRow, setOpenRow] = useState(false);
    const [selectedArtType, setSelectedArtType] = useState("Photo Print");
    const [tempSelection, setTempSelection] = useState("Photo Print");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [floatType, setFloatType] = useState("none");

    const toggleAdvanced = () => setAdvancedOpen(!advancedOpen);
    // Canvas edge selection
    const [canvasEdge, setCanvasEdge] = useState("wrap-sides");

    // Frame thickness (for frame-only)
    const [frameThickness, setFrameThickness] = useState(1); // default 40px
    const [frameColor, setFrameColor] = useState("#faf4d0ff"); // default color
    // 🧱 Add these new states at the top
    const [matValues, setMatValues] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    const [matBorder, setMatBorder] = useState(0);
    const [matStyle, setMatStyle] = useState("none");

    const artOptions = [
        {
            title: "Photo Print",
            desc: 'Photos print best at 300 DPI. Max print size 42" × 72", up to 800MB.',
        },
        {
            title: "Canvas Print",
            desc: 'Digital image printed on canvas. Max print size 40" × 60", up to 800MB.',
        },
    ];
    const [selectedFile, setSelectedFile] = useState(null);
    const [openDimensions, setOpenDimensions] = useState(false);
    const [artWidth, setArtWidth] = useState(8);     // default width in inches
    const [artHeight, setArtHeight] = useState(10);  // default height in inches
    const [appliedDimensions, setAppliedDimensions] = useState({
        width: 8,   // default width in inches
        height: 10, // default height in inches
    });

    const toggleRow = () => setOpenRow(!openRow);
    const applySelection = () => {
        setSelectedArtType(tempSelection);
        setOpenRow(false);
    };

    const cancelSelection = () => {
        setTempSelection(selectedArtType);
        setOpenRow(false);
    };

    const handleServiceChange = (e) => setService(e.target.value);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const [openAISection, setOpenAISection] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate AI image generation (replace with your API call)
        setTimeout(() => {
            setGeneratedImage("https://picsum.photos/500/300?random=" + Date.now());
            setIsGenerating(false);
        }, 1500);
    };

    const handleApply = () => {
        alert("AI-generated image applied successfully!");
        setOpenAISection(false);
    };

    const handleCancel = () => {
        setPrompt("");
        setGeneratedImage(null);
        setOpenAISection(false);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPos.x;
        const deltaY = e.clientY - lastPos.y;
        setLastPos({ x: e.clientX, y: e.clientY });
        setRotation((prev) => ({
            x: prev.x + deltaY * 0.5,
            y: prev.y - deltaX * 0.5,
        }));
    };

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [lockAspect, setLockAspect] = useState(true);
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Glass Type states
    const [openGlassRow, setOpenGlassRow] = useState(false);
    const [selectedGlassType, setSelectedGlassType] = useState("");
    const [tempGlassSelection, setTempGlassSelection] = useState("");

    // Apply and Cancel handlers
    const applyGlassSelection = () => {
        setSelectedGlassType(tempGlassSelection);
        setOpenGlassRow(false);
    };

    const cancelGlassSelection = () => {
        setTempGlassSelection(selectedGlassType);
        setOpenGlassRow(false);
    };

    const tooltipText = `
Sandwich - Artwork sits on top of the mat to reveal its edges. The acrylic glaze presses against the art, keeping it smooth and flat.
Elevated - Artwork is mounted to archival foamboard and floated 1/8" above the mat, creating a small shadow. 1/4" spacers inside the frame create an air gap between the artwork and glaze.)
  `;

    const updatePhotoScale = (width, height) => {
        const frameModel = window.__frameModel; // Use whole frame instead of just photo
        if (frameModel) {
            const baseWidth = 8; // base width reference
            const baseHeight = 10; // base height reference

            const scaleX = width / baseWidth;
            const scaleY = height / baseHeight;

            // Scale the entire frame proportionally (including mats + borders)
            frameModel.scale.set(scaleX, scaleY, scaleX);
        } else {
            console.warn("Frame model not found yet.");
        }
    };

    const handleApplyCrop = async () => {
        if (!selectedFile || !croppedAreaPixels) return;

        // pass true to flip horizontally
        const croppedImageUrl = await getCroppedImg(
            URL.createObjectURL(selectedFile),
            croppedAreaPixels,
            true // 👈 flip horizontally
        );

        const texture = new THREE.TextureLoader().load(croppedImageUrl);
        texture.flipY = false;

        if (window.__photoMesh) {
            window.__photoMesh.material.map = texture;
            window.__photoMesh.material.needsUpdate = true;
        }
    };

    const [matWidth, setMatWidth] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    const handleMatChange = (side, value) => {
        const numericValue = parseFloat(value) || 0;

        // if all mats are 0 → hide mat
        const allZero = Object.values(matValues).every((v) => v === 0);

        if (allZero && numericValue > 0) {
            // user increased first mat → switch to single mat
            setMatValues({ top: 1, bottom: 1, left: 1, right: 1 });
            setMatStyle("single");
        } else {
            setMatValues((prev) => ({ ...prev, [side]: numericValue }));
        }
    };
    return (
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-screen container mx-0 max-w-full">
            {/* Left Column - Frame Preview */}
            <div
                className="w-full lg:w-10/12 bg-gray-100 flex justify-center items-center p-2 perspective-1000 left-frame lg:static fixed top-0 z-20"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <Frame3D
                    rotation={rotation}
                    image={image}
                    artType={tempSelection}
                    canvasEdge={canvasEdge}
                    frameThickness={frameThickness}
                    frameColor={frameColor}
                    frameTexture={frameColor}
                    matBorder={matBorder}
                    selectedMatStyle={openMatRow ? tempMatSelection : selectedMatStyle}
                    artWidth={artWidth}
                    artHeight={artHeight}
                    floatType={floatType}
                />
            </div>

            {/* Right Column - Controls */}
            <div className="w-full lg:w-5/12 bg-white p-4 space-y-4 flex flex-col overflow-y-auto pb-4 scrollable-panel
                           mt-[400px] lg:mt-0 h-[calc(100vh-480px)] lg:h-screen">
                <div className="flex-1 space-y-4">

                    {/* WHAT ARE YOU FRAMING */}
                    <div className="mb-4 w-full relative">
                        <label className="block text-gray-700 font-semibold mb-1">
                            What are you framing?
                        </label>

                        <div className="relative">
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4598e2] focus:border-[#4598e2]"
                            >
                                <option value="default">Please select</option>
                                <option value="digitalPhoto">Digital Photo</option>
                                <option value="artworkOnly">My Artwork (Frame only)</option>
                                <option value="generateAI">Generate via AI</option>
                            </select>

                            {/* Tooltip / Description */}
                            {showTooltip && selectedService !== "default" && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedService === "digitalPhoto" &&
                                        "For digital photos/art that need to be printed and framed."}
                                    {selectedService === "myArtwork" &&
                                        "For existing artwork that needs a frame."}
                                    {selectedService === "generateAI" &&
                                        "Generate an artwork via AI to frame."}
                                </p>
                            )}
                        </div>

                        {/* WhatsApp help message */}
                        <p className="text-sm text-gray-500 mt-1">
                            Choose an option to continue or{" "}
                            <a
                                href={`https://wa.me/919899354550?text=${encodeURIComponent(
                                    "Hi Team Wall Vastra, I have a query regarding frame customization. Kindly call me back to assist."
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#25D366] underline font-medium"
                            >
                                WhatsApp us
                            </a>{" "}
                            if you have any questions
                        </p>
                    </div>

                    {/* Show upload section only when Digital Photo is selected */}
                    {selectedService === "digitalPhoto" && (
                        <div className="mt-4 py-4 shadow-sm">
                            <p className="text-gray-700 font-medium mb-2">
                                Great! Upload your photo and then choose a size.{" "}
                                <button
                                    onClick={() => alert("Explain how it works here or open a modal")}
                                    className="text-[#4598e2] underline hover:text-[#346fa9] ml-1"
                                >
                                    How it works
                                </button>
                            </p>

                            <button
                                className="text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors bg-[#752650] hover:bg-gray-200 hover:text-black"
                                onClick={() => console.log("Select Photo clicked")}
                            >
                                Select Photo
                            </button>
                        </div>
                    )}

                    {/* Art Type Card */}
                    {/* Show Art Type only for Print and Frame or Studio Mail-in */}
                    {selectedService && selectedService !== "" && (
                        <div className="bg-white rounded-md overflow-hidden transition-all duration-500 mt-4">
                            <table className="table-auto w-full text-sm">
                                <tbody>
                                    <tr
                                        onClick={() => setOpenRow(!openRow)}
                                        className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200"
                                    >
                                        <td className="px-2 py-2 text-gray-700 font-semibold">
                                            Art Type
                                        </td>
                                        <td className="px-2 py-2 flex justify-end">
                                            <div className="w-5"> {/* fixed width wrapper */}
                                                <ChevronRightIcon
                                                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openRow ? "rotate-90" : ""}`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="p-0">
                                            <div className={`transition-all duration-500 overflow-hidden ${openRow ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                                                <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                                                    {artOptions.map((item) => (
                                                        <div key={item.title} className="flex items-center justify-between p-2 border rounded mb-2">
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{item.title}</p>
                                                                <p className="text-gray-500 text-xs">{item.desc}</p>
                                                            </div>
                                                            <input
                                                                type="radio"
                                                                name="artType"
                                                                value={item.title}
                                                                checked={tempSelection === item.title}
                                                                onChange={(e) => setTempSelection(e.target.value)}
                                                                className="accent-[#4598e2] w-4 h-4"
                                                            />
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between mt-2">
                                                        <button
                                                            onClick={applySelection}
                                                            className="text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors bg-[#752650] hover:bg-gray-200 hover:text-black"
                                                        >
                                                            APPLY
                                                        </button>
                                                        <button
                                                            onClick={cancelSelection}
                                                            className="border border-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto  hover:bg-black hover:text-white"
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
                    )}

                    {/* Art Dimensions Card */}
                    <div className="bg-white rounded-md overflow-hidden transition-all duration-500 mt-4">
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr
                                    onClick={() => setOpenDimensions(!openDimensions)}
                                    className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200"
                                >
                                    <td className="px-2 py-2 text-gray-700 font-semibold">Art Dimensions</td>
                                    <td className="px-2 py-2 flex justify-end">
                                        <ChevronRightIcon
                                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openDimensions ? "rotate-90" : ""
                                                }`}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan={2} className="p-0">
                                        <div
                                            className={`transition-all duration-500 overflow-hidden ${openDimensions ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-3">
                                                {/* Aspect Ratio Lock */}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="lockAspect"
                                                        checked={lockAspect}
                                                        onChange={() => setLockAspect(!lockAspect)}
                                                    />
                                                    <label htmlFor="lockAspect" className="text-sm text-gray-700 font-medium">
                                                        Lock aspect ratio
                                                    </label>
                                                </div>

                                                {/* Width & Height */}
                                                <div className="flex flex-wrap gap-4">
                                                    {/* Width */}
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-gray-700 font-semibold">Width (in)</label>
                                                        <input
                                                            type="number"
                                                            value={artWidth}
                                                            min={1}
                                                            max={72}
                                                            onChange={(e) => {
                                                                const newWidth = parseFloat(e.target.value);
                                                                if (!newWidth || newWidth <= 0) return;

                                                                if (lockAspect && artHeight > 0) {
                                                                    const aspect = artWidth / artHeight;
                                                                    const newHeight = newWidth / aspect;
                                                                    setArtHeight(Number(newHeight.toFixed(2)));
                                                                    updatePhotoScale(newWidth, newHeight);
                                                                } else {
                                                                    setArtWidth(newWidth);
                                                                    updatePhotoScale(newWidth, artHeight);
                                                                }
                                                                setArtWidth(newWidth);
                                                            }}
                                                            className="border rounded p-1 w-20"
                                                        />
                                                    </div>

                                                    {/* Height */}
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-gray-700 font-semibold">Height (in)</label>
                                                        <input
                                                            type="number"
                                                            value={artHeight}
                                                            min={1}
                                                            max={72}
                                                            onChange={(e) => {
                                                                const newHeight = parseFloat(e.target.value);
                                                                if (!newHeight || newHeight <= 0) return;

                                                                if (lockAspect && artWidth > 0) {
                                                                    const aspect = artWidth / artHeight;
                                                                    const newWidth = newHeight * aspect;
                                                                    setArtWidth(Number(newWidth.toFixed(2)));
                                                                    updatePhotoScale(newWidth, newHeight);
                                                                } else {
                                                                    setArtHeight(newHeight);
                                                                    updatePhotoScale(artWidth, newHeight);
                                                                }
                                                                setArtHeight(newHeight);
                                                            }}
                                                            className="border rounded p-1 w-20"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Calculated dimensions */}
                                                <div className="text-gray-700 text-sm space-y-1 mt-2">
                                                    <p>
                                                        <span className="font-semibold">Frame interior:</span>{" "}
                                                        {(artWidth + 3).toFixed(2)} × {(artHeight + 3).toFixed(2)} in
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Frame exterior:</span>{" "}
                                                        {(artWidth + 3.875).toFixed(2)} × {(artHeight + 3.875).toFixed(2)} in
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Paper dimensions:</span>{" "}
                                                        {artWidth} × {artHeight} in
                                                    </p>
                                                </div>

                                                {/* Apply / Cancel */}
                                                <div className="flex justify-between mt-3">
                                                    <button
                                                        onClick={() => {
                                                            setAppliedDimensions({ width: artWidth, height: artHeight });
                                                            setOpenDimensions(false);
                                                            updatePhotoScale(artWidth, artHeight); // ✅ keep this
                                                        }}

                                                        className="text-white bg-[#752650] hover:bg-gray-200 hover:text-black px-4 py-2 transition"
                                                    >
                                                        APPLY
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setArtWidth(appliedDimensions.width);
                                                            setArtHeight(appliedDimensions.height);
                                                            setOpenDimensions(false);
                                                            updatePhotoScale(appliedDimensions.width, appliedDimensions.height);
                                                        }}

                                                        className="border border-gray-400 px-4 py-2 rounded hover:bg-black hover:text-white transition"
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

                    {/* 4. UPLOAD / GENERATE AI */}
                    {/* Show Upload / Generate AI only for Print and Frame */}
                    {selectedService === "printAndFrame" && (
                        <div className="flex gap-4">
                            {/* Upload */}
                            <div className="bg-white rounded-md border p-3 w-1/2">
                                <label className="font-semibold text-[#752650]">Upload Image</label>
                                <input
                                    ref={fileInputRef} // ✅ Attach ref
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="mt-2 w-full"
                                />

                                <p className="text-gray-700 mt-1">
                                    {selectedFile ? selectedFile.name : "Unspecified"}
                                </p>

                                {/* Buttons Section */}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleApplyCrop}
                                        disabled={!selectedFile}
                                        className={`text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors ${selectedFile
                                            ? "bg-[#752650] hover:bg-gray-100 hover:text-black"
                                            : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Apply
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // ✅ Clear selected file
                                            setSelectedFile(null);

                                            // ✅ Reset crop area if used
                                            setCroppedAreaPixels(null);

                                            // ✅ Clear the file input field itself
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }

                                            // ✅ Remove image texture from frame
                                            if (window.__photoMesh) {
                                                window.__photoMesh.material.map = null;
                                                window.__photoMesh.material.needsUpdate = true;
                                            }
                                        }}
                                        className="border border-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto  hover:bg-black hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {selectedFile && (
                                    <div className="relative w-full h-64 bg-gray-100 mt-3">
                                        <Cropper
                                            image={URL.createObjectURL(selectedFile)}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={undefined} // square by default — can adjust to artWidth/artHeight ratio
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* AI */}
                            <div className="bg-white rounded-md border p-3 w-1/2">
                                <label className="font-semibold text-[#752650]">Generate via AI</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your idea"
                                    className="w-full border rounded p-1 mt-2"
                                    rows="2"
                                />

                                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                    <button
                                        onClick={generatedImage ? handleApply : handleGenerate}
                                        disabled={isGenerating}
                                        className={`${isGenerating
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#752650] hover:bg-gray-100 hover:text-black"
                                            } text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors`}
                                    >
                                        {isGenerating
                                            ? "Generating..."
                                            : generatedImage
                                                ? "Apply"
                                                : "Generate"}
                                    </button>

                                    <button
                                        onClick={handleCancel}
                                        className="border border-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto  hover:bg-black hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {generatedImage && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600 mb-1">Generated Preview:</p>
                                        <img
                                            src={generatedImage}
                                            alt="Generated"
                                            className="w-full rounded border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 5. FRAME TYPE */}
                    <div className="bg-white rounded-md border p-3">
                        <label className="block text-gray-700 font-semibold mb-2">Frame Type</label>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {frameOptions.map(frame => (
                                <div
                                    key={frame.name}
                                    className="relative group cursor-pointer"
                                    onClick={() => handleFrameSelect(frame.src)}
                                >
                                    <img
                                        src={frame.src}
                                        alt={frame.name}
                                        className={`w-10 h-10 rounded border-2 object-cover ${frameColor === frame.src ? "border-black" : "border-gray-300"
                                            }`}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {frame.name}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {frameColor && frameOptions.find(f => f.src === frameColor) && (
                            <div className="mb-2 text-sm">
                                <p className="font-semibold">{frameOptions.find(f => f.src === frameColor).name}</p>
                                <p className="text-gray-600 text-xs">{frameOptions.find(f => f.src === frameColor).desc}</p>
                            </div>
                        )}


                        <p className="text-gray-700 text-sm mt-1">
                            ↳ with a{" "}
                            <select
                                value={frameThickness}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    console.log("📏 Dropdown changed to:", val);
                                    setFrameThickness(val);
                                }} className="inline-block w-20 px-1 py-1 text-gray-800 text-sm bg-white border border-gray-400 rounded text-center"
                            >
                                <option value="0.75">0.75"</option>
                                <option value="1">1"</option>
                                <option value="1.625">1.625"</option>
                            </select>{" "}
                            face and 1.125" depth.
                        </p>
                    </div>

                    {/* 6. MAT / BORDER */}
                    <div className="bg-white rounded-md overflow-hidden transition-all duration-500">
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                {/* Header row */}
                                <tr
                                    onClick={() => setOpenMatRow(!openMatRow)}
                                    className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200"
                                >
                                    <td className="px-2 py-2 text-gray-700 font-semibold">
                                        Mat Style <br />
                                        <span className="font-bold">{selectedMatStyle}</span>
                                    </td>
                                    <td className="px-4 py-2 flex justify-end">
                                        <div className="w-5">
                                            <ChevronRightIcon
                                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openMatRow ? "rotate-90" : ""
                                                    }`}
                                            />
                                        </div>
                                    </td>
                                </tr>

                                {/* Collapsible content */}
                                <tr>
                                    <td colSpan={2} className="p-0">
                                        <div
                                            className={`transition-all duration-500 overflow-hidden ${openMatRow ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                                                {/* Apply & Cancel Buttons */}
                                                <div className="flex justify-between mb-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMatStyle(tempMatSelection); // confirm selection
                                                            setOpenMatRow(false);
                                                        }}
                                                        className="text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors bg-[#752650] hover:bg-gray-100 hover:text-black"
                                                    >
                                                        APPLY
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setTempMatSelection(selectedMatStyle); // revert to previously confirmed selection
                                                            setOpenMatRow(false);
                                                        }}
                                                        className="border border-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto hover:bg-black hover:text-white"
                                                    >
                                                        CANCEL
                                                    </button>
                                                </div>



                                                {/* Mat Options */}
                                                {matOptions.map((item) => (
                                                    <div
                                                        key={item.title}
                                                        className="flex items-center justify-between p-2 bg-white hover:bg-gray-100 border rounded-md transition-colors"
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                                            <p className="text-gray-500 text-xs">{item.desc}</p>
                                                        </div>

                                                        <input
                                                            type="radio"
                                                            name="matStyle"
                                                            value={item.title}
                                                            checked={tempMatSelection === item.title}
                                                            onChange={(e) => setTempMatSelection(e.target.value)}
                                                            className="accent-[#4598e2] w-4 h-4 cursor-pointer"
                                                        />
                                                    </div>
                                                ))}


                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 7. MAT WIDTH SLIDER + ADVANCED OPTIONS */}
                    {selectedMatStyle !== "No Mat" && (
                        <div className="flex items-start gap-3 mt-3">
                            <div className="w-1/2">
                                <FrameCustomizer matBorder={matBorder} setMatBorder={setMatBorder} />
                            </div>

                        </div>
                    )}
                    {/* 8. MAT COLOR */}
                    {/* <div className="w-1/2 mt-2">
                        <label className="block text-gray-700 font-semibold mb-1">Customized Mat Color</label>
                        <input type="color" value={matColor} onChange={(e) => setMatColor(e.target.value)} className="w-full h-8 p-1 border rounded cursor-pointer" />
                    </div> */}
                    {/* 9. OUTER & INNER DIMENSIONS */}
                    <div className="text-gray-700 text-sm mt-2 space-y-1">
                        {/* <p><span className="font-semibold">Outer Dimensions:</span> {parseFloat(artWidth) + 3} × {parseFloat(artHeight) + 3} inches</p> */}
                        <p><span className="font-semibold">Outer dimensions:</span> {parseFloat(artWidth) + 3.875} × {parseFloat(artHeight) + 3.875} inches</p>
                        <p><span className="font-semibold">Paper dimensions:</span> {artWidth} × {artHeight} inches</p>
                    </div>

                    {/* 10. ADD TO CART BUTTON */}
                    <div className="flex gap-2 mt-2">
                        <button className="w-full bg-[#752650] text-white px-4 py-2.5 hover:bg-gray-100 hover:text-black transition-colors flex items-center justify-between ">

                            {/* Left: Icon + Text */}
                            <span className="flex items-center gap-1.5">
                                <ShoppingCartIcon className="w-4 h-4" />
                                Add to Cart
                            </span>
                            {/* Right: Price */}
                            <span className="font-semibold text-sm">$120</span>
                        </button>
                    </div>

                    <div className="w-1/2 flex items-center">
                        <button onClick={toggleAdvanced} className="w-full border border-gray-400 text-blue-600 py-2 px-3 rounded hover:bg-gray-100 flex justify-between items-center transition-colors">
                            Advanced Options
                            <span className="ml-2 text-xl">{advancedOpen ? "-" : "+"}</span>
                        </button>
                    </div>

                    {/* 11. ADVANCED OPTIONS SECTION */}
                    {advancedOpen && (
                        <div className="mt-3 space-y-4 p-4 border rounded-lg">
                            {/* A. Advanced Mat Width */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Advanced Mat Width</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {["top", "bottom", "left", "right"].map((side) => (
                                        <div key={side}>
                                            <fieldset className="p-2">
                                                <legend className="text-sm font-medium text-gray-700 capitalize">
                                                    {side}
                                                </legend>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    min="0"
                                                    value={matValues[side]}
                                                    onChange={(e) => handleMatChange(side, e.target.value)}
                                                    className="text-[#2563eb] w-full border rounded p-2 text-center"
                                                />
                                            </fieldset>
                                        </div>
                                    ))}
                                </div>

                            </div>


                            {/* B. Glass Type */}
                            <div className="bg-white rounded-md overflow-hidden transition-all duration-500 mt-4">
                                <table className="table-auto w-full text-sm">
                                    <tbody>
                                        {/* Glass Type Header Row */}
                                        <tr
                                            onClick={() => setOpenGlassRow(!openGlassRow)}
                                            className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200"
                                        >
                                            <td className=" text-gray-800 font-semibold">
                                                Glass Type
                                            </td>
                                            <td className="px-2 py-2 flex justify-end">
                                                <div className="w-5">
                                                    <ChevronRightIcon
                                                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openGlassRow ? "rotate-90" : ""
                                                            }`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expandable Content */}
                                        <tr>
                                            <td colSpan={2} className="p-0">
                                                <div
                                                    className={`transition-all duration-500 overflow-hidden ${openGlassRow ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                                                        }`}
                                                >
                                                    <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                                                        {[
                                                            {
                                                                title: "Simple Acrylic Glass",
                                                                desc: "Crystal clear but reflective.",
                                                            },
                                                            {
                                                                title: "Non-glare Acrylic Glass",
                                                                desc: "Diffuses light to reduce glare but may soften colors.",
                                                            },
                                                        ].map((item) => (
                                                            <div
                                                                key={item.title}
                                                                className="flex items-center justify-between p-2 border rounded mb-2"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                                                    <p className="text-gray-500 text-xs">{item.desc}</p>
                                                                </div>
                                                                <input
                                                                    type="radio"
                                                                    name="glassType"
                                                                    value={item.title}
                                                                    checked={selectedGlassType === item.title}
                                                                    onChange={(e) => setSelectedGlassType(e.target.value)}
                                                                    className="accent-[#4598e2] w-4 h-4"
                                                                />
                                                            </div>
                                                        ))}
                                                        {/* Info Note */}
                                                        <p className="text-xs text-gray-600 italic mt-3">
                                                            <span className="font-semibold text-[#4598e2]">Note:</span> Simple acrylic is crystal clear but reflective, while non-glare acrylic diffuses light to reduce glare but can soften colors of the art.
                                                        </p>
                                                        {/* Action Buttons */}
                                                        <div className="flex justify-between mt-3">
                                                            <button
                                                                onClick={applyGlassSelection}
                                                                className="text-white px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto transition-colors bg-[#752650] hover:bg-gray-200 hover:text-black"
                                                            >
                                                                APPLY
                                                            </button>
                                                            <button
                                                                onClick={cancelGlassSelection}
                                                                className="border border-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 text-base md:text-lg lg:text-xl w-full sm:w-auto  hover:bg-black hover:text-white"                                                            >
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
                            {/* C. Float Type */}
                            <div className="relative">
                                <div className="flex items-center gap-2 relative">
                                    <h3 className="font-semibold text-gray-800">Float Type</h3>
                                    <InformationCircleIcon
                                        className="w-5 h-5 text-blue-500 cursor-pointer"
                                        onMouseEnter={() => setShowTooltip(true)}
                                        onMouseLeave={() => setShowTooltip(false)}
                                    />
                                    {showTooltip && (
                                        <div className="absolute left-0 top-full mt-1 w-80 p-3 bg-white border border-gray-300 rounded shadow-lg text-sm text-gray-800 z-50 whitespace-pre-line">
                                            {tooltipText}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-gray-700">
                                    {["None", "Sandwich", "Elevated"].map((option) => (
                                        <label key={option} className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="floatType"
                                                value={option.toLowerCase()}
                                                checked={floatType === option.toLowerCase()}
                                                onChange={(e) => setFloatType(e.target.value)}
                                                className="accent-blue-500"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollageLayoutSelector;
