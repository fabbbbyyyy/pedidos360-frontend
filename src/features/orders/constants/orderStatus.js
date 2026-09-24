// Estados y reglas de transición. Espejo del enum del backend (order.model.js).
// Si el backend agrega un estado (p. ej. PREPARING), se cambia SOLO este archivo.
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUSES = Object.values(ORDER_STATUS);

// Flujo feliz (el stepper). CANCELLED queda fuera: es una salida, no un paso.
export const STATUS_SEQUENCE = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_LABEL = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'En preparación',
  READY: 'Listo para entregar',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

// Color del punto y del texto de cada estado.
export const STATUS_TONE = {
  PENDING: { dot: 'var(--accent-ink)', text: 'var(--accent-ink)' },
  CONFIRMED: { dot: 'var(--steel)', text: '#8db8d3' },
  PREPARING: { dot: 'var(--peri)', text: '#514e9a' },
  READY: { dot: 'var(--steel)', text: '#176b7a' },
  DELIVERED: { dot: 'var(--green)', text: '#80b491' },
  CANCELLED: { dot: 'var(--brick)', text: '#ce8781' },
};

// Transiciones permitidas. Regla de negocio: no se puede enviar sin confirmar.
export const TRANSITIONS = {
  PENDING: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  CONFIRMED: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  PREPARING: [ORDER_STATUS.READY],
  READY: [ORDER_STATUS.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

// Texto del botón principal según el estado al que se avanza.
export const ADVANCE_LABEL = {
  CONFIRMED: 'Confirmar pedido',
  PREPARING: 'Iniciar preparación',
  READY: 'Marcar como listo',
  DELIVERED: 'Marcar como entregado',
};
