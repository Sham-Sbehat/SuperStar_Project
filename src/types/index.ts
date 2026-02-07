export type OrderStatus =
  | 'جديد'
  | 'قيد التحضير'
  | 'جاهز للتوصيل'
  | 'مع شركة التوصيل'
  | 'تم التوصيل'
  | 'ملغي'

export type DeliveryCompanyId = 'aramex' | 'faster' | 'partner' | 'other'

export interface DeliveryCompany {
  id: DeliveryCompanyId
  name: string
  ordersCount: number
  totalRevenue: number
  deliveredCount: number
}

export interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  items: string
  totalAmount: number
  status: OrderStatus
  deliveryCompany: DeliveryCompanyId | null
  createdAt: string
  notes?: string
}

export type UserRole = 'seller' | 'admin'
