import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import Layout from './components/Layout'
import RoleSelect from './pages/RoleSelect'
import SellerView from './pages/seller/SellerView'
import AdminView from './pages/admin/AdminView'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter  basename="/SuperStar_Project/">
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/seller" element={<Layout role="seller" />}>
            <Route index element={<SellerView />} />
          </Route>
          <Route path="/admin" element={<Layout role="admin" />}>
            <Route index element={<AdminView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
