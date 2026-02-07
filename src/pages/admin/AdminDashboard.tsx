import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { getOrders, getDeliveryStats } from '../../store/ordersStore'
import PageHeader from '../../components/PageHeader'

export default function AdminDashboard() {
  const orders = getOrders()
  const deliveryStats = getDeliveryStats()
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const deliveredRevenue = orders
    .filter((o) => o.status === 'تم التوصيل')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <Box>
      <PageHeader
        title="نظرة عامة"
        subtitle="لوحة تحكم الأدمن – الطلبات والأداء المالي وشركات التوصيل"
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {orders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي الطلبات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800}>
                {totalRevenue} ₪
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي الإيرادات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {deliveredRevenue} ₪
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إيرادات الطلبات المُوصّلة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={800} color="secondary.main">
                {deliveryStats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                شركات التوصيل
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            ملخص شركات التوصيل
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {deliveryStats.map((s) => (
              <Card key={s.id} variant="outlined" sx={{ minWidth: 160 }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography fontWeight={700}>{s.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    طلبات: {s.orders} · مُوصّل: {s.delivered} · إيراد: {s.revenue} ₪
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
