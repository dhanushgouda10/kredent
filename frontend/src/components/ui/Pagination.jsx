/**
 * Simple server-side pagination control — used by any admin table backed by a paginated API
 * (PageResponse: page, totalPages, totalElements, last). Shared across Students, Certificate
 * Registry, and Audit Logs so pagination looks and behaves the same everywhere in the admin
 * portal.
 */
export function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalElements === 0) return null

  const from = page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, totalElements)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{from}</span>–
        <span className="font-medium text-gray-900">{to}</span> of{' '}
        <span className="font-medium text-gray-900">{totalElements}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 0}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
