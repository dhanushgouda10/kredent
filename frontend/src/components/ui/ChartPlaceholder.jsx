/**
 * Visual placeholder for a future analytics chart. Deliberately not wired to
 * any data — this is UI scaffolding only, per the "don't implement charts
 * yet" instruction. Swap the inner content for a real chart library later
 * without touching the surrounding card.
 */
export function ChartPlaceholder({ label = 'Chart data will appear here', height = 'h-56' }) {
  const bars = [40, 65, 45, 80, 60, 90, 70]

  return (
    <div className={`relative flex ${height} flex-col justify-end overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-6`}>
      <div className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 shadow-sm">
        Preview
      </div>
      <div className="flex h-full items-end gap-3">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-kredent-navy/15 to-kredent-navy/5"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs font-medium text-gray-400">{label}</p>
    </div>
  )
}
