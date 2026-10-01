import { useEffect, useState, type DependencyList } from 'react'

export interface AsyncState<T> {
  data: T | undefined
  error: Error | undefined
  loading: boolean
}

export function useAsync<T>(load: () => Promise<T> | null, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true })

  useEffect(() => {
    let active = true
    const promise = load()
    if (!promise) {
      setState({ data: undefined, error: undefined, loading: false })
      return
    }
    setState((s) => ({ data: s.data, error: undefined, loading: true }))
    promise.then(
      (data) => active && setState({ data, error: undefined, loading: false }),
      (error: Error) => active && setState({ data: undefined, error, loading: false }),
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
