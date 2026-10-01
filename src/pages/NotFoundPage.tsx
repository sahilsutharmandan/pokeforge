import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        title="This route ran away"
        message="The page you were looking for doesn't exist."
        action={
          <Link to="/" className="btn btn-primary">
            Back to the Pokédex
          </Link>
        }
      />
    </div>
  )
}
