import { Link, Outlet, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { UserRole } from '../types'

const roleConfig: Record<UserRole, { title: string }> = {
  seller: { title: 'لوحة البائع' },
  admin: { title: 'لوحة الأدمن' },
}

interface LayoutProps {
  role: UserRole
}

export default function Layout({ role }: LayoutProps) {
  const navigate = useNavigate()
  const config = roleConfig[role]
  const base = role === 'seller' ? '/seller' : '/admin'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#0d47a1',
          borderRadius: 0,
          borderBottom: '1px solid rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
          <Typography variant="h6" component={Link} to={base} sx={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
            Super Star – {config.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate(role === 'seller' ? '/admin' : '/seller')}
              sx={{ color: 'white', fontWeight: 500 }}
            >
              {role === 'seller' ? 'الأدمن' : 'البائع'}
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/')}
              sx={{ color: 'white', fontWeight: 500 }}
            >
              تسجيل خروج
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1, p: 3, overflow: 'auto', minHeight: 0 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
