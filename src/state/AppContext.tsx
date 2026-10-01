import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { storage } from '../lib/storage'

export type Theme = 'light' | 'dark'

export const TEAM_SIZE = 6

export interface TeamMember {
  key: string
  id: number
}

interface State {
  theme: Theme
  team: TeamMember[]
  favourites: number[]
}

type Action =
  | { type: 'theme/toggle' }
  | { type: 'team/add'; id: number }
  | { type: 'team/remove'; key: string }
  | { type: 'team/clear' }
  | { type: 'favourites/toggle'; id: number }

function initialTheme(): Theme {
  const saved = storage.get<Theme | null>('theme', null)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function init(): State {
  return {
    theme: initialTheme(),
    team: storage.get<TeamMember[]>('team', []),
    favourites: storage.get<number[]>('favourites', []),
  }
}

let keySeed = 0
const newKey = () => `${Date.now().toString(36)}-${(keySeed++).toString(36)}`

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'theme/toggle':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'team/add':
      if (state.team.length >= TEAM_SIZE) return state
      return { ...state, team: [...state.team, { key: newKey(), id: action.id }] }
    case 'team/remove':
      return { ...state, team: state.team.filter((m) => m.key !== action.key) }
    case 'team/clear':
      return { ...state, team: [] }
    case 'favourites/toggle': {
      const has = state.favourites.includes(action.id)
      return {
        ...state,
        favourites: has ? state.favourites.filter((id) => id !== action.id) : [...state.favourites, action.id],
      }
    }
    default:
      return state
  }
}

const StateContext = createContext<State | null>(null)
const DispatchContext = createContext<Dispatch<Action> | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    storage.set('theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    storage.set('team', state.team)
  }, [state.team])

  useEffect(() => {
    storage.set('favourites', state.favourites)
  }, [state.favourites])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function useAppState() {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppProvider')
  return ctx
}

function useAppDispatch() {
  const ctx = useContext(DispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be used inside AppProvider')
  return ctx
}

export function useTheme() {
  const { theme } = useAppState()
  const dispatch = useAppDispatch()
  return useMemo(() => ({ theme, toggle: () => dispatch({ type: 'theme/toggle' }) }), [theme, dispatch])
}

export function useTeam() {
  const { team } = useAppState()
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      team,
      isFull: team.length >= TEAM_SIZE,
      add: (id: number) => dispatch({ type: 'team/add', id }),
      remove: (key: string) => dispatch({ type: 'team/remove', key }),
      clear: () => dispatch({ type: 'team/clear' }),
    }),
    [team, dispatch],
  )
}

export function useFavourites() {
  const { favourites } = useAppState()
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      favourites,
      isFavourite: (id: number) => favourites.includes(id),
      toggle: (id: number) => dispatch({ type: 'favourites/toggle', id }),
    }),
    [favourites, dispatch],
  )
}
