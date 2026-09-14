import { useEffect, useRef, useState } from 'react'
import { PRESET_COLORS } from '../../constants/productOptions'

const HEX_REGEX = /^#[0-9A-F]{6}$/i

export default function ColorPicker({ hexCode, onColorSelect }) {
  const [showPalette, setShowPalette] = useState(false)
  const [inputValue, setInputValue] = useState(hexCode)
  const pickerRef = useRef(null)

  const handleInputChange = (event) => {
    const value = event.target.value
    setInputValue(value)
    if (HEX_REGEX.test(value)) onColorSelect(value)
  }

  const handleColorSelect = (color) => {
    setInputValue(color)
    onColorSelect(color)
    setShowPalette(false)
  }

  useEffect(() => {
    if (!showPalette) return undefined
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setShowPalette(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showPalette])

  const isValid = HEX_REGEX.test(inputValue)

  return (
    <div ref={pickerRef} className="relative w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Hex code (e.g. #333333)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={() => setShowPalette((previous) => !previous)}
          className="w-12 shrink-0 rounded-lg border-2 transition-all hover:scale-105"
          style={{
            backgroundColor: isValid ? inputValue : '#FFFFFF',
            borderColor: isValid ? inputValue : '#CBD5E1',
          }}
          title="Open color palette"
        />
      </div>

      {showPalette && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-elevated">
          <div className="mb-3 grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className="h-8 w-8 rounded-md border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: color === inputValue ? '#0f172a' : '#e2e8f0',
                  boxShadow: color === inputValue ? '0 0 0 2px rgba(15,23,42,0.15)' : 'none',
                }}
                title={color}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">Click a color or type a hex code above</p>
        </div>
      )}
    </div>
  )
}
