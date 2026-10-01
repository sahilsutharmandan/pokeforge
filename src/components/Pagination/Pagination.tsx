import { ChevronLeftIcon, ChevronRightIcon } from '../Icons'
import styles from './Pagination.module.css'

interface Props {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

function pageList(page: number, count: number): (number | 'gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const pages = new Set([1, count, page - 1, page, page + 1])
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (page >= count - 2) [count - 3, count - 2, count - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
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
