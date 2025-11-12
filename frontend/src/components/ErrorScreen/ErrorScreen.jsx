import React from "react";

const ErrorScreen = ({ message = "Something went wrong!" }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-red-500">
      <svg
        className="w-16 h-16 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span className="text-xl font-medium">{message}</span>
    </div>
  );
};

export default ErrorScreen;