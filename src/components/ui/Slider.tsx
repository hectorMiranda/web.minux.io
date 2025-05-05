// src/components/ui/Slider.tsx
import React, { useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className = '' }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };
  
  return (
    <div className={`relative h-6 flex items-center ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer z-10"
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      />
      
      <div className="absolute w-full h-2 bg-[#2d2d2d] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#00B4D8] rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div 
        className={`absolute h-4 w-4 rounded-full bg-white shadow-md transform -translate-x-1/2 transition-transform
          ${isDragging ? 'scale-110' : ''}`}
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}