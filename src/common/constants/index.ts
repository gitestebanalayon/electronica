// Mensages de validacion para los DTO ¡GLOBAL!
export const validationMessageTypes = {
  // Errores de tipado
  IS_EMAIL: 'debe ser un correo electrónico válido.',
  IS_STRING: 'debe ser de tipo string.',
  IS_ARRAY: 'debe ser de tipo array.',
  IS_NUMBER: 'debe ser de tipo integer.',
  IS_BOOLEAN: 'debe ser de tipo boolean.',
  IS_DATE: 'debe ser una fecha válida.',
  IS_NOT_EMPTY: 'No puede estar vacion',

  // Errores de logitud
  LENGTH_PASSWORD: 'la logitud debe ser de 8 a 20 dígitos',
  LENGTH_NATIONALITY: 'la logitud debe ser de 1 dígitos y debe ser E o V',
  LENGTH_CI: 'la logitud debe ser de 8 dígitos',
  LENGTH_PHONE: 'la logitud debe ser de 11 dígitos',
};

// Mensages de errores del servidor
export const validationMessageServer = {
  INTERNAL_SERVER_ERROR: 'Error interno del servidor',
};

export const validationMessageUser = {
  OK: {
    CREATED: 'Usuario creado exitosamente',
    CONTENT: 'Usuario encontrado exitosamente',
    UPDATE: 'Usuario actualizado exitosamente',
    DELETE: 'Usuario eliminado exitosamente',
    ACTIVATED: 'Usuario activado exitosamente',
    DEACTIVATE: 'Usuario desactivado exitosamente',
    ROOT_ACTIVATED: 'Usuario activado como root existosamente',
    ROOT_DEACTIVATE: 'Usuario desactivado como root existosamente',
    PASSWORD: 'Contraseña actualizada existosamente',
    RESTORE_PASSWORD:
      'Contraseña restaurada existosamente, su nueva contraseña se ha enviado a su correo',
    UNLOCK: 'Cuenta desbloqueada existosamente',
    CODE: 'Código enviado al correo existosamente',
    BLOCKED:
      'Cuenta bloqueada, por favor seleccione la opción (Desbloquear Cuenta)',
  },

  NOT_OK: {
    CREATED: 'Error al crear el usuario',
    UPDATE: 'Error al actualizar el usuario',
    DELETE: 'Error al eliminar el usuario',
    DENIED: 'Este usuario ya ha sido eliminado y no se puede restaurar.',
    CODE: 'Código invalido',
  },

  CONFLICT: {
    USER: 'El usuario ya existe',
    EMAIL: 'El correo ya existe',
    CI: 'La cédula ya existe',
    PASSWORD: 'Contraseña actual incorrecta',
    SAME_PASSWORD: 'La contraseña no puede ser igual a la anterior',
  },

  NOT_CONTENT: {
    USER: 'La cuenta no existe',
    USERS: 'No hay usuarios',
    ACTIVE:
      'Este usuario no esta activado, por favor comuníquese con el administrador',
  },
};

export const validationMessageGroup = {
  OK: {
    CREATED: 'Grupo creado exitosamente',
    CONTENT: 'Grupo encontrado exitosamente',
    UPDATE: 'Grupo actualizado exitosamente',
    DELETE: 'Grupo eliminado exitosamente',
  },

  NOT_OK: {
    CREATED: 'Error al crear el grupo',
    UPDATE: 'Error al actualizar el grupo',
    DELETE: 'Error al eliminar el grupo',
    DENIED: 'Este grupo ya ha sido eliminado y no se puede restaurar.',
  },

  CONFLICT: {
    GROUP: 'El grupo ya existe',
  },

  NOT_CONTENT: {
    GROUP: 'El grupo no existe',
    GROUPS: 'No hay grupos',
  },
};
