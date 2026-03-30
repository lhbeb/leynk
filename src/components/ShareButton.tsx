'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
}

// Custom Share Icon SVG
const ShareIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
  >
    <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96H80a8,8,0,0,1,0,16H56v96H200V112H176a8,8,0,0,1,0-16h24A16,16,0,0,1,216,112ZM93.66,69.66,120,43.31V136a8,8,0,0,0,16,0V43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,69.66Z"></path>
  </svg>
);

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = async () => {
    // Always use the current page URL
    const shareUrl = typeof window !== 'undefined' ? window.location.href : (url || '');
    const shareTitle = title || 'Check out my Leynk page';

    if (!shareUrl) {
      console.error('No URL available for sharing');
      return;
    }

    // Check if Web Share API is available (mobile devices and some desktop browsers)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareTitle,
          url: shareUrl,
        });
        return; // Successfully shared via native share
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to copy
          copyToClipboard(shareUrl);
        }
        return;
      }
    }
    
    // Fallback to copy for desktop browsers without Web Share API
    copyToClipboard(shareUrl);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => {
          setCopied(false);
          setShowTooltip(false);
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="w-10 h-10 rounded-full bg-white border border-accent/20 text-text-primary flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-all shadow-sm hover:shadow-md"
        title="Share this page"
      >
        {copied ? (
          <Check className="text-accent" size={20} />
        ) : (
          <ShareIcon className="text-accent" />
        )}
      </button>

      {showTooltip && copied && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-text-primary text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap animate-fade-in z-10">
          Link copied to clipboard!
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-text-primary"></div>
        </div>
      )}
    </div>
  );
}

