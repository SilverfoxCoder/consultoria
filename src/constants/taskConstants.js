export const TASK_STATUS = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  PAUSADA: 'Pausada'
};

export const TASK_STATUS_DISPLAY = {
  [TASK_STATUS.PENDIENTE]: 'Pendiente',
  [TASK_STATUS.EN_PROGRESO]: 'En Progreso',
  [TASK_STATUS.COMPLETADA]: 'Completada',
  [TASK_STATUS.CANCELADA]: 'Cancelada',
  [TASK_STATUS.PAUSADA]: 'Pausada'
};

export const TASK_PRIORITY = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica'
};

export const TASK_PRIORITY_DISPLAY = {
  [TASK_PRIORITY.BAJA]: 'Baja',
  [TASK_PRIORITY.MEDIA]: 'Media',
  [TASK_PRIORITY.ALTA]: 'Alta',
  [TASK_PRIORITY.CRITICA]: 'Crítica'
};

export const TASK_STATUS_OPTIONS = Object.entries(TASK_STATUS_DISPLAY).map(([value, label]) => ({
  value,
  label
}));

export const TASK_PRIORITY_OPTIONS = Object.entries(TASK_PRIORITY_DISPLAY).map(([value, label]) => ({
  value,
  label
})); 