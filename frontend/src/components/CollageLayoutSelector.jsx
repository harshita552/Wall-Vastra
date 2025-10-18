// src/components/CollageLayoutSelector.jsx
import React, { useRef, useState } from "react";
import { ChevronRightIcon, ArrowUpOnSquareIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Frame3D from "./Frame3D.jsx";
import FrameCustomizer from "./FrameWithControls.jsx";

const CollageLayoutSelector = ({ onSelectLayout }) => {
    const frameRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [service, setService] = useState("");
    const [image, setImage] = useState(null);
    const [openMatRow, setOpenMatRow] = useState(false);
    const [selectedService, setSelectedService] = React.useState("printAndFrame");
    const [showTooltip, setShowTooltip] = useState(false);


    const [selectedMatStyle, setSelectedMatStyle] = useState("No Mat");
    const [tempMatSelection, setTempMatSelection] = useState(selectedMatStyle);

    const matOptions = [
        { title: "No Mat", desc: "No mat applied to the frame." },
        { title: "Single Mat", desc: "Single mat for a classic look." },
        { title: "Single Mat + Double Mat", desc: "Layered mat for depth." },
        { title: "Island", desc: "Floating mat for modern style." },
    ];

    // Handlers
    const toggleMatRow = () => setOpenMatRow(!openMatRow);
    const applyMatSelection = () => {
        setSelectedMatStyle(tempMatSelection);
        setOpenMatRow(false);
    };
    const cancelMatSelection = () => {
        setTempMatSelection(selectedMatStyle);
        setOpenMatRow(false);
    };

    // Art Type selection
    const [openRow, setOpenRow] = useState(false);
    const [selectedArtType, setSelectedArtType] = useState("Photo Print");
    const [tempSelection, setTempSelection] = useState("Photo Print");
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const toggleAdvanced = () => setAdvancedOpen(!advancedOpen);
    // Canvas edge selection
    const [canvasEdge, setCanvasEdge] = useState("wrap-sides");

    // Frame thickness (for frame-only)
    const [frameThickness, setFrameThickness] = useState(20); // default 40px
    const [frameColor, setFrameColor] = useState("#faf4d0ff"); // default color

    const [matBorder, setMatBorder] = useState(30);

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

    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // hide after 2 sec
            })
            .catch((err) => console.error("Failed to copy!", err));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-screen">
            {/* Left Column - Frame Preview */}
            <div
                className="w-full lg:w-7/12 bg-gray-300 flex justify-center items-center p-6 perspective-1000"
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
                    matBorder={matBorder}
                />
            </div>

            {/* Right Column - Controls */}
            <div className="w-full lg:w-5/12 bg-white overflow-y-auto p-4 space-y-4">

                <div className="mb-4 w-full relative">
                    <label className="block text-gray-700 font-semibold mb-1">SELECT YOUR SERVICE</label>

                    <div className="relative">
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            onFocus={() => setShowTooltip(true)}   // show tooltip when dropdown opens
                            onBlur={() => setShowTooltip(false)}   // hide tooltip when dropdown closes
                            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4598e2] focus:border-[#4598e2]"
                        >
                            <option value="printAndFrame">Print and Frame</option>
                            <option value="frameOnly">Frame only</option>
                            <option value="mailIn">Mail in</option>
                        </select>

                        {/* Tooltip above select */}
                        {showTooltip && (
                            <div className="absolute -top-10 left-0 w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded p-2 shadow-md">
                                {selectedService === "printAndFrame" && "Digital photo/artwork printing + framing."}
                                {selectedService === "frameOnly" && "You already have artwork, just need a frame."}
                                {selectedService === "mailIn" && "They pick up your artwork and frame it."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quantity & Price Row */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 font-semibold">Quantity:</label>
                        <input
                            type="number"
                            min={1}
                            defaultValue={1}
                            className="w-16 border rounded p-1 text-center"
                        />
                    </div>
                    <span className="text-gray-800 font-bold">$160.00</span>
                </div>

                {/* Share & Add to Cart Row */}
                <div className="flex gap-2">
                    <button
                        onClick={handleShare}
                        className="flex-1 border border-gray-400 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                        <ArrowUpOnSquareIcon className="w-4 h-4" />
                        Share
                    </button>
                    <button className="flex-1 bg-[#4598e2] text-white px-3 py-1.5 rounded hover:bg-[#035734] transition-colors flex items-center justify-center gap-1.5">
                        <ShoppingCartIcon className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>

                {copied && (
                    <p className="text-green-600 text-sm font-medium">Link copied!</p>
                )}

                <hr className="my-2" />

                {/* Personal Photo */}
                <h1 className="font-semibold text-gray-800 text-lg px-1">
                    Your Personal Photo <br />
                    <span className="text-gray-600 text-sm px-1">Paper dimensions: {artWidth} × {artHeight} inches</span>
                </h1>

                {/* Art Type Selection */}
                <div className="bg-white rounded-md overflow-hidden transition-all duration-500">
                    <table className="table-auto w-full text-sm">
                        <tbody>
                            <tr onClick={toggleRow} className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <td className="px-1 py-2 text-gray-700">
                                    Art Type <br />
                                    <span className="font-bold">{selectedArtType}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <ChevronRightIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openRow ? "rotate-90" : ""}`} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="p-0">
                                    <div className={`transition-all duration-500 overflow-hidden ${openRow ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="bg-gray-50 border-t border-gray-200 px-3 py-3">
                                            <div className="flex justify-between mb-2">
                                                <button onClick={applySelection} className="bg-[#4598e2] text-white font-semibold py-1.5 px-3 rounded hover:bg-[#3574b5] transition-colors">APPLY</button>
                                                <button onClick={cancelSelection} className="border border-gray-400 text-gray-600 font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">CANCEL</button>
                                            </div>
                                            <div className="space-y-2">
                                                {artOptions.map((item) => (
                                                    <div key={item.title} className="flex items-center justify-between p-2 bg-white hover:bg-gray-100 border rounded-md transition-colors">
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                                            <p className="text-gray-500 text-xs">{item.desc}</p>
                                                        </div>
                                                        <input type="radio" name="artType" value={item.title} checked={tempSelection === item.title} onChange={(e) => setTempSelection(e.target.value)} className="accent-[#4598e2] w-4 h-4" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-md overflow-hidden transition-all duration-500">
                    <table className="table-auto w-full text-sm">
                        <tbody>
                            <tr onClick={() => setOpenDimensions(!openDimensions)} className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <td className="px-1 py-2 text-gray-700">
                                    Art Dimensions <br />
                                    <span className="font-bold">{artWidth} × {artHeight} inches</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <ChevronRightIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openDimensions ? "rotate-90" : ""}`} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="p-0">
                                    <div className={`transition-all duration-500 overflow-hidden ${openDimensions ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                                            <div className="flex justify-between mb-2">
                                                <button onClick={() => { setAppliedDimensions({ width: artWidth, height: artHeight }); setOpenDimensions(false); }} className="bg-[#4598e2] text-white font-semibold py-1.5 px-3 rounded hover:bg-[#3574b5] transition-colors">APPLY</button>
                                                <button onClick={() => { setArtWidth(appliedDimensions.width); setArtHeight(appliedDimensions.height); setOpenDimensions(false); }} className="border border-gray-400 text-gray-600 font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">CANCEL</button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-gray-700 font-semibold">Width (inches)</label>
                                                    <input type="number" className="border rounded p-1 w-20" value={artWidth} onChange={(e) => setArtWidth(e.target.value)} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-gray-700 font-semibold">Height (inches)</label>
                                                    <input type="number" className="border rounded p-1 w-20" value={artHeight} onChange={(e) => setArtHeight(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="text-gray-700 text-sm space-y-1">
                                                <p><span className="font-semibold">Frame interior:</span> {parseFloat(artWidth) + 3} × {parseFloat(artHeight) + 3} inches</p>
                                                <p><span className="font-semibold">Frame exterior:</span> {parseFloat(artWidth) + 3.875} × {parseFloat(artHeight) + 3.875} inches</p>
                                                <p><span className="font-semibold">Paper dimensions:</span> {artWidth} × {artHeight} inches</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Upload & AI Section */}
                <div className="flex w-full gap-4">
                    {/* Upload */}
                    <div className="bg-white rounded-md overflow-hidden w-1/2">
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200" onClick={() => document.getElementById("uploadInput").click()}>
                                    <td className="px-1 py-2 text-gray-700">
                                        <label className="font-semibold text-[#4598e2]">UPLOAD IMAGE</label>
                                        <input id="uploadInput" type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) setSelectedFile(file); }} className="hidden" />
                                        <br />
                                        <span className="font-bold text-gray-700">{selectedFile ? selectedFile.name : "Unspecified"}</span>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* AI */}
                    <div className="bg-white rounded-md overflow-hidden w-1/2">
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200" onClick={() => setOpenAISection(!openAISection)}>
                                    <td className="px-2 py-2 text-gray-700">
                                        <span className="font-semibold text-[#4598e2]">GENERATE IMAGE</span><br />
                                        <span className="font-bold text-gray-700">{generatedImage ? "AI Image Ready" : "Turn your idea into design"}</span>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <ChevronRightIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openAISection ? "rotate-90" : ""}`} />
                                    </td>
                                </tr>
                                {openAISection && (
                                    <tr>
                                        <td colSpan={2} className="p-0">
                                            <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 space-y-2">
                                                <label className="block text-gray-700 font-semibold mb-1">Describe your idea:</label>
                                                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A cozy living room with sunlight and plants" className="w-full border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4598e2]" rows="2"></textarea>
                                                <div className="flex justify-between mb-2">
                                                    <button onClick={handleGenerate} disabled={isGenerating || !prompt} className={`${isGenerating ? "bg-gray-400" : "bg-[#4598e2] hover:bg-[#3574b5]"} text-white font-semibold py-1.5 px-3 rounded transition-colors`}>
                                                        {isGenerating ? "Generating..." : "Generate"}
                                                    </button>
                                                    <button onClick={handleCancel} className="border border-gray-400 text-gray-600 font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">Cancel</button>
                                                </div>
                                                {generatedImage && (
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <img src={generatedImage} alt="Generated Design" className="w-full rounded-md shadow-md" />
                                                        <div className="flex justify-between w-full">
                                                            <button onClick={handleApply} className="bg-[#4598e2] text-white font-semibold py-1.5 px-3 rounded hover:bg-[#3574b5] transition-colors">Apply</button>
                                                            <button onClick={() => setGeneratedImage(null)} className="border border-gray-400 text-gray-600 font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">Regenerate</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Canvas Edge */}
                {selectedArtType === "Canvas Print" && (
                    <div className="mt-2 w-1/2">
                        <label className="block text-gray-700 font-semibold mb-1">Canvas Edge</label>
                        <select value={canvasEdge} onChange={(e) => setCanvasEdge(e.target.value)} className="w-full border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-[#4598e2] focus:border-[#4598e2]">
                            <option value="wrap-sides">Wrap sides</option>
                            <option value="white-sides">White sides</option>
                        </select>
                    </div>
                )}

                {/* Frame */}
                <h1 className="font-semibold text-gray-800 text-lg px-1">
                    Your Frame <br />
                    <span className="text-gray-600 text-sm px-1">interior: 11 × 13 inches. Exterior: 11 7/8 × 13 7/8 inches</span>
                </h1>
                <div className="flex gap-2 mb-2">
                    {["#272626ff", "#c6cbd0ff", "#e0e0e0", "#022d4aff", "#faf4d0ff", "#802809ff", "#405040ff"].map(color => (
                        <div key={color} onClick={() => setFrameColor(color)} style={{ backgroundColor: color }} className={`w-8 h-8 rounded cursor-pointer border-2 ${frameColor === color ? "border-black" : "border-gray-300"}`}></div>
                    ))}
                </div>
                <p className="text-gray-700 text-sm mt-2">
                    ↳ with a{" "}
                    <select value={frameThickness / 25.4} onChange={(e) => setFrameThickness(parseFloat(e.target.value) * 25.4)} className="inline-block w-20 px-1 py-1 text-gray-800 text-sm bg-white border border-gray-400 rounded text-center appearance-none cursor-pointer">
                        <option value="0.75">0.75"</option>
                        <option value="1">1"</option>
                        <option value="1.625">1.625"</option>
                    </select>{" "}
                    face and 1.125" depth.
                </p>

                {/* Mat Style */}
                <div className="bg-white rounded-md overflow-hidden transition-all duration-500">
                    <table className="table-auto w-full text-sm">
                        <tbody>
                            <tr onClick={toggleMatRow} className="cursor-pointer bg-white hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <td className="px-1 py-2 text-gray-700">Mat Style <br /><span className="font-bold">{selectedMatStyle}</span></td>
                                <td className="px-4 py-2 text-right">
                                    <ChevronRightIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openMatRow ? "rotate-90" : ""}`} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="p-0">
                                    <div className={`transition-all duration-500 overflow-hidden ${openMatRow ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="bg-gray-50 border-t border-gray-200 px-3 py-3">
                                            <div className="flex justify-between mb-2">
                                                <button onClick={applyMatSelection} className="bg-[#4598e2] text-white font-semibold py-1.5 px-3 rounded hover:bg-[#3574b5] transition-colors">APPLY</button>
                                                <button onClick={cancelMatSelection} className="border border-gray-400 text-gray-600 font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">CANCEL</button>
                                            </div>
                                            <div className="space-y-2">
                                                {matOptions.map(item => (
                                                    <div key={item.title} className="flex items-center justify-between p-2 bg-white hover:bg-gray-100 border rounded-md transition-colors">
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                                            <p className="text-gray-500 text-xs">{item.desc}</p>
                                                        </div>
                                                        <input type="radio" name="matStyle" value={item.title} checked={tempMatSelection === item.title} onChange={(e) => setTempMatSelection(e.target.value)} className="accent-[#4598e2] w-4 h-4" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Slider + Advanced Options */}
                <div className="p-2">
                    <div className="flex items-start gap-3 mt-3">
                        <div className="w-1/2">
                            <FrameCustomizer matBorder={matBorder} setMatBorder={setMatBorder} />
                        </div>
                        <div className="w-1/2 flex items-center">
                            <button onClick={toggleAdvanced} className="w-full border border-gray-400 text-blue-600 py-2 px-3 rounded hover:bg-gray-100 flex justify-between items-center transition-colors">
                                Advanced Options
                                <span className="ml-2 text-xl">{advancedOpen ? "-" : "+"}</span>
                            </button>
                        </div>
                    </div>
                    {advancedOpen && (
                        <div className="mt-3 space-y-2">
                            <div className="mb-2 w-1/2">
                                <label className="block text-gray-700 mb-1">Paper Type
                                    <select className="w-full border rounded p-1 mt-1">
                                        <option>Photo Paper Lustre Finish</option>
                                        <option>Archival Matte Art Paper</option>
                                        <option>Textured Watercolor</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <p className="text-sm">Outer Dimensions: 13" x 18"</p>
                                <p className="text-sm">Mat: 2" border, 11" x 16" visible</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default CollageLayoutSelector;
