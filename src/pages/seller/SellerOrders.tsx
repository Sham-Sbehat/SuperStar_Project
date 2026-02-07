import { useState, useEffect } from 'react'
import {
  getOrders,
  updateOrderStatus,
  assignDelivery,
  subscribe,
} from '../../store/ordersStore'
import { getDeliveryName, DELIVERY_OPTIONS, STATUS_OPTIONS } from '../../utils/orderHelpers'
import type { OrderStatus, DeliveryCompanyId } from '../../types'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import PageHeader from '../../components/PageHeader'

const statusColorMap: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  'جديد': 'success',
  'قيد التحضير': 'warning',
  'جاهز للتوصيل': 'secondary',
  'مع شركة التوصيل': 'primary',
  'تم التوصيل': 'success',
  'ملغي': 'error',
}

export default function SellerOrders() {
  const [orders, setOrders] = useState(getOrders())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    return subscribe(() => setOrders(getOrders()))
  }, [])

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    setEditingId(null)
  }

  const handleSendToDelivery = (id: string, company: DeliveryCompanyId) => {
    assignDelivery(id, company)
    setSendingId(null)
  }

  return (
    <Box>
      <PageHeader
        title="الطلبات"
        subtitle="متابعة الطلبات وتحديث الحالة وإرسالها لشركات التوصيل"
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
              <TableCell>إجراءات</TableCell>
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
                  {editingId === order.id ? (
                    <Select
                      size="small"
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      sx={{ minWidth: 140 }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Chip
                      label={order.status}
                      size="small"
                      color={statusColorMap[order.status]}
                      variant="outlined"
                      onClick={() => setEditingId(order.id)}
                      sx={{ cursor: 'pointer', fontWeight: 600 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {sendingId === order.id ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {DELIVERY_OPTIONS.map((opt) => (
                        <Button
                          key={opt.value}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleSendToDelivery(order.id, opt.value)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                      <Button size="small" onClick={() => setSendingId(null)}>
                        إلغاء
                      </Button>
                    </Box>
                  ) : order.status === 'جاهز للتوصيل' && !order.deliveryCompany ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => setSendingId(order.id)}
                    >
                      إرسال للتوصيل
                    </Button>
                  ) : (
                    getDeliveryName(order.deliveryCompany)
                  )}
                </TableCell>
                <TableCell>
                  {editingId !== order.id && sendingId !== order.id && (
                    <Button size="small" variant="outlined" onClick={() => setEditingId(order.id)}>
                      تغيير الحالة
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          لا توجد طلبات حتى الآن.
        </Typography>
      )}
    </Box>
  )
}
