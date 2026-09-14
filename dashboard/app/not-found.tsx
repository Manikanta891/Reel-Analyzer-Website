import Link from 'next/link';
import { Folder } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="text-center p-8 rounded-2xl bg-zinc-900/50 border border-white/[0.08] max-w-md w-full">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center border border-white/[0.06]">
          <Folder className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-bold text-white mb-1">Page Not Found</h2>
        <p className="text-xs text-zinc-400 mb-5">
          The requested page or resource could not be found.
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        >
          Return to Vault
        </Link>
      </div>
    </div>
  );
}
