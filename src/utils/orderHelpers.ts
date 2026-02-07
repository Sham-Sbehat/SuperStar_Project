import type { OrderStatus, DeliveryCompanyId } from '../types'

const statusBadgeClass: Record<OrderStatus, string> = {
  'جديد': 'badge-new',
  'قيد التحضير': 'badge-prep',
  'جاهز للتوصيل': 'badge-ready',
  'مع شركة التوصيل': 'badge-shipping',
  'تم التوصيل': 'badge-delivered',
  'ملغي': 'badge-cancelled',
}

export function getStatusBadgeClass(status: OrderStatus): string {
  return statusBadgeClass[status] ?? 'badge-new'
}

const deliveryNames: Record<DeliveryCompanyId, string> = {
  aramex: 'أرامكس',
  faster: 'أسرع',
  partner: 'شريك',
  other: 'أخرى',
}

export function getDeliveryName(id: DeliveryCompanyId | null): string {
  return id ? deliveryNames[id] : '—'
}

export const DELIVERY_OPTIONS: { value: DeliveryCompanyId; label: string }[] = [
  { value: 'aramex', label: 'أرامكس' },
  { value: 'faster', label: 'أسرع' },
  { value: 'partner', label: 'شريك' },
  { value: 'other', label: 'أخرى' },
]

export const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'جديد', label: 'جديد' },
  { value: 'قيد التحضير', label: 'قيد التحضير' },
  { value: 'جاهز للتوصيل', label: 'جاهز للتوصيل' },
  { value: 'مع شركة التوصيل', label: 'مع شركة التوصيل' },
  { value: 'تم التوصيل', label: 'تم التوصيل' },
  { value: 'ملغي', label: 'ملغي' },
]
