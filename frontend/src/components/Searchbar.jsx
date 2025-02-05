import React, { useState } from "react";

const Searchbar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(input); // Trigger search when Enter is pressed
    }
  };

  return (
    <div className="flex justify-center items-center h-8 mb-20">
      <div className="relative mx-4 w-96">
        <input
          type="text"
          placeholder="Search for a Note.."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full mx-1 pl-12 pr-4 py-2 border border-blue-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-blue-100 text-blue-700"
        />
        <img
          src="/searchicon.png"
          alt="Search Icon"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-blue-400"
        />
      </div>
    </div>
  );
};

export default Searchbar;
