import React from "react";

const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-400 mb-4"></div>
      <span className="text-lg font-bold">{message}</span>
    </div>
  );
};

export default Spinner;
