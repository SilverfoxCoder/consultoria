export const projectValidations = {
  name: {
    required: true,
    maxLength: 255,
    validate: (value) => {
      if (!value?.trim()) return 'El nombre del proyecto es obligatorio';
      if (value.length > 255) return 'El nombre no puede exceder 255 caracteres';
      return null;
    }
  },
  
  clientId: {
    required: true,
    validate: (value) => {
      if (!value) return 'Debe seleccionar un cliente';
      return null;
    }
  },
  
  startDate: {
    required: true,
    validate: (value) => {
      if (!value) return 'La fecha de inicio es obligatoria';
      return null;
    }
  },
  
  endDate: {
    required: true,
    validate: (value, formData) => {
      if (!value) return 'La fecha de fin es obligatoria';
      if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
        return 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
      return null;
    }
  },
  
  progress: {
    validate: (value) => {
      const progress = parseInt(value);
      if (progress < 0 || progress > 100) {
        return 'El progreso debe estar entre 0 y 100';
      }
      return null;
    }
  },
  
  budget: {
    validate: (value) => {
      const budget = parseFloat(value);
      if (budget < 0) return 'El presupuesto debe ser mayor o igual a 0';
      return null;
    }
  },
  
  spent: {
    validate: (value) => {
      const spent = parseFloat(value);
      if (spent < 0) return 'El gasto debe ser mayor o igual a 0';
      return null;
    }
  }
};

export const validateProject = (data) => {
  const errors = {};
  
  Object.keys(projectValidations).forEach(field => {
    const validation = projectValidations[field];
    const error = validation.validate(data[field], data);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
}; 