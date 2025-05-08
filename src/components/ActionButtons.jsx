import { useState } from "react";

export function ActionButtons({ text, onReset }) {
  const [copyStatus, setCopyStatus] = useState("");
  
  const handleCopy = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("Copy failed");
    }
  };
  
  const handleExport = () => {
    if (!text.trim()) return;
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    const timestamp = new Date().toISOString().replace(/:/g, "-").substring(0, 19);
    a.download = `whisper-transcription-${timestamp}.txt`;
    a.href = url;
    a.style.display = "none";
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  return (
    <div className="flex space-x-2 mt-2">
      <button
        className="border rounded-lg px-4 py-1 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        onClick={handleCopy}
        disabled={!text.trim()}
      >
        {copyStatus || "Copy"}
      </button>
      <button
        className="border rounded-lg px-4 py-1 bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition"
        onClick={handleExport}
        disabled={!text.trim()}
      >
        Export
      </button>
      <button
        className="border rounded-lg px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}