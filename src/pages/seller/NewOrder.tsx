import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { addOrder } from '../../store/ordersStore'
import PageHeader from '../../components/PageHeader'

interface OrderFormValues {
  customerName: string
  phone: string
  address: string
  items: string
  totalAmount: string
  notes: string
}

export default function NewOrder() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      customerName: '',
      phone: '',
      address: '',
      items: '',
      totalAmount: '',
      notes: '',
    },
  })

  const onSubmit = (data: OrderFormValues) => {
    const amount = parseFloat(data.totalAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    addOrder({
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      items: data.items.trim(),
      totalAmount: amount,
      notes: data.notes?.trim() || undefined,
    })
    navigate('/seller/orders')
  }

  return (
    <Box>
      <PageHeader title="طلب جديد" subtitle="إدخال طلب عميل جديد" />
      <Card sx={{ maxWidth: 640 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register('customerName', { required: 'مطلوب' })}
                  label="اسم العميل"
                  placeholder="أحمد محمد"
                  fullWidth
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register('phone', { required: 'مطلوب' })}
                  label="رقم الهاتف"
                  placeholder="0599123456"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  {...register('address', { required: 'مطلوب' })}
                  label="العنوان"
                  placeholder="جنين - حي الرازي"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  {...register('items', { required: 'مطلوب' })}
                  label="المنتجات / التفاصيل"
                  placeholder="2 فستان، 1 جاكيت"
                  fullWidth
                  error={!!errors.items}
                  helperText={errors.items?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register('totalAmount', {
                    required: 'مطلوب',
                    validate: (v) => {
                      const n = parseFloat(v)
                      if (Number.isNaN(n) || n <= 0) return 'أدخل مبلغاً صحيحاً'
                      return true
                    },
                  })}
                  label="المبلغ الإجمالي (شيكل)"
                  placeholder="450"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                  error={!!errors.totalAmount}
                  helperText={errors.totalAmount?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  {...register('notes')}
                  label="ملاحظات (اختياري)"
                  placeholder="ملاحظات إضافية..."
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={12} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button type="submit" variant="contained">
                  حفظ الطلب
                </Button>
                <Button variant="outlined" onClick={() => navigate('/seller')}>
                  إلغاء
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
