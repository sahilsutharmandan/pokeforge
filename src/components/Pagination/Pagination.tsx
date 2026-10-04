import { ChevronLeftIcon, ChevronRightIcon } from '../Icons'
import styles from './Pagination.module.css'

interface Props {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

function pageList(page: number, count: number): (number | 'gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const edge = page <= 3 ? [2, 3, 4] : page >= count - 2 ? [count - 3, count - 2, count - 1] : []
  const pages = [...new Set([1, page - 1, page, page + 1, ...edge, count])]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b)
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? ['gap' as const, p] : [p]))
}

export function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <div className={styles.pages}>
        {pageList(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className={styles.gap}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={p}
              className={`${styles.page} ${p === page ? styles.current : ''}`}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
      </div>
      <span className={styles.compact}>
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  )
}
