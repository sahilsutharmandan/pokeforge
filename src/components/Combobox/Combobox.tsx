import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { DexEntry } from '../../lib/api'
import { formatDexNumber, formatName } from '../../lib/format'
import { rankMatches } from '../../lib/search'
import { SearchIcon } from '../Icons'
import styles from './Combobox.module.css'

const spriteUrl = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

interface Props {
  label: string
  options: DexEntry[]
  value: string
  onChange: (value: string) => void
  onSelect: (entry: DexEntry) => void
  placeholder?: string
  limit?: number
  size?: 'md' | 'lg'
  hideLabel?: boolean
}

export function Combobox({
  label,
  options,
  value,
  onChange,
  onSelect,
  placeholder = 'Search Pokémon',
  limit = 20,
  size = 'lg',
  hideLabel = true,
}: Props) {
  const id = useId()
  const listId = `${id}-list`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(
    () => (value.trim() ? rankMatches(options, value, limit) : []),
    [options, value, limit],
  )

  useEffect(() => {
    setActive(-1)
  }, [matches])

  const showList = open && value.trim().length > 0

  useEffect(() => {
    if (!showList) return
    const list = listRef.current
    const item = list?.children[active] as HTMLElement | undefined
    if (!list || !item) return
    const bounds = list.getBoundingClientRect()
    const row = item.getBoundingClientRect()
    if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top
    else if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom
  }, [active, showList])

  const pick = (entry: DexEntry) => {
    setOpen(false)
    setActive(-1)
    onSelect(entry)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setOpen(true)
        if (matches.length) setActive((i) => (i + 1) % matches.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setOpen(true)
        if (matches.length) setActive((i) => (i <= 0 ? matches.length - 1 : i - 1))
        break
      case 'Enter':
        if (showList && active >= 0 && matches[active]) {
          e.preventDefault()
          pick(matches[active])
        } else {
          setOpen(false)
        }
        break
      case 'Escape':
        if (showList) setOpen(false)
        else onChange('')
        break
    }
  }

  return (
    <div className={`${styles.combobox} ${styles[size]}`}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <span className={styles.icon}>
          <SearchIcon size={18} />
        </span>
        <input
          id={id}
          className={styles.input}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange('')}
          >
            ×
          </button>
        )}
      </div>

      {showList && (
        <div className={styles.popover}>
          {matches.length === 0 ? (
            <p className={styles.empty}>No Pokémon match “{value.trim()}”</p>
          ) : (
            <ul id={listId} role="listbox" className={styles.list} ref={listRef} aria-label={label}>
              {matches.map((entry, i) => (
                <li
                  key={entry.id}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`${styles.option} ${i === active ? styles.active : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => active !== i && setActive(i)}
                  onClick={() => pick(entry)}
                >
                  <img src={spriteUrl(entry.id)} alt="" width={40} height={40} loading="lazy" className={styles.sprite} />
                  <span className={styles.optionName}>{formatName(entry.name)}</span>
                  <span className={styles.optionNumber}>{formatDexNumber(entry.id)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.footer} aria-hidden="true">
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move <kbd>Enter</kbd> to open <kbd>Esc</kbd> to close
          </div>
        </div>
      )}
    </div>
  )
}
