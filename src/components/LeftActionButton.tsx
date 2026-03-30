'use client';

import Link from 'next/link';

export default function LeftActionButton() {
  return (
    <Link
      href="/"
      className="w-10 h-10 rounded-full bg-white border border-accent/20 text-text-primary flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-all shadow-sm hover:shadow-md"
      title="Go to home"
    >
      <img
        src="/button-icon.svg"
        alt="Home"
        width={20}
        height={20}
        className="w-5 h-5"
      />
    </Link>
  );
}

