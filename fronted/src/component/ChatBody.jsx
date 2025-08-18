import { Clipboard, Check } from "lucide-react";
import { React, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'

function ChatBody({ searchQuery }) {
    const [copied, setCopied] = useState(false);
    const [resp, setResp] = useState("");
    const [loading, setLoading] = useState(false);
    // const [readme, setReadme] = useState("");
    const [copysmg, setCopysmg] = useState("Nothing to copy");

    console.log("Search query in ChatBody:", searchQuery);
    const handleCopy = () => {
        navigator.clipboard.writeText(copysmg);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {

        if (!searchQuery) return;
        console.log("inside useeffect Search query changed in ChatBody:", searchQuery);
        // Validate GitHub URL strictly here before fetching
        const isGitHubRepoUrl =
            typeof searchQuery === "string" &&
            searchQuery.includes("github.com") &&
            searchQuery.trim().endsWith(".git");

        if (!isGitHubRepoUrl) {
            if (searchQuery) { // only show error if input is not empty
                toast.error("This is not a valid GitHub repo URL ending with '.git'");
                setResp("This is not a valid GitHub repo URL.");
            }

            setLoading(false);
            console.log("Invalid GitHub URL provided:", searchQuery);
            return; // Don't fetch if invalid URL
        }

        // If valid, fetch data
        const getRepoInfo = async () => {
            setLoading(true);
            setResp("");  // Clear old data while loading
            toast.info("Processing data...");

            try {
                // searchQuery.trim();
                const res = await fetch('http://localhost:5000/api/readme/getRepoInfo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repoUrl: searchQuery }),
                });

                if (!res.ok) {
                    setCopysmg("Nothing to copy");
                    const errData = await res.json();
                    toast.error(errData.error || "Failed to fetch data from backend.");
                    setResp(errData.error || "Failed to fetch data.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setCopysmg(data.bot || "No README generated.");
                setResp(data.bot || "No data received.");
                toast.success("Data fetched successfully!");
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Network error occurred.");
                setResp("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        getRepoInfo();

    }, [searchQuery]);

    return (
        <div className="w-full max-w-4xl rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] text-sm font-mono text-gray-100">
            {/* Header */}
            <div className="bg-[#2d3143] px-4 py-2 flex justify-between items-center border-b border-gray-700 rounded-t-lg backdrop-blur-md bg-opacity-80">
                <span className="text-gray-200 text-sm font-medium">Code</span>
                <button className="text-gray-400 hover:text-red-200" onClick={handleCopy} >
                    {copied ? (
                        <>
                            {/* <Check size={16} /> */}
                            <span>Copied</span>
                            
                        </>
                    ) : (
                        <>
                            <Clipboard size={16} />
                            {/* <span>Copy</span> */}
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <div className="p-4 space-y-1 h-96 overflow-y-auto text-gray-200 font-mono bg-[#1e1e1e] text-center">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Quantum size="60" speed="1.75" color="white" />
                    </div>
                ) : resp ? (
                    <pre className="whitespace-pre-wrap break-words text-left">{resp}</pre>
                ) : (
                    <p className="text-gray-400">Enter a valid GitHub repo URL ending with '.git' above.</p>
                )}
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
            
        </div>
    );
}

export default ChatBody;





// Default values shown
