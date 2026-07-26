import { motion } from 'framer-motion'
import { HeroSection } from '../components/home/HeroSection'
import { InfoSection } from '../components/home/InfoSection'
import { FlowSection } from '../components/home/FlowSection'
import aboutImage from '../assets/images/home-about.png'

const stats = [
  { value: '18,400+', label: 'Certificates Issued' },
  { value: '99.99%', label: 'Verification Uptime' },
  { value: '07 sec', label: 'Average Validation Time' },
  { value: '0', label: 'Forgery Breaches' },
  { value: '26,000+', label: 'Verified Alumni Records' },
]

export function HomePage() {
  return (
    <>
      <HeroSection />
      <InfoSection
        title="About Kredent"
        description="Kredent modernizes MVJCE degree authentication by issuing tamper-proof credentials on blockchain. Built with institutional trust in mind, the platform lets students share verifiable records while employers and institutions validate authenticity instantly through immutable transaction logs."
        image={aboutImage}
      />
      <section className="bg-kredent-navy py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
          <h2 className="heading-serif mb-10 text-center text-3xl text-white sm:text-4xl">
            Strengths of Kredent at a Glance
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="rounded-full border border-dashed border-[#4f6ea8] bg-[#103872]/85 p-6 text-center text-white shadow-[var(--shadow-card)] transition-colors duration-200 hover:border-kredent-accent/60"
              >
                <p className="heading-serif text-3xl font-bold sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FlowSection />
    </>
  )
}
