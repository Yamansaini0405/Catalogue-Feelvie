import { CompassIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <div className="rounded-full bg-brand-50 p-4">
        <CompassIcon size={28} className="text-brand-600" />
      </div>
      <div>
        <p className="font-display text-3xl font-semibold text-slate-900">Page not found</p>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <Link to="/">
        <Button>Back to safety</Button>
      </Link>
    </main>
  )
}
