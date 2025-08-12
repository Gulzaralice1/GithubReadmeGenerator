import { useState } from "react";
import './styles.css';
export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "#" },
    { name: "GitHub Profile", path: "#" },
    { name: "GitHub Profile Readme", path: "#" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 transition-all duration-300 
        ${open ? "w-64" : "w-0"} md:w-64 overflow-hidden`}
      >
        <h2 className="text-2xl font-bold mb-6">My Sidebar</h2>
        <ul className="space-y-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.path} className="hover:text-blue-400 block">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div class="h-96 overflow-y-auto my-scrollbar overflow-x-hidden mt-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-gray-400 mb-2">
              Scrollable content {i + 1}
            </p>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 ml-0 md:ml-64 p-4">
        <button
          className="md:hidden bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </div>
  );
}
