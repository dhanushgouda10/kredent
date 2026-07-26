import { motion } from 'framer-motion'

export function InfoSection({ title, description, image, reverse = false }) {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={reverse ? 'lg:order-last' : ''}
      >
        <h2 className="heading-serif mb-4 text-3xl font-bold leading-tight text-kredent-navy sm:text-4xl">{title}</h2>
        <p className="text-base leading-8 text-[#334d72] sm:text-[17px]">{description}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`overflow-hidden rounded-xl shadow-[var(--shadow-card)] ${reverse ? 'lg:order-first' : ''}`}
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </section>
  )
}
