import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col">
      <nav className="border-b border-white/[0.08] sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight">
            <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/[0.06] py-10 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link href="/" className="font-bold text-base tracking-tight">
              <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
              <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
              <Link href="/changelog" className="hover:text-zinc-400 transition-colors">Changelog</Link>
              <Link href="/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            </div>
            <span className="text-zinc-700 text-sm">© {new Date().getFullYear()} DealTrack</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
