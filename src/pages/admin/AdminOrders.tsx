import { useState, useEffect } from 'react'
import { getOrders, subscribe } from '../../store/ordersStore'
import { getDeliveryName } from '../../utils/orderHelpers'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import PageHeader from '../../components/PageHeader'

const statusColorMap = {
  'جديد': 'success' as const,
  'قيد التحضير': 'warning' as const,
  'جاهز للتوصيل': 'secondary' as const,
  'مع شركة التوصيل': 'primary' as const,
  'تم التوصيل': 'success' as const,
  'ملغي': 'error' as const,
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(getOrders())

  useEffect(() => {
    return subscribe(() => setOrders(getOrders()))
  }, [])

  return (
    <Box>
      <PageHeader
        title="كل الطلبات"
        subtitle="عرض وإدارة جميع طلبات المحل"
      />
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>رقم الطلب</TableCell>
              <TableCell>العميل</TableCell>
              <TableCell>الهاتف</TableCell>
              <TableCell>العنوان</TableCell>
              <TableCell>المنتجات</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>شركة التوصيل</TableCell>
              <TableCell>التاريخ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ fontFamily: 'monospace' }}>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell sx={{ maxWidth: 160 }}>{order.address}</TableCell>
                <TableCell sx={{ maxWidth: 140 }}>{order.items}</TableCell>
                <TableCell sx={{ color: 'primary.main' }}>{order.totalAmount} ₪</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    color={statusColorMap[order.status]}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{getDeliveryName(order.deliveryCompany)}</TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {new Date(order.createdAt).toLocaleDateString('ar-PS')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          لا توجد طلبات.
        </Typography>
      )}
    </Box>
  )
}
