import { motion } from 'framer-motion'

/**
 * Dashboard statistic card: icon chip + label + value. Used for the
 * "at a glance" numbers on admin/dashboard-style pages.
 */
export function StatCard({ icon, iconBgClassName = 'bg-blue-100 text-blue-600', label, value, valueClassName = 'text-kredent-navy', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
