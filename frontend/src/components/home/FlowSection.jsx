import { motion } from 'framer-motion'

const nodes = ['Student', 'Wallet', 'Admin', 'Smart Contract', 'NFT', 'Verification']

export function FlowSection() {
  return (
    <section className="bg-gradient-to-br from-[#0f3470] to-kredent-navy py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <h2 className="heading-serif mb-10 text-center text-3xl sm:text-4xl">System Flow</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {nodes.map((node, idx) => (
            <motion.div
              key={node}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-white/20 bg-white/10 p-4 text-center text-sm font-semibold backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/15 sm:text-base"
            >
              {node}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
