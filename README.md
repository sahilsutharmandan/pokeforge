# PokeForge

A Pokédex and team builder built with React 18, TypeScript, Vite, React Router and hand-written CSS Modules.

## Features

- **Pokédex** - Browse all 1,025 Pokémon with a search combobox (autocomplete + keyboard navigation), type filter chips, generation filter, sorting and pagination
- **Pokémon Detail** - Official artwork with a shiny toggle, type badges, Pokédex entry, height/weight, abilities, base stat bars with total, evolution chain (including branching chains like Eevee) and a type-effectiveness grid
- **Team Builder** - Six team slots, add from the Pokédex or the quick picker, and a team type coverage summary (shared weaknesses and offensive coverage)
- **Compare** - Put two Pokémon side by side with an SVG stat chart and a head-to-head table
- **Favourites** - Heart any Pokémon and find it again later
- **Dark/Light Theme** - Follows the system preference, toggle persists in localStorage
- **Responsive** - Works on desktop, tablet and mobile (bottom navigation on phones)

## API Used

- [PokeAPI](https://pokeapi.co/) - Pokémon, species, evolution chain and type data (no API key required)
  - `pokemon-species?limit=1025` - Pokédex index
  - `pokemon/{id}` - types, stats, abilities, artwork
  - `pokemon-species/{id}` - flavour text, genus, generation, evolution chain id
  - `evolution-chain/{id}` - evolution tree
  - `type/{name}` - damage relations and the Pokémon of each type

Responses are normalised and cached in memory and `sessionStorage`, so each resource is only fetched once per session. Teams, favourites and the theme are stored in `localStorage`. There is no backend.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router (browser history)
- React Context + `useReducer` for team, favourites and theme
- CSS Modules with CSS custom properties for theming
