import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #FDF5EC 0%, #F7F7EF 45%, #EEF7FA 100%)' }}>
      <div className="w-full max-w-md m-auto bg-white/60 backdrop-blur-md rounded-3xl p-10 border border-accent/15 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image src="/leynk-logo.svg" alt="Leynk" width={160} height={44} />
          </Link>
          <h1 className="text-2xl font-bold mt-8 text-text-primary">Welcome Back</h1>
          <p className="text-text-primary/60 mt-2">Log in to manage your Leynk</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert("Fake Login Successful!"); }} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white" required />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-text-primary">Password</label>
              <span className="text-sm text-accent cursor-pointer hover:underline">Forgot?</span>
            </div>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white" required />
          </div>
          
          <button type="submit" className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 mt-4">
            Log In
          </button>
        </form>

        <p className="text-center text-text-primary/60 text-sm mt-8">
          Don't have an account yet? <Link href="/signup" className="text-accent font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
