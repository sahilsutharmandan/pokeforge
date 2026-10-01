import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useFavourites, useTeam, useTheme, TEAM_SIZE } from '../../state/AppContext'
import { CompareIcon, GridIcon, HeartIcon, MoonIcon, SunIcon, UsersIcon } from '../Icons'
import { Logo } from './Logo'
import styles from './Layout.module.css'

export function Layout() {
  const { theme, toggle } = useTheme()
  const { team } = useTeam()
  const { favourites } = useFavourites()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const links = [
    { to: '/', label: 'Pokédex', icon: <GridIcon />, end: true },
    { to: '/team', label: 'Team', icon: <UsersIcon />, badge: `${team.length}/${TEAM_SIZE}` },
    { to: '/compare', label: 'Compare', icon: <CompareIcon /> },
    { to: '/favourites', label: 'Favourites', icon: <HeartIcon />, badge: favourites.length || undefined },
  ]

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <Logo />
            <span>
              Poke<strong>Forge</strong>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{l.icon}</span>
                <span className={styles.navLabel}>{l.label}</span>
                {l.badge !== undefined && <span className={styles.navBadge}>{l.badge}</span>}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        Data from <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokeAPI</a>. Pokémon and Pokémon
        character names are trademarks of Nintendo.
      </footer>
    </div>
  )
}
