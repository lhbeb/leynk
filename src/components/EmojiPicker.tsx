'use client';

import { useState, useRef, useEffect } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😍', label: 'Heart Eyes' },
  { emoji: '🤍', label: 'White Heart' },
  { emoji: '🖤', label: 'Black Heart' },
];

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-accent/10 rounded-lg transition-colors flex items-center justify-center group"
        title="Add emoji"
      >
        <img
          src="/emoji.svg"
          alt="Add emoji"
          width={20}
          height={20}
          className="group-hover:scale-110 transition-transform"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-accent/20 rounded-xl shadow-xl p-2 z-50 flex gap-1.5 flex-wrap min-w-[200px] justify-center">
          {EMOJIS.map((item) => (
            <button
              key={item.emoji}
              type="button"
              onClick={() => handleEmojiClick(item.emoji)}
              className="w-9 h-9 flex items-center justify-center hover:bg-accent/10 rounded-lg transition-all text-xl hover:scale-125 active:scale-95 border border-transparent hover:border-accent/20"
              title={`Insert ${item.label}`}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

