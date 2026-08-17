import { Button, BackButton } from '../components/ui'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-white px-5 py-20">
      <div className="text-center">
        <p className="mb-3 font-serif text-6xl font-bold text-kredent-navy">404</p>
        <h1 className="mb-2 text-xl font-semibold text-gray-900">Page not found</h1>
        <p className="mx-auto mb-8 max-w-sm text-sm text-gray-600">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/" variant="primary">
            Go to Homepage
          </Button>
          <Button to="/verify" variant="outline">
            Verify a Certificate
          </Button>
        </div>
        <div className="mt-6">
          <BackButton label="Go back" fallbackTo="/" className="mx-auto" />
        </div>
      </div>
    </section>
  )
}
