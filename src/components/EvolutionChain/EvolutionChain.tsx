import { Link } from 'react-router-dom'
import { artworkUrl, type EvolutionNode } from '../../lib/api'
import { formatDexNumber, formatName } from '../../lib/format'
import { ArrowRightIcon } from '../Icons'
import styles from './EvolutionChain.module.css'

interface Props {
  chain: EvolutionNode
  currentId: number
}

function EvoCard({ node, current }: { node: EvolutionNode; current: boolean }) {
  return (
    <Link
      to={`/pokemon/${node.id}`}
      className={`${styles.card} ${current ? styles.current : ''}`}
      aria-current={current ? 'page' : undefined}
    >
      <img src={artworkUrl(node.id)} alt="" width={96} height={96} loading="lazy" className={styles.img} />
      <span className={styles.number}>{formatDexNumber(node.id)}</span>
      <span className={styles.name}>{formatName(node.name)}</span>
    </Link>
  )
}

function Stage({ node, currentId }: { node: EvolutionNode; currentId: number }) {
  const fan = node.children.length > 2
  return (
    <div className={`${styles.node} ${fan ? styles.fanNode : ''}`}>
      <EvoCard node={node} current={node.id === currentId} />
      {node.children.length > 0 && (
        <div className={`${styles.branches} ${fan ? styles.fan : ''}`}>
          {node.children.map((child) => (
            <div key={child.id} className={styles.branch}>
              <div className={styles.step}>
                <span className={styles.arrow}>
                  <ArrowRightIcon size={18} />
                </span>
                {child.method && <span className={styles.method}>{child.method}</span>}
              </div>
              <Stage node={child} currentId={currentId} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function EvolutionChain({ chain, currentId }: Props) {
  if (chain.children.length === 0) {
    return (
      <div className={styles.single}>
        <EvoCard node={chain} current={chain.id === currentId} />
        <p className={styles.note}>{formatName(chain.name)} does not evolve.</p>
      </div>
    )
  }
  return (
    <div className={styles.chain}>
      <Stage node={chain} currentId={currentId} />
    </div>
  )
}
