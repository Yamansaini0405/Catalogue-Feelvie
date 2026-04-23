import { useEffect, useRef, useState } from 'react'

const PRESET_COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF',
  '#4B0082', '#9400D3', '#FF1493', '#FFB6C1', '#FFA500',
  '#FFD700', '#90EE90', '#00CED1', '#87CEEB', '#4169E1',
  '#8B0000', '#FF4500', '#FF69B4', '#7FFF00', '#00FA9A',
  '#DC143C', '#FF8C00', '#DDA0DD', '#98FB98', '#00BFFF',
  '#000000', '#808080', '#FFFFFF', '#A9A9A9', '#D3D3D3',
]

function ColorPicker({ hexCode, onColorSelect }) {
  const [showPalette, setShowPalette] = useState(false)
  const [inputValue, setInputValue] = useState(hexCode)
  const pickerRef = useRef(null)

  const handleInputChange = (event) => {
    const value = event.target.value
    setInputValue(value)
    
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorSelect(value)
    }
  }

  const handleColorSelect = (color) => {
    setInputValue(color)
    onColorSelect(color)
    setShowPalette(false)
  }

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPalette(false)
    }
  }

  useEffect(() => {
    if (showPalette) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPalette])

  return (
    <div ref={pickerRef} className='relative w-full'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Hex code (e.g. #333333)'
          className='flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 uppercase'
        />
        <button
          type='button'
          onClick={() => setShowPalette(!showPalette)}
          className='w-12 rounded-lg border-2 border-slate-300 transition-all hover:border-slate-500'
          style={{
            backgroundColor: /^#[0-9A-F]{6}$/i.test(inputValue) ? inputValue : '#FFFFFF',
            borderColor: /^#[0-9A-F]{6}$/i.test(inputValue) ? inputValue : '#CBD5E1',
          }}
          title='Open color palette'
        />
      </div>

      {showPalette && (
        <div className='absolute right-0 top-full z-50 mt-2 rounded-lg border-2 border-slate-300 bg-white p-3 shadow-xl'>
          <div className='mb-3 grid grid-cols-5 gap-2'>
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type='button'
                onClick={() => handleColorSelect(color)}
                className='h-8 w-8 rounded border-2 border-slate-300 transition-all hover:scale-110'
                style={{
                  backgroundColor: color,
                  borderColor: color === inputValue ? '#000' : '#CBD5E1',
                  boxShadow: color === inputValue ? '0 0 0 2px #000' : 'none',
                }}
                title={color}
              />
            ))}
          </div>
          <p className='text-xs text-slate-600'>Click a color or type hex code above</p>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
