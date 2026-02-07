import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { getOrders } from '../../store/ordersStore'
import PageHeader from '../../components/PageHeader'

export default function SellerDashboard() {
  const orders = getOrders()
  const pending = orders.filter((o) => !['تم التوصيل', 'ملغي'].includes(o.status)).length
  const readyToShip = orders.filter((o) => o.status === 'جاهز للتوصيل').length
  const totalToday = orders.filter((o) => {
    const d = new Date(o.createdAt).toDateString()
    return d === new Date().toDateString()
  }).length

  const stats = [
    { value: orders.length, label: 'إجمالي الطلبات', color: 'primary.main' as const },
    { value: pending, label: 'طلبات قيد التنفيذ', color: 'text.primary' as const },
    { value: readyToShip, label: 'جاهزة للتوصيل', color: 'secondary.main' as const },
    { value: totalToday, label: 'طلبات اليوم', color: 'text.primary' as const },
  ]

  return (
    <Box>
      <PageHeader
        title="لوحة تحكم البائع"
        subtitle="نظرة سريعة على الطلبات والإجراءات"
      />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            إجراءات سريعة
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button component={Link} to="/seller/new" variant="contained">
              + إضافة طلب جديد
            </Button>
            <Button component={Link} to="/seller/orders" variant="outlined" color="secondary">
              عرض كل الطلبات
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
