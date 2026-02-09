import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import logo2 from '../assets/logo2.png'
import sky from '../assets/sky.jpg'

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundImage: `url(${sky})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            mb: 2,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(255,255,255,0.06)',
          }}
        >
          <Box
            component="img"
            src={logo2}
            alt="Super Star"
            sx={{
              width: 280,
              filter: 'drop-shadow(0 2px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 24px rgba(255, 220, 150, 0.25))',
              animation: 'logoAppear 0.9s ease-out forwards, logoRotate 28s linear 0.9s infinite',
            }}
          />
        </Box>
        <Typography
          variant="h1"
          fontWeight={800}
          gutterBottom
          sx={{
            color: 'white',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          Super Star Orders
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 360, mx: 'auto', color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          منصة إدارة طلبات سوبر ستار للأزياء – جنين
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          maxWidth: 500,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          onClick={() => navigate('/seller')}
          sx={{
            flex: 1,
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            bgcolor: 'rgba(255, 255, 255, 0.78)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#1a1a1a' }}>
              واجهة البائع
            </Typography>
            <Typography variant="body2" paragraph sx={{ mb: 1.5, lineHeight: 1.6, color: '#555', fontSize: '0.875rem' }}>
              إدخال الطلبات، متابعة الحالة، ورفعها لشركات التوصيل
            </Typography>
            <Button variant="contained" size="small" fullWidth sx={{ mt: 'auto', py: 1, borderRadius: 2, fontWeight: 600 }}>
              الدخول
            </Button>
          </CardContent>
        </Card>

        <Card
          onClick={() => navigate('/admin')}
          sx={{
            flex: 1,
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            bgcolor: 'rgba(255, 255, 255, 0.78)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#1a1a1a' }}>
              واجهة الأدمن
            </Typography>
            <Typography variant="body2" paragraph sx={{ mb: 1.5, lineHeight: 1.6, color: '#555', fontSize: '0.875rem' }}>
              الطلبات، الحسابات المالية، وشركات التوصيل
            </Typography>
            <Button variant="contained" size="small" fullWidth sx={{ mt: 'auto', py: 1, borderRadius: 2, fontWeight: 600 }}>
              الدخول
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
