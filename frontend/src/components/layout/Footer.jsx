import { Link } from 'react-router-dom'
import { ScrollToTopButton } from '../ui/ScrollToTopButton'

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-kredent-navy to-[#041a3c] text-white">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-accent" />

      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:grid-cols-2 md:grid-cols-4 lg:px-10">
        {/* Column 1: MVJCE Brand & Address */}
        <div className="sm:col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center space-x-3">
            <img src="/MVJCE_-_New_Logo.png" alt="MVJCE Logo" className="h-12 w-12 object-contain bg-white rounded-lg p-1" />
            <div>
              <p className="heading-serif text-2xl font-bold text-white">KREDENT</p>
              <p className="text-[10px] tracking-widest text-kredent-accent font-semibold">MVJ COLLEGE OF ENGINEERING</p>
            </div>
          </div>
          
          <p className="text-xs leading-relaxed text-slate-300">
            An Autonomous Institution established in 1982. Official platform for issuing and verifying tamper-proof digital degree certificates on the blockchain.
          </p>

          <div className="text-xs space-y-1 text-slate-400">
            <p className="font-semibold text-white">ADDRESS</p>
            <p>MVJ College of Engineering,</p>
            <p>Near ITPB, Whitefield, Bangalore-560 067</p>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-kredent-accent uppercase">PLATFORM NAV</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>
              <Link to="/" className="transition-colors hover:text-kredent-accent flex items-center gap-1.5">
                <span className="text-kredent-accent">›</span> Home
              </Link>
            </li>
            <li>
              <Link to="/verify" className="transition-colors hover:text-kredent-accent flex items-center gap-1.5">
                <span className="text-kredent-accent">›</span> Verify a Certificate
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition-colors hover:text-kredent-accent flex items-center gap-1.5">
                <span className="text-kredent-accent">›</span> Student Portal Login
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="transition-colors hover:text-kredent-accent flex items-center gap-1.5">
                <span className="text-kredent-accent">›</span> Administration Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-kredent-accent uppercase">CONTACT MVJCE</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <span className="text-slate-400">Board Line:</span> <br />
              <a href="tel:+918042991000" className="font-mono text-white hover:text-kredent-accent">+91 80 4299 1000</a>
            </li>
            <li>
              <span className="text-slate-400">Reception:</span> <br />
              <a href="tel:+918042991007" className="font-mono text-white hover:text-kredent-accent">+91 80 4299 1007</a>
            </li>
            <li>
              <span className="text-slate-400">Placement Cell:</span> <br />
              <a href="tel:+918042991030" className="font-mono text-white hover:text-kredent-accent">+91 80 4299 1030</a>
            </li>
            <li className="pt-1">
              <span className="text-slate-400">Mail Us:</span> <br />
              <a href="mailto:helpdesk@mvjce.edu.in" className="text-white underline decoration-kredent-accent hover:text-kredent-accent">
                helpdesk@mvjce.edu.in
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Verification & Trust */}
        <div>
          <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-kredent-accent uppercase">TRUST &amp; SECURITY</h4>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Polygon Blockchain
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Certificates are fingerprinted with SHA-256 and locked on-chain. Independent verification runs live against smart contracts.
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <span className="text-[11px] font-semibold text-slate-400">For Admissions:</span>
            <a href="tel:+918150811811" className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-kredent-accent hover:bg-white/20">
              +91 81 508 11 811
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Socials & Copyright */}
      <div className="border-t border-white/10 bg-black/20 py-5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-5 sm:flex-row lg:px-10">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            Copyright © 2026 MVJCE. All rights reserved. | <span className="text-slate-300">Powered by Kredent</span>
          </p>
          
          <div className="flex items-center space-x-3">
            {/* Social link buttons matching reference image 1 */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-kredent-accent">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-kredent-accent">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-kredent-accent">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.261-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </footer>
  )
}

