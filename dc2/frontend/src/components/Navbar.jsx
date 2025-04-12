import React from "react";

function Navbar({ scrollToInput, scrollToHome }) {
  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-black bg-opacity-50 backdrop-blur-lg text-white z-50 shadow-lg">
      <div className="w-full flex items-center justify-between">
        {/* App Icon and Name */}
        <div className="flex items-center space-x-3">
          {/* App Icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="text-lg font-semibold">BSS</span>
        </div>

        {/* Navigation Links with SVG icons */}
        <div className="flex space-x-4 text-sm">
          {/* Upload SVG Icon */}
          <a
            href="#"
            onClick={scrollToInput}
            className="flex items-center space-x-1 hover:underline hover:text-green-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 2v12m0 0l3-3m-3 3l-3-3M19 22H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
            </svg>
            <span>Upload</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
