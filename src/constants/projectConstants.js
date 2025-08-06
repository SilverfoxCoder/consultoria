export const PROJECT_STATUS = {
  PLANIFICACION: 'PLANIFICACION',
  EN_PROGRESO: 'EN_PROGRESO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO',
  PAUSADO: 'PAUSADO'
};

export const PROJECT_STATUS_DISPLAY = {
  [PROJECT_STATUS.PLANIFICACION]: 'Planificación',
  [PROJECT_STATUS.EN_PROGRESO]: 'En Progreso',
  [PROJECT_STATUS.COMPLETADO]: 'Completado',
  [PROJECT_STATUS.CANCELADO]: 'Cancelado',
  [PROJECT_STATUS.PAUSADO]: 'Pausado'
};

export const PROJECT_PRIORITY = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA'
};

export const PROJECT_PRIORITY_DISPLAY = {
  [PROJECT_PRIORITY.BAJA]: 'Baja',
  [PROJECT_PRIORITY.MEDIA]: 'Media',
  [PROJECT_PRIORITY.ALTA]: 'Alta',
  [PROJECT_PRIORITY.CRITICA]: 'Crítica'
};

export const PROJECT_STATUS_OPTIONS = Object.entries(PROJECT_STATUS_DISPLAY).map(([value, label]) => ({
  value,
  label
}));

export const PROJECT_PRIORITY_OPTIONS = Object.entries(PROJECT_PRIORITY_DISPLAY).map(([value, label]) => ({
  value,
  label
})); 