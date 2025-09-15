import { useState, useEffect, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

interface MessageHistoryItem {
  content: string;
  timestamp: Date;
}

function App() {
  const [count, setCount] = useLocalStorage<number>("lizardClickCount", 0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageHistory, setMessageHistory] = useLocalStorage<
    MessageHistoryItem[]
  >("lizardMessageHistory", []);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when message changes
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [currentMessage]);

  // Auto-scroll history to bottom when new message is added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messageHistory]);

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
      const newHistoryItem: MessageHistoryItem = {
        content: currentMessage,
        timestamp: new Date(),
      };
      setMessageHistory((prev) => [...prev, newHistoryItem]);
      setCurrentMessage("");
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear everything?")) {
      setCurrentMessage("");
      setCount(0);
      setMessageHistory([]);
    }
  };

  const handleDisabledKey = () => {
    // Do nothing - these keys don't work!
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <img
            src="/lizard.webp"
            alt="Derpy Lizard"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-green-500 flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
              Lizard Typing Simulator
            </h1>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-red-500 font-medium hover:text-red-600 text-sm sm:text-base flex-shrink-0"
        >
          Reset
        </button>
      </div>

      {/* Message History - Flexible area */}
      <div className="flex-1 overflow-hidden p-3 sm:p-6">
        <div className="h-full bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex flex-col">
          <div className="text-xs sm:text-sm text-gray-500 p-3 sm:p-4 border-b flex-shrink-0">
            Message History 📜 | Lizards typed: {count}
          </div>
          <div
            ref={historyRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
          >
            {messageHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm sm:text-base">
                  No lizard messages yet... Start typing! 🦎
                </span>
              </div>
            ) : (
              messageHistory.map((msg, index) => (
                <div key={index} className="flex justify-end">
                  <div className="flex flex-col items-end max-w-xs sm:max-w-sm">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-md px-4 py-2 shadow-md">
                      <span className="text-lg sm:text-xl break-all">
                        {msg.content}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono mt-1">
                      {formatTimestamp(new Date(msg.timestamp))}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Text Input Area - iMessage style */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-1">
            <div
              ref={messageAreaRef}
              className="bg-gray-100 rounded-2xl px-4 py-2 sm:py-3 min-h-[2.5rem] max-h-32 overflow-y-auto border border-gray-300"
            >
              <div className="text-base sm:text-lg leading-relaxed break-all">
                {currentMessage || (
                  <span className="text-gray-400 text-sm sm:text-base">
                    Type lizards here...
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-150 ${
              currentMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600 shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Emoji Keyboard - Phone style grid */}
      <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
        <div className="w-full">
          <div
            className="grid grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center"
            style={{ maxWidth: "100%" }}
          >
            {emojiKeys.map((key, index) => (
              <button
                key={index}
                onClick={key.onClick}
                className={`
                  w-full aspect-square min-w-[2.5rem] max-w-[3.5rem] sm:min-w-[3rem] sm:max-w-[4rem] md:min-w-[3.5rem] md:max-w-[4.5rem] rounded-xl text-lg sm:text-2xl md:text-3xl 
                  flex items-center justify-center transition-all duration-150 border-2
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
      </div>
    </div>
  );
}

export default App;
