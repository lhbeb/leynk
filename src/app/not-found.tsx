import Link from 'next/link';
import Image from 'next/image';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image 
            src="/leynk-logo.svg" 
            alt="Leynk" 
            width={200} 
            height={55}
            priority
          />
        </div>
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-primary/70 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all hover:shadow-lg"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

