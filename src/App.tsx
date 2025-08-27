import { useState, useEffect, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

function App() {
  const [count, setCount] = useLocalStorage<number>("lizardClickCount", 0);
  const [currentMessage, setCurrentMessage] = useState("");
  const messageAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when message changes
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [currentMessage]);

  const handleTypeLizard = async () => {
    const newCount = count + 1;
    setCount(newCount);
    setCurrentMessage((prev) => prev + "🦎");

    // Play lizard sound
    try {
      const audio = new Audio("/sounds/lizard.mp3");
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.warn("Audio play failed:", error);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setCurrentMessage("");
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear everything?")) {
      setCurrentMessage("");
      setCount(0);
    }
  };

  const handleDisabledKey = () => {
    // Do nothing - these keys don't work!
  };

  const emojiKeys = [
    { emoji: "😀", active: false, onClick: handleDisabledKey },
    { emoji: "❤️", active: false, onClick: handleDisabledKey },
    { emoji: "👍", active: false, onClick: handleDisabledKey },
    { emoji: "😂", active: false, onClick: handleDisabledKey },
    { emoji: "🔥", active: false, onClick: handleDisabledKey },
    { emoji: "💯", active: false, onClick: handleDisabledKey },
    { emoji: "🎉", active: false, onClick: handleDisabledKey },
    { emoji: "🌟", active: false, onClick: handleDisabledKey },
    { emoji: "🚀", active: false, onClick: handleDisabledKey },
    { emoji: "💖", active: false, onClick: handleDisabledKey },
    { emoji: "✨", active: false, onClick: handleDisabledKey },
    { emoji: "🦎", active: true, onClick: handleTypeLizard },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col max-w-4xl mx-auto overflow-hidden">
      {/* iPad Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b flex-shrink-0">
        <div className="flex items-center space-x-4">
          <img
            src="/lizard.webp"
            alt="Derpy Lizard"
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Lizard Typing Simulator
            </h1>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-red-500 font-medium hover:text-red-600"
        >
          Reset
        </button>
      </div>

      {/* Typing Area */}
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <div className="text-sm text-gray-500 mb-2 flex-shrink-0">
            Lizards typed: {count} | Current message:
          </div>
          <div
            ref={messageAreaRef}
            className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-y-auto h-48"
          >
            <div className="text-6xl leading-relaxed">
              {currentMessage || (
                <span className="text-gray-400 text-2xl">
                  Start typing lizards...
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 flex-shrink-0">
            <img src="/lizard.webp" alt="Derpy Lizard" className="w-6 h-6" />
            <span className="text-sm text-gray-600">
              Pro tip: Only the lizard key works!
            </span>
          </div>
        </div>

        {/* Emoji Keyboard */}
        <div className="bg-gray-100 rounded-2xl p-6 shadow-inner flex-shrink-0">
          <div className="flex gap-4">
            {/* Left Column - Emoji Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {emojiKeys.map((key, index) => (
                  <button
                    key={index}
                    onClick={key.onClick}
                    className={`
                      w-16 h-16 rounded-xl text-3xl flex items-center justify-center
                      transition-all duration-150 border-2
                      ${
                        key.active
                          ? "bg-green-100 border-green-400 hover:bg-green-200 shadow-lg transform hover:scale-110"
                          : "bg-white border-gray-300 hover:bg-gray-50 opacity-60 cursor-not-allowed"
                      }
                    `}
                    disabled={!key.active}
                  >
                    {key.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Send Button */}
            <div className="flex flex-col">
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 text-sm ${
                  currentMessage.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
