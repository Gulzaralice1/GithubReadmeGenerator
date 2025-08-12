
import { React, useState } from "react";
import Sidebar from "./component/SideBar";
import SearchBar from "./component/SearchBar";
import ChatBody from "./component/ChatBody";
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [timestamp, setTimestamp] = useState(Date.now());

  const handleSearch = (inputValue) => {
    setSearchInput(inputValue);
    setTimestamp(Date.now());
    console.log("Search input updated in app- :", inputValue);
    console.log("Search input updated app- :", searchInput);
  };

  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Sidebar className="w-64" />
      <main className="flex-1 p-4 sm:p-6 mt-10 transition-all duration-300 text-white  flex flex-col items-center justify-center relative w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center w-full gap-4 ">
          {/* Pass search input to ChatBody */}
          <ChatBody searchQuery={searchInput}  key={`${searchInput}-${timestamp}`}/>
          <div className="hover:opacity-80 w-full max-w-4xl flex flex-col items-center fixed bottom-4 ">
            {/* Pass the handler function to SearchBar */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
