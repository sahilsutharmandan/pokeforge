const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word)

const SPECIAL_NAMES: Record<string, string> = {
  'mr-mime': 'Mr. Mime',
  'mr-rime': 'Mr. Rime',
  'mime-jr': 'Mime Jr.',
  'type-null': 'Type: Null',
  'tapu-koko': 'Tapu Koko',
  'tapu-lele': 'Tapu Lele',
  'tapu-bulu': 'Tapu Bulu',
  'tapu-fini': 'Tapu Fini',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'porygon2': 'Porygon2',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'wo-chien': 'Wo-Chien',
  'chien-pao': 'Chien-Pao',
  'ting-lu': 'Ting-Lu',
  'chi-yu': 'Chi-Yu',
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'farfetchd': "Farfetch'd",
  'sirfetchd': "Sirfetch'd",
  'flabebe': 'Flabébé',
}

export const formatName = (slug: string) => {
  if (!slug) return ''
  const trimmed = slug.trim()
  const lower = trimmed.toLowerCase()
  if (SPECIAL_NAMES[lower]) {
    return SPECIAL_NAMES[lower]
  }
  if (trimmed.includes('-')) {
    return trimmed
      .split('-')
      .map((w) => capitalise(w))
      .join(' ')
  }
  return capitalise(trimmed)
}

export const formatDexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

export const round = (value: number, digits = 1) => Number(value.toFixed(digits))

export const toPercent = (value: number, max = 100) => Math.max(0, (value / max) * 100)

const formatMeasure = (value: number, unit: string) => `${round(value)} ${unit}`

export const formatHeight = (height: number) => formatMeasure(height, 'm')

export const formatWeight = (weight: number) => formatMeasure(weight, 'kg')

export const formatMultiplier = (value: number) => `${round(value)}×`
