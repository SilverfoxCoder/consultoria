export const TIME_ENTRY_STATUS = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  EN_REVISION: 'En Revisión'
};

export const TIME_ENTRY_STATUS_DISPLAY = {
  [TIME_ENTRY_STATUS.PENDIENTE]: 'Pendiente',
  [TIME_ENTRY_STATUS.APROBADO]: 'Aprobado',
  [TIME_ENTRY_STATUS.RECHAZADO]: 'Rechazado',
  [TIME_ENTRY_STATUS.EN_REVISION]: 'En Revisión'
};

export const TIME_ENTRY_STATUS_OPTIONS = Object.entries(TIME_ENTRY_STATUS_DISPLAY).map(([value, label]) => ({
  value,
  label
})); 