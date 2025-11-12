// src/pages/FrameTypeSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import BaseApi from "../utils/services/baseApi.js";
import Spinner from "../components/Spinner/Spinner.jsx";
import ErrorScreen from "../components/ErrorScreen/ErrorScreen.jsx";

export default function FrameTypeSelection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =   useState(""); 

  const baseApiService = new BaseApi(API);

  // ✅ Fetch categories from backend
 useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await baseApiService.getCategories("/public/categories");

        setCategories(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (optionName) => {
    console.log(`Selected: ${optionName}`);
    navigate("/layout");
  };

  if (loading) {
    return <Spinner message="Loading frame options..."/>
  }

  if (error) {
    return (
      <ErrorScreen message={error?.message ? error?.message : error} />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 md:px-8">
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
        {categories.map((category) => (
          <div key={category._id} className="flex justify-center w-full">
            <div
              className="group cursor-pointer bg-gray-100 rounded-lg p-5 flex flex-col justify-between items-center w-full max-w-sm h-[420px] shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
              onClick={() => handleSelect(category.name)}
            >
              {/* Image */}
              <div className="bg-gray-200 w-full h-52 rounded-lg border border-gray-300 overflow-hidden flex justify-center items-center">
                <img
                  src={category.imageUrl || "https://via.placeholder.com/300x200"}
                  alt={category.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Heading */}
              <h5 className="text-gray-800 font-semibold text-lg mt-4 text-center">
                {category.name}
              </h5>

              {/* Short description */}
              <p className="text-gray-600 text-sm text-center mt-1">
                {category.description || "Explore this frame option."}
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
