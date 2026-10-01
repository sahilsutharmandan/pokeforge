import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import DexPage from './pages/DexPage'
import DetailPage from './pages/DetailPage'
import TeamPage from './pages/TeamPage'
import FavouritesPage from './pages/FavouritesPage'
import ComparePage from './pages/ComparePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DexPage />} />
        <Route path="pokemon/:id" element={<DetailPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
