// Estados y reglas de transición. Espejo del enum del backend (order.model.js).
// Si el backend agrega un estado (p. ej. PREPARING), se cambia SOLO este archivo.
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUSES = Object.values(ORDER_STATUS);

// Flujo feliz (el stepper). CANCELLED queda fuera: es una salida, no un paso.
export const STATUS_SEQUENCE = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_LABEL = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

// Color del punto y del texto de cada estado.
export const STATUS_TONE = {
  PENDING: { dot: 'var(--brass)', text: 'var(--brass)' },
  CONFIRMED: { dot: 'var(--steel)', text: '#8db8d3' },
  SHIPPED: { dot: 'var(--peri)', text: '#a5b0dd' },
  DELIVERED: { dot: 'var(--green)', text: '#80b491' },
  CANCELLED: { dot: 'var(--brick)', text: '#ce8781' },
};

// Transiciones permitidas. Regla de negocio: no se puede enviar sin confirmar.
export const TRANSITIONS = {
  PENDING: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  CONFIRMED: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  SHIPPED: [ORDER_STATUS.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

// Texto del botón principal según el estado al que se avanza.
export const ADVANCE_LABEL = {
  CONFIRMED: 'Confirmar pedido',
  SHIPPED: 'Marcar como enviado',
  DELIVERED: 'Marcar como entregado',
};
