import { useState } from 'react'
import LizardButton from './components/LizardButton'
import useLocalStorage from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [count, setCount] = useLocalStorage<number>('lizardClickCount', 0)

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your lizard clicks?')) {
      setCount(0)
    }
  }

  const lizardEmojis = '🦎'.repeat(count)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Large Textbox Display */}
        <div className="bg-gray-900 rounded-2xl p-8 min-h-[400px] border-4 border-gray-700 shadow-2xl">
          <div className="text-green-400 font-mono text-2xl mb-4">
            Lizards: {count}
          </div>
          <div 
            className="text-green-400 font-mono text-6xl leading-relaxed break-all overflow-y-auto max-h-80"
            style={{ wordBreak: 'break-all' }}
          >
            {lizardEmojis || <span className="text-gray-500 text-3xl">Click the button to add lizards...</span>}
          </div>
        </div>
        
        {/* Large Button */}
        <div className="flex flex-col items-center space-y-6">
          <LizardButton onCountChange={setCount} count={count} />
          
          <button
            onClick={handleReset}
            className="
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white font-bold text-xl
              px-8 py-4 rounded-xl
              transition-all duration-150
              focus:outline-none focus:ring-4 focus:ring-red-300
              focus:ring-opacity-50
              shadow-lg
            "
            aria-label="Reset lizard counter"
          >
            Reset All Lizards
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
