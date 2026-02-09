import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  Line,
} from 'recharts'
import { getOrders, getDeliveryStats, subscribe } from '../../store/ordersStore'
import { DELIVERY_OPTIONS } from '../../utils/orderHelpers'
import type { OrderStatus, DeliveryCompanyId } from '../../types'

const statusColorMap: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  'جديد': 'success',
  'قيد التحضير': 'warning',
  'جاهز للتوصيل': 'secondary',
  'مع شركة التوصيل': 'primary',
  'تم التوصيل': 'success',
  'ملغي': 'error',
}

const ANALYTICS_BG = '#f5f0e8'
const KPI_BEIGE = '#e8e0d5'
const KPI_PURPLE = '#e0d8f0'
const KPI_GREEN = '#d5e8d5'
const BAR_GRADIENT = ['#ffd6c4', '#c4b5fd', '#86efac']
const DONUT_COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ec4899']
const LINE_AMOUNT = '#8b5cf6'
const LINE_COUNT = '#94a3b8'

function last7DaysData(orders: { createdAt: string; totalAmount: number }[]) {
  const days: { date: string; عدد_الطلبات: number; المبلغ: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr))
    days.push({
      date: dateStr,
      عدد_الطلبات: dayOrders.length,
      المبلغ: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
    })
  }
  return days
}

export default function AdminView() {
  const [mainTab, setMainTab] = useState(0)
  const [deliveryTab, setDeliveryTab] = useState(0)
  const [selectedCompany, setSelectedCompany] = useState<DeliveryCompanyId>(DELIVERY_OPTIONS[0]?.value ?? 'aramex')
  const [orders, setOrders] = useState(getOrders())
  const [deliveryStats, setDeliveryStats] = useState(getDeliveryStats())
  const [chartPeriod, setChartPeriod] = useState<'اليوم' | 'الأسبوع' | 'الكل'>('الأسبوع')

  useEffect(() => {
    return subscribe(() => {
      setOrders(getOrders())
      setDeliveryStats(getDeliveryStats())
    })
  }, [])

  const ordersByCompany = orders.filter((o) => o.deliveryCompany === selectedCompany)
  const companyStats = deliveryStats.find((s) => s.id === selectedCompany)
  const companyName = DELIVERY_OPTIONS.find((c) => c.value === selectedCompany)?.label ?? selectedCompany
  const totalRevenue = orders.reduce((a, o) => a + o.totalAmount, 0)

  const chartDataCompanies = deliveryStats.map((s) => ({
    name: s.name,
    طلبات: s.orders,
  }))

  const sevenDaysData = useMemo(() => last7DaysData(orders), [orders])

  const statusCounts: Record<string, number> = {}
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1
  })
  const statusChartData = Object.entries(statusCounts).map(([name, value], i) => ({
    name,
    value,
    fill: DONUT_COLORS[i % DONUT_COLORS.length],
  }))

  const revenuePieData = deliveryStats
    .filter((s) => s.revenue > 0)
    .map((s, i) => ({
      name: s.name,
      value: s.revenue,
      fill: DONUT_COLORS[i % DONUT_COLORS.length],
    }))
  const totalForPie = revenuePieData.reduce((a, d) => a + d.value, 0)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          واجهة الأدمن
        </Typography>
        <Typography variant="body2" color="text.secondary">
          التحليلات، الطلبات حسب شركة التوصيل، والحسابات المالية
        </Typography>
      </Box>

      <Tabs
        value={mainTab}
        onChange={(_, v) => setMainTab(v)}
        sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: 'primary.main' } }}
      >
        <Tab label="تحليلات" />
        <Tab label="الطلبات" />
        <Tab label="حسابات الكل والإدارة" />
        <Tab label="طلبات شين والوسطاء" />
      </Tabs>

      {mainTab === 0 && (
        <Box
          sx={{
            bgcolor: ANALYTICS_BG,
            borderRadius: 3,
            p: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* البطاقة الأولى: الطلبات لكل شركة + KPIs */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ bgcolor: KPI_BEIGE, borderRadius: 20, px: 1.5, py: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">عدد الشركات</Typography>
                  <Typography fontWeight={700}>{DELIVERY_OPTIONS.length}</Typography>
                </Box>
                <Box sx={{ bgcolor: KPI_PURPLE, borderRadius: 20, px: 1.5, py: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">إجمالي المبيعات</Typography>
                  <Typography fontWeight={700}>₪ {totalRevenue}</Typography>
                </Box>
                <Box sx={{ bgcolor: KPI_GREEN, borderRadius: 20, px: 1.5, py: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">إجمالي الطلبات</Typography>
                  <Typography fontWeight={700}>{orders.length}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  الطلبات لكل شركة
                </Typography>
                <Select
                  size="small"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value as typeof chartPeriod)}
                  sx={{ minWidth: 90, fontSize: '0.8rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' } }}
                >
                  <MenuItem value="اليوم">اليوم</MenuItem>
                  <MenuItem value="الأسبوع">الأسبوع</MenuItem>
                  <MenuItem value="الكل">الكل</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={chartDataCompanies} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'عدد الطلبات', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d5' }} />
                    <Bar dataKey="طلبات" radius={[6, 6, 0, 0]} name="عدد الطلبات">
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor={BAR_GRADIENT[0]} />
                          <stop offset="50%" stopColor={BAR_GRADIENT[1]} />
                          <stop offset="100%" stopColor={BAR_GRADIENT[2]} />
                        </linearGradient>
                      </defs>
                      {chartDataCompanies.map((_, i) => (
                        <Cell key={i} fill="url(#barGrad)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* البطاقة الثانية: إحصائيات آخر 7 أيام */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  إحصائيات طلبات التوصيل (آخر 7 أيام)
                </Typography>
                <Select
                  size="small"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value as typeof chartPeriod)}
                  sx={{ minWidth: 90, fontSize: '0.8rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' } }}
                >
                  <MenuItem value="اليوم">اليوم</MenuItem>
                  <MenuItem value="الأسبوع">الأسبوع</MenuItem>
                  <MenuItem value="الكل">الكل</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <ComposedChart data={sevenDaysData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LINE_AMOUNT} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={LINE_AMOUNT} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="areaCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LINE_COUNT} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={LINE_COUNT} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v ?? '').slice(5)} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'عدد الطلبات', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'المبلغ', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d5' }}
                      labelFormatter={(v) => v}
                      formatter={(value, name) => [name === 'المبلغ' ? `${value ?? 0} ₪` : (value ?? 0), name === 'المبلغ' ? 'المبلغ الإجمالي' : 'عدد الطلبات']}
                    />
                    <Legend />
                    <Area yAxisId="right" type="monotone" dataKey="المبلغ" fill="url(#areaAmount)" stroke={LINE_AMOUNT} strokeWidth={2} name="المبلغ الإجمالي" />
                    <Line yAxisId="left" type="monotone" dataKey="عدد_الطلبات" stroke={LINE_COUNT} strokeWidth={2} dot={{ fill: LINE_COUNT }} name="عدد الطلبات" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* البطاقة الثالثة: الإيراد لكل شركة (دونات) */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  الإيراد لكل شركة
                </Typography>
                <Select
                  size="small"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value as typeof chartPeriod)}
                  sx={{ minWidth: 90, fontSize: '0.8rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' } }}
                >
                  <MenuItem value="اليوم">اليوم</MenuItem>
                  <MenuItem value="الأسبوع">الأسبوع</MenuItem>
                  <MenuItem value="الكل">الكل</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={revenuePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => (totalForPie && value != null ? `${name} (${Math.round((value / totalForPie) * 100)}%)` : name)}
                    >
                      {revenuePieData.map((row, i) => (
                        <Cell key={i} fill={row.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number | undefined) => [`${value ?? 0} ₪`, 'إيراد']} contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d5' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {revenuePieData.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: -6 }}>
                  لا يوجد إيراد بعد
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* البطاقة الرابعة: الطلبات حسب الحالة */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  الطلبات حسب الحالة
                </Typography>
                <Select
                  size="small"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value as typeof chartPeriod)}
                  sx={{ minWidth: 90, fontSize: '0.8rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' } }}
                >
                  <MenuItem value="اليوم">اليوم</MenuItem>
                  <MenuItem value="الأسبوع">الأسبوع</MenuItem>
                  <MenuItem value="الكل">الكل</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={statusChartData} layout="vertical" margin={{ top: 5, right: 20, left: 70, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={65} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8e0d5' }} formatter={(v: number | undefined) => [v ?? 0, 'طلب']} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} name="عدد الطلبات">
                      {statusChartData.map((row, i) => (
                        <Cell key={i} fill={row.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {statusChartData.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: -6 }}>
                  لا توجد طلبات
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {mainTab === 1 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            اختر شركة التوصيل ثم عرض الطلبات أو الحسابات المالية
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {DELIVERY_OPTIONS.map((opt) => (
              <Card
                key={opt.value}
                variant="outlined"
                sx={{
                  minWidth: 100,
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selectedCompany === opt.value ? 'primary.main' : 'divider',
                  bgcolor: selectedCompany === opt.value ? 'action.selected' : 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => { setSelectedCompany(opt.value); setDeliveryTab(0) }}
              >
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Typography fontWeight={600} variant="body2">
                    {opt.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Tabs value={deliveryTab} onChange={(_, v) => setDeliveryTab(v)} sx={{ mb: 2 }}>
            <Tab label="طلبات الشركة" />
            <Tab label="حسابات مالية" />
          </Tabs>

          {deliveryTab === 0 && (
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  طلبات {companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ordersByCompany.length} طلب
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
                      <TableCell>التاريخ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersByCompany.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell sx={{ maxWidth: 160 }}>{order.address}</TableCell>
                        <TableCell sx={{ maxWidth: 140 }}>{order.items}</TableCell>
                        <TableCell>{order.totalAmount} ₪</TableCell>
                        <TableCell>
                          <Chip label={order.status} size="small" color={statusColorMap[order.status]} variant="outlined" />
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString('ar-PS')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {ordersByCompany.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography color="text.secondary">لا توجد طلبات لشركة {companyName}</Typography>
                </Box>
              )}
            </Card>
          )}

          {deliveryTab === 1 && companyStats && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom color="primary.main">
                  حسابات مالية – {companyName}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 3, mt: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">عدد الطلبات</Typography>
                    <Typography variant="h5" fontWeight={700}>{companyStats.orders}</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">تم التوصيل</Typography>
                    <Typography variant="h5" fontWeight={700}>{companyStats.delivered}</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">إجمالي الإيراد (ش.ج)</Typography>
                    <Typography variant="h5" fontWeight={700}>{companyStats.revenue} ₪</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {mainTab === 2 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              حسابات الكل والإدارة العامة
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              ملخص موحد لجميع شركات التوصيل
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
              <Card variant="outlined" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>إجمالي الطلبات</Typography>
                  <Typography variant="h4" fontWeight={700}>{orders.length}</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ bgcolor: 'grey.800', color: 'white' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>إجمالي الإيرادات</Typography>
                  <Typography variant="h4" fontWeight={700}>{totalRevenue} ₪</Typography>
                </CardContent>
              </Card>
            </Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              حسب الشركة
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              {deliveryStats.map((s) => (
                <Card key={s.id} variant="outlined">
                  <CardContent sx={{ py: 2 }}>
                    <Typography fontWeight={600}>{s.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      طلبات: {s.orders} · مُوصّل: {s.delivered} · إيراد: {s.revenue} ₪
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {mainTab === 3 && (
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              طلبات شين ومتابعة الوسطاء
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              متابعة طلبات شين والوسطاء – جاهز لربط البيانات لاحقاً
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
