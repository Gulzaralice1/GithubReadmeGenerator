import React, { useState } from "react";
function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value); // update local input state as user types
  };

  const handleKeyDown = (e) =>{
    if(e.key === 'Enter'){
      e.preventDefault(); // Prevent form submission
      onSearch(e.target.value); // Send input to parent on Enter key
      console.log("Search input submitted: search bar-", e.target.value);
      setInput(''); // Clear input field after submission
    }
  }

  return (
    <div className="w-full max-w-4xl flex items-center justify-center border border-gray-300 rounded-lg bg-white/20 backdrop-blur-md shadow-lg">
      <textarea
        placeholder="Enter your GitHub repository URL"
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-transparent text-white placeholder-gray-300"
        rows={2}
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
