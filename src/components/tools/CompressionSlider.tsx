'use client';

import { CompressionLevel } from '@/types';
import { COMPRESSION_PRESETS } from '@/utils/constants';

interface CompressionSliderProps {
  value: CompressionLevel;
  onChange: (level: CompressionLevel) => void;
}

const levels: CompressionLevel[] = ['low', 'medium', 'high'];

export default function CompressionSlider({ value, onChange }: CompressionSliderProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text">Compression Level</label>

      <div className="flex gap-2">
        {levels.map((level) => {
          const preset = COMPRESSION_PRESETS[level];
          const isActive = value === level;

          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'bg-surface border-border text-text-muted hover:border-surface-light hover:text-text'
              }`}
            >
              <div className="font-semibold">{preset.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{preset.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
