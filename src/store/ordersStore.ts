import type { Order, OrderStatus, DeliveryCompanyId } from '../types'

const STORAGE_KEY = 'superstar-orders'

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialOrders()
    return JSON.parse(raw) as Order[]
  } catch {
    return getInitialOrders()
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function getInitialOrders(): Order[] {
  return [
    {
      id: 'ORD-1001',
      customerName: 'أحمد محمد',
      phone: '0599123456',
      address: 'جنين - حي الرازي',
      items: '2 فستان، 1 جاكيت',
      totalAmount: 450,
      status: 'تم التوصيل',
      deliveryCompany: 'aramex',
      createdAt: '2026-02-01T10:00:00',
    },
    {
      id: 'ORD-1002',
      customerName: 'سارة علي',
      phone: '0598765432',
      address: 'جنين - وسط البلد',
      items: '1 عباية، 2 حجاب',
      totalAmount: 320,
      status: 'مع شركة التوصيل',
      deliveryCompany: 'faster',
      createdAt: '2026-02-02T14:30:00',
    },
    {
      id: 'ORD-1003',
      customerName: 'فاطمة حسن',
      phone: '0598111222',
      address: 'يعبد',
      items: '3 بلوزات',
      totalAmount: 180,
      status: 'جاهز للتوصيل',
      deliveryCompany: null,
      createdAt: '2026-02-03T09:15:00',
    },
    {
      id: 'ORD-1004',
      customerName: 'مريم خالد',
      phone: '0598333444',
      address: 'جنين - شارع الناصرة',
      items: '1 معطف',
      totalAmount: 520,
      status: 'قيد التحضير',
      deliveryCompany: null,
      createdAt: '2026-02-03T11:00:00',
    },
  ]
}

let orders = loadOrders()
const listeners: Array<() => void> = []

function emit() {
  saveOrders(orders)
  listeners.forEach((fn) => fn())
}

export function getOrders(): Order[] {
  return [...orders]
}

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status' | 'deliveryCompany'> & { deliveryCompany?: DeliveryCompanyId | null }): Order {
  const id = `ORD-${1000 + orders.length + 1}`
  const withDelivery = order.deliveryCompany != null
  const newOrder: Order = {
    ...order,
    id,
    status: withDelivery ? 'مع شركة التوصيل' : 'جديد',
    deliveryCompany: order.deliveryCompany ?? null,
    createdAt: new Date().toISOString(),
  }
  orders = [newOrder, ...orders]
  emit()
  return newOrder
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const idx = orders.findIndex((o) => o.id === id)
  const prev = orders[idx]
  if (idx === -1 || prev == null) return
  orders[idx] = { ...prev, status } as Order
  emit()
}

export function assignDelivery(id: string, company: DeliveryCompanyId): void {
  const idx = orders.findIndex((o) => o.id === id)
  const prev = orders[idx]
  if (idx === -1 || prev == null) return
  orders[idx] = {
    ...prev,
    deliveryCompany: company,
    status: 'مع شركة التوصيل',
  } as Order
  emit()
}

export function subscribe(fn: () => void): () => void {
  listeners.push(fn)
  return () => {
    const i = listeners.indexOf(fn)
    if (i !== -1) listeners.splice(i, 1)
  }
}

export function getDeliveryStats(): { id: DeliveryCompanyId; name: string; orders: number; revenue: number; delivered: number }[] {
  const companies: Record<DeliveryCompanyId, string> = {
    aramex: 'أرامكس',
    faster: 'أسرع',
    partner: 'شريك',
    other: 'أخرى',
  }
  const stats: Record<DeliveryCompanyId, { orders: number; revenue: number; delivered: number }> = {
    aramex: { orders: 0, revenue: 0, delivered: 0 },
    faster: { orders: 0, revenue: 0, delivered: 0 },
    partner: { orders: 0, revenue: 0, delivered: 0 },
    other: { orders: 0, revenue: 0, delivered: 0 },
  }
  for (const o of orders) {
    if (o.deliveryCompany) {
      stats[o.deliveryCompany].orders += 1
      stats[o.deliveryCompany].revenue += o.totalAmount
      if (o.status === 'تم التوصيل') stats[o.deliveryCompany].delivered += 1
    }
  }
  return (Object.keys(companies) as DeliveryCompanyId[]).map((id) => ({
    id,
    name: companies[id],
    orders: stats[id].orders,
    revenue: stats[id].revenue,
    delivered: stats[id].delivered,
  }))
}
