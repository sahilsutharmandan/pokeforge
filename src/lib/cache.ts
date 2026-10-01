const PREFIX = 'pokeforge-cache:v1:'

const memory = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

export function readCache<T>(key: string): T | undefined {
  if (memory.has(key)) return memory.get(key) as T
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    if (raw !== null) {
      const value = JSON.parse(raw) as T
      memory.set(key, value)
      return value
    }
  } catch {
    // sessionStorage unavailable
  }
  return undefined
}

function writeCache<T>(key: string, value: T) {
  memory.set(key, value)
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // quota exceeded, keep it in memory only
  }
}

export function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = readCache<T>(key)
  if (hit !== undefined) return Promise.resolve(hit)

  const pending = inflight.get(key)
  if (pending) return pending as Promise<T>

  const request = load().then(
    (value) => {
      inflight.delete(key)
      writeCache(key, value)
      return value
    },
    (error) => {
      inflight.delete(key)
      throw error
    },
  )
  inflight.set(key, request)
  return request
}
