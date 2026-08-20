import { motion } from 'framer-motion'
import { ParallaxLayer } from '../ui'

export function InfoSection({ title, description, image, reverse = false }) {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <ParallaxLayer speed={0.06} className="pointer-events-none absolute right-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-kredent-navy/5 blur-3xl" aria-hidden="true" />
      
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={reverse ? 'lg:order-last' : ''}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-kredent-accent/10 px-3.5 py-1">
            <span className="h-2 w-2 rounded-full bg-kredent-accent" />
            <span className="text-xs font-bold tracking-widest text-kredent-accent uppercase">Institutional Need</span>
          </div>

          <h2 className="heading-serif mb-6 text-3xl font-extrabold text-kredent-navy sm:text-4xl lg:text-5xl leading-tight">
            About <span className="text-gradient-accent">MVJCE Kredent</span>
          </h2>
          
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="mt-8 flex items-center gap-6 border-t border-slate-100 pt-6">
            <div>
              <p className="font-serif text-2xl font-bold text-kredent-navy">100%</p>
              <p className="text-xs font-medium text-slate-500">Tamper Proof</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="font-serif text-2xl font-bold text-kredent-accent">Polygon</p>
              <p className="text-xs font-medium text-slate-500">Public Ledger</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="font-serif text-2xl font-bold text-kredent-navy">&lt; 3s</p>
              <p className="text-xs font-medium text-slate-500">Verification Time</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`relative ${reverse ? 'lg:order-first' : ''}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 hover:shadow-kredent-navy/10">
            <img src={image} alt={title} className="h-72 w-full object-cover sm:h-96" />
            <div className="absolute inset-0 bg-gradient-to-t from-kredent-navy/80 via-kredent-navy/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="rounded bg-kredent-accent px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-white">
                MVJCE Whitefield Campus
              </span>
              <h3 className="heading-serif mt-2 text-xl font-bold sm:text-2xl text-white">
                Engineering A Better Tomorrow
              </h3>
            </div>
          </div>

          {/* Floating Campus Badge inspired by MVJCE tour badge in reference image 2 */}
          <ParallaxLayer speed={-0.06} className="absolute -bottom-5 -left-5 z-20 hidden sm:block">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-white shadow-md">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-kredent-navy">Autonomous Institution</p>
                <p className="text-[11px] text-slate-500">Established 1982</p>
              </div>
            </div>
          </ParallaxLayer>
        </motion.div>
      </div>
    </section>
  )
}

