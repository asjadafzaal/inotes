import React, { useState, useRef, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import { logout } from "../authService"; // ✅ Import the logout function


const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [profileImage, setProfileImage] = useState("/user.png");
  const [userName, setUserName] = useState("User"); // Default name
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null); // Ref for image dragging
  const navigate = useNavigate();

  // Fetch user's name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleModalOpen = () => {
    setShowDropdown(false);
    setShowModal(true);
    setZoomLevel(1); // Reset zoom when opening
    setPosition({ x: 0, y: 0 }); // Reset position when opening
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout(); // ✅ Call the logout function from authService.js

  };

  // Double-click to zoom in/out
  const handleDoubleClick = () => {
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 2 : 1));
  };

  // Drag functions
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img src="/icon.png" alt="Logo" className="w-10 h-10 rounded-full" />
            <div className="text-2xl font-semibold text-blue-600">INotes</div>
          </div>

          {/* Profile Section */}
          <div className="relative flex items-center space-x-3">
            <div ref={dropdownRef}>
              <img
                src={profileImage}
                alt="Profile"
                className="w-9 h-9 border border-black rounded-full cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              />
              {showDropdown && (
                <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40 z-20">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleModalOpen}
                  >
                    View Picture
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              {/* Display User's Name */}
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                className="text-blue-600 underline text-sm sm:text-base hover:text-blue-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-30">
          <div className="relative bg-white rounded-md p-7 shadow-lg w-96 h-auto max-h-[500px] overflow-hidden mx-4">
            <FaTimes
              size={20}
              className="absolute top-2 right-2 text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => setShowModal(false)}
            />

            <div
              className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-100 flex justify-center items-center"
              style={{ height: "300px" }}
            >
              <img
                ref={imageRef}
                src={profileImage}
                alt="Full Profile"
                className="object-contain transition-transform"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                  transformOrigin: "center",
                  cursor: "grab",
                  transition: "transform 0.1s ease-out",
                }}
                onDoubleClick={handleDoubleClick} // Double-tap for zoom
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the image
              />
            </div>

            {/* Add Picture Button inside Modal */}
            <button
              className="mt-4 w-full px-2 py-1.5 text-white bg-blue-500 rounded-md hover:bg-blue-600 text-sm"
              onClick={() => fileInputRef.current.click()}
            >
              Add Profile Picture
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
