import type { Pokemon } from '../../lib/api'
import { formatName } from '../../lib/format'
import { STAT_LABELS, STAT_ORDER, statValue } from '../../lib/stats'
import { useElementWidth } from '../../hooks/useElementWidth'
import styles from './CompareChart.module.css'

interface Props {
  a: Pokemon
  b: Pokemon
}

const PAD = { top: 12, right: 16, bottom: 28, left: 44 }
const ROW = 48
const BAR = 15
const GAP = 4

export function CompareChart({ a, b }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const series = [a, b]
  const values = series.flatMap((p) => STAT_ORDER.map((k) => statValue(p.stats, k)))
  const max = Math.max(100, ...values)
  const plotWidth = Math.max(80, width - PAD.left - PAD.right)
  const height = PAD.top + PAD.bottom + ROW * STAT_ORDER.length
  const scale = (v: number) => (v / max) * plotWidth
  const ticks = [0, 50, 100, 150, 200, 250].filter((t) => t <= max)

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        {series.map((p, i) => (
          <span key={`${p.id}-${i}`} className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles[`swatch${i}`]}`} />
            {formatName(p.name)}
          </span>
        ))}
      </div>

      <div ref={ref} className={styles.chart}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`Base stats of ${formatName(a.name)} and ${formatName(b.name)}`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left + scale(t)}
                x2={PAD.left + scale(t)}
                y1={PAD.top}
                y2={height - PAD.bottom}
                className={styles.grid}
              />
              <text x={PAD.left + scale(t)} y={height - PAD.bottom + 18} className={styles.tick} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}

          {STAT_ORDER.map((key, row) => {
            const top = PAD.top + row * ROW + (ROW - (BAR * 2 + GAP)) / 2
            return (
              <g key={key}>
                <text x={PAD.left - 14} y={top + BAR + GAP / 2 + 4} className={styles.label} textAnchor="end">
                  {STAT_LABELS[key]}
                </text>
                {series.map((p, i) => {
                  const v = statValue(p.stats, key)
                  const y = top + i * (BAR + GAP)
                  return (
                    <g key={i}>
                      <rect
                        x={PAD.left}
                        y={y}
                        width={Math.max(2, scale(v))}
                        height={BAR}
                        rx={4}
                        className={`${styles.bar} ${styles[`bar${i}`]}`}
                      />
                      <text x={PAD.left + scale(v) + 6} y={y + BAR - 3} className={styles.value}>
                        {v}
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
