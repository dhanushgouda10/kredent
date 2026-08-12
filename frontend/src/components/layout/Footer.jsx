import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-kredent-navy text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-3 lg:px-10">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="heading-serif mb-3 text-2xl">Kredent</p>
          <p className="text-sm leading-relaxed text-white/75">
            MVJ College of Engineering's official platform for issuing and verifying tamper-proof
            digital degree certificates.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-widest text-kredent-accent">PLATFORM</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <Link to="/verify" className="transition hover:text-white">
                Verify a Certificate
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-white">
                Student Login
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="transition hover:text-white">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-widest text-kredent-accent">CONTACT</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>MVJCE, Whitefield, Bengaluru</li>
            <li>
              <a href="mailto:helpdesk@mvjce.edu.in" className="transition hover:text-white">
                helpdesk@mvjce.edu.in
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        Copyright © 2026 MVJCE · Powered by Kredent
      </div>
    </footer>
  )
}
