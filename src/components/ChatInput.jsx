import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

function ChatInput() {
  const [message, setMessage] = useState("");
  const handleConsole = () => {
    console.log(message);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-6">
      <div className="bg-[#f7f7f8] border border-gray-300 rounded-2xl px-6 py-4 shadow-md flex items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message ChatGPT..."
          className="w-full h-auto max-h-40 overflow-y-auto resize-none bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-base"
        />
        <button className="text-gray-500 hover:text-blue-600 transition duration-200 ml-3 mb-1">
          <FiSend
            size={22}
            onClick={handleConsole}
            style={{ cursor: "pointer" }}
          />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
