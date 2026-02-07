import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import {
  addOrder,
  getOrders,
  updateOrderStatus,
  assignDelivery,
  subscribe,
} from '../../store/ordersStore'
import { getDeliveryName, DELIVERY_OPTIONS, STATUS_OPTIONS } from '../../utils/orderHelpers'
import type { OrderStatus, DeliveryCompanyId } from '../../types'

interface OrderFormValues {
  customerName: string
  phone: string
  address: string
  items: string
  totalAmount: string
  deliveryCompany: DeliveryCompanyId
  notes: string
}

const statusColorMap: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  'جديد': 'success',
  'قيد التحضير': 'warning',
  'جاهز للتوصيل': 'secondary',
  'مع شركة التوصيل': 'primary',
  'تم التوصيل': 'success',
  'ملغي': 'error',
}

export default function SellerView() {
  const [tab, setTab] = useState(0)
  const [orders, setOrders] = useState(getOrders())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrderFormValues>({
    defaultValues: {
      customerName: '',
      phone: '',
      address: '',
      items: '',
      totalAmount: '',
      deliveryCompany: 'aramex',
      notes: '',
    },
  })

  useEffect(() => subscribe(() => setOrders(getOrders())), [])

  const onSubmit = (data: OrderFormValues) => {
    const amount = parseFloat(data.totalAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    addOrder({
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      items: data.items.trim(),
      totalAmount: amount,
      deliveryCompany: data.deliveryCompany,
      notes: data.notes?.trim() || undefined,
    })
    reset()
    setTab(1)
  }

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    setEditingId(null)
  }

  const handleSendToDelivery = (id: string, company: DeliveryCompanyId) => {
    assignDelivery(id, company)
    setSendingId(null)
  }

  const inputRtl = {
    '& .MuiInputBase-input': { textAlign: 'right', direction: 'rtl' },
    '& .MuiInputBase-inputMultiline': { textAlign: 'right', direction: 'rtl' },
  }
  const inputRtlStyle = { textAlign: 'right' as const, direction: 'rtl' as const }
  const sectionTitle = {
    fontWeight: 700,
    fontSize: '1rem',
    textAlign: 'right' as const,
    mb: 2,
    pb: 1,
    borderBottom: '2px solid',
    borderColor: 'primary.main',
    color: 'primary.dark',
  }
  const sectionBox = {
    p: 2.5,
    borderRadius: 2,
    bgcolor: 'grey.50',
    border: '1px solid',
    borderColor: 'grey.200',
    mb: 3,
  }

  return (
    <Box sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, direction: 'rtl', textAlign: 'right' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'primary.dark', letterSpacing: '-0.02em' }}>
          واجهة البائع
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
          إدخال الطلبات، متابعة الحالة، ورفعها لشركات التوصيل
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { bgcolor: 'primary.main', height: 4, borderRadius: '4px 4px 0 0' },
          '& .MuiTab-root': { minHeight: 52, fontSize: '1rem', fontWeight: 600 },
          '& .Mui-selected': { color: 'primary.dark' },
        }}
      >
        <Tab label="إدخال طلب جديد" />
        <Tab label="سجل الطلبات" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: '4px solid', borderTopColor: 'primary.main' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate dir="rtl">
              <Box sx={sectionBox}>
                <Typography variant="subtitle1" sx={sectionTitle}>
                  معلومات العميل وعنوان التوصيل
                </Typography>
                <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('customerName', { required: 'مطلوب' })}
                    label="اسم العميل"
                    fullWidth
                    size="medium"
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('phone', { required: 'مطلوب' })}
                    label="رقم الهاتف"
                    fullWidth
                    size="medium"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    {...register('address', { required: 'مطلوب' })}
                    label="عنوان التوصيل"
                    fullWidth
                    size="medium"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                  />
                </Grid>
              </Grid>
              </Box>

              <Box sx={sectionBox}>
                <Typography variant="subtitle1" sx={sectionTitle}>
                  تفاصيل الطلب وشركة التوصيل
                </Typography>
                <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('items', { required: 'مطلوب' })}
                    label="تفاصيل الطلب / المنتجات"
                    fullWidth
                    size="medium"
                    error={!!errors.items}
                    helperText={errors.items?.message}
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    {...register('totalAmount', {
                      required: 'مطلوب',
                      validate: (v) => {
                        const n = parseFloat(v)
                        if (Number.isNaN(n) || n <= 0) return 'مبلغ صحيح'
                        return true
                      },
                    })}
                    label="السعر (ش.ج)"
                    type="number"
                    inputProps={{ min: 0, step: 0.01, dir: 'rtl', style: inputRtlStyle }}
                    fullWidth
                    size="medium"
                    error={!!errors.totalAmount}
                    helperText={errors.totalAmount?.message}
                    sx={inputRtl}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    select
                    {...register('deliveryCompany', { required: true })}
                    label="شركة التوصيل"
                    fullWidth
                    size="medium"
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                    SelectProps={{ MenuProps: { dir: 'rtl' } }}
                  >
                    {DELIVERY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField
                    {...register('notes')}
                    label="ملاحظات (اختياري)"
                    fullWidth
                    size="medium"
                    multiline
                    rows={2}
                    sx={inputRtl}
                    inputProps={{ dir: 'rtl', style: inputRtlStyle }}
                  />
                </Grid>
                <Grid size={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button type="submit" variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>
                    حفظ الطلب
                  </Button>
                </Grid>
              </Grid>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: '4px solid', borderTopColor: 'primary.main' }}>
          <Box sx={{ px: 4, py: 2.5, borderBottom: 2, borderColor: 'primary.main', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.dark' }}>
              سجل الطلبات
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              {orders.length} طلب
            </Typography>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', border: 0 }}>
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
                  <TableCell align="center">إجراء</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>{order.address}</TableCell>
                    <TableCell sx={{ maxWidth: 140 }}>{order.items}</TableCell>
                    <TableCell>{order.totalAmount} ₪</TableCell>
                    <TableCell>
                      {editingId === order.id ? (
                        <Select
                          size="small"
                          value={order.status}
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
                          sx={{ cursor: 'pointer' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{getDeliveryName(order.deliveryCompany)}</TableCell>
                    <TableCell>
                      {sendingId === order.id ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                          {DELIVERY_OPTIONS.map((opt) => (
                            <Button
                              key={opt.value}
                              size="small"
                              variant="outlined"
                              onClick={() => handleSendToDelivery(order.id, opt.value)}
                            >
                              {opt.label}
                            </Button>
                          ))}
                          <Button size="small" onClick={() => setSendingId(null)}>إلغاء</Button>
                        </Box>
                      ) : !order.deliveryCompany || order.status === 'جاهز للتوصيل' ? (
                        <Button size="small" variant="contained" onClick={() => setSendingId(order.id)}>
                          رفع للتوصيل
                        </Button>
                      ) : (
                        <Typography variant="body2">{getDeliveryName(order.deliveryCompany)}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {orders.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                لا توجد طلبات حتى الآن
              </Typography>
              <Typography variant="body2" color="text.secondary">
                انتقل لتبويب «إدخال طلب جديد» لإضافة أول طلب
              </Typography>
            </Box>
          )}
        </Card>
      )}
    </Box>
  )
}
