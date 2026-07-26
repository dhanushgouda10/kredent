export function Footer() {
  return (
    <footer className="bg-kredent-navy text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4 lg:px-10">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="heading-serif mb-3 text-2xl">Kredent</p>
          <p className="text-sm leading-relaxed text-white/75">
            Blockchain-powered digital degree verification for MVJCE.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-widest text-kredent-accent">ADMISSIONS</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="transition hover:text-white">Programmes</li>
            <li className="transition hover:text-white">Placements</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-widest text-kredent-accent">KEY LINKS</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="transition hover:text-white">Verify Certificate</li>
            <li className="transition hover:text-white">Admin Portal</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-widest text-kredent-accent">CONTACT</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>MVJCE, Whitefield, Bengaluru</li>
            <li className="transition hover:text-white">helpdesk@mvjce.edu.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        Copyright © 2026 MVJCE · Powered by Kredent
      </div>
    </footer>
  )
}
