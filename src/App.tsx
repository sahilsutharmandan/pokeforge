import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import DexPage from './pages/DexPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DexPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
