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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-green-800 mb-4">
          🦎 Lizard Click
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          "Lizard! Lizard! Lizard!" - Click the button and unleash the lizard power!
        </p>
        
        <LizardButton onCountChange={setCount} />
        
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-green-700">
            Clicks: {count}
          </div>
          
          <button
            onClick={handleReset}
            className="
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white font-semibold
              px-6 py-2 rounded-lg
              transform hover:scale-105 active:scale-95
              transition-all duration-150
              focus:outline-none focus:ring-4 focus:ring-red-300
              focus:ring-opacity-50
            "
            aria-label="Reset click counter"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
