import { useState, useEffect } from 'react'
import { getDeliveryStats, subscribe } from '../../store/ordersStore'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import PageHeader from '../../components/PageHeader'

export default function AdminDelivery() {
  const [stats, setStats] = useState(getDeliveryStats())

  useEffect(() => {
    return subscribe(() => setStats(getDeliveryStats()))
  }, [])

  return (
    <Box>
      <PageHeader
        title="شركات التوصيل"
        subtitle="متابعة أداء كل شركة توصيل"
      />
      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                  {s.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  عدد الطلبات: <strong>{s.orders}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  تم التوصيل: <strong>{s.delivered}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي الإيراد: <Typography component="span" fontWeight={700} color="primary.main">{s.revenue} ₪</Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
