'use client';

import { useState } from 'react';
import SubscribeModal from './SubscribeModal';

interface NotificationButtonProps {
  username: string;
}

// Notification Icon SVG
const NotificationIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    fill="currentColor" 
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
  </svg>
);

export default function NotificationButton({ username }: NotificationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-10 h-10 rounded-full bg-white border border-accent/20 text-text-primary flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-all shadow-sm hover:shadow-md"
        title="Subscribe to notifications"
      >
        <NotificationIcon className="text-accent" />
      </button>

      <SubscribeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        username={username}
      />
    </>
  );
}

