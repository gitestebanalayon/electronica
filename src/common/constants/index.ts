export const validationMessageUsers = {
  // Mensages de validacion de tipo exito para los endpoints
  CREATED: 'Usuario creado exitosamente',
  OK: {
    CONTENT: 'Usuario encontrado exitosamente',
    UPDATE: 'Usuario actualizado exitosamente',
    DELETE: 'Usuario eliminado exitosamente',
    RESTORE: 'Usuario restaurado exitosamente',
    ACTIVATE: 'Usuario activado exitosamente',
    DEACTIVATE: 'Usuario desactivado exitosamente',
  },

  // Mensages de validacion de tipo error para los endpoints
  CREATE_CONFLICT: {
    EMAIL: 'El email ya existe',
    CI: 'La cédula ya existe',
    NATIONALITY: 'La nacionalidad solo debe ser V o E',
  },
  NOT_CONTENT: {
    USER: 'El usuario no existe',
    PROFILE: 'El perfil no existe',
  },
  NOT_MODIFIED: {
    UPDATE: 'Error al actualizar el usuario', // Para el endpoint de (PATH) para actualizar
    DELETE: 'Error al desactivar el usuario', // Para el endpoint de (PUT) para eliminar
  },
};

export const validationMessageProfiles = {
  // Mensages de validacion de tipo exito para los endpoints
  CREATED: 'Perfil creado exitosamente',
  OK: {
    CONTENT: 'Perfil encontrado exitosamente',
    UPDATE: 'Perfil actualizado exitosamente',
    DELETE: 'Perfil eliminado exitosamente',
    RESTORE: 'Perfil restaurado exitosamente',
    ACTIVATE: 'Perfil activado exitosamente',
    DEACTIVATE: 'Perfil desactivado exitosamente',
  },

  // Mensages de validacion de tipo error para los endpoints
  CREATE_CONFLICT: {
    NAME: 'El nombre del perfil ya existe',
  },
  NOT_CONTENT: {
    PROFILE: 'El perfil no existe',
    PROFILES: 'No se ha encontrado ningun perfil en la base de datos',
  },
  NOT_MODIFIED: {
    UPDATE: 'Error al actualizar el perfil', // Para el endpoint de (PATH) para actualizar
    DELETE: 'Error al desactivar el perfil', // Para el endpoint de (PUT) para eliminar
  },
};

export const validationMessagePermissions = {
  // Mensages de validacion de tipo exito para los endpoints
  CREATED: 'Permiso creado exitosamente',
  OK: {
    CONTENT: 'Permiso encontrado exitosamente',
    UPDATE: 'Permiso actualizado exitosamente',
    DELETE: 'Permiso eliminado exitosamente',
    RESTORE: 'Permiso restaurado exitosamente',
    ACTIVATE: 'Permiso activado exitosamente',
    DEACTIVATE: 'Permiso desactivado exitosamente',
  },

  // Mensages de validacion de tipo error para los endpoints
  CREATE_CONFLICT: {
    NAME: 'El nombre del permiso ya existe',
  },
  NOT_CONTENT: {
    PERMISSION: 'El permiso no existe',
    PERMISSIONS: 'No se ha encontrado ningun permiso en la base de datos',
  },
  NOT_MODIFIED: {
    UPDATE: 'Error al actualizar el permiso', // Para el endpoint de (PATH) para actualizar
    DELETE: 'Error al desactivar el permiso', // Para el endpoint de (PUT) para eliminar
  },
};

export const validationMessageModules = {
  // Mensages de validacion de tipo exito para los endpoints
  CREATED: 'Módulo creado exitosamente',
  OK: {
    CONTENT: 'Módulo encontrado exitosamente',
    UPDATE: 'Módulo actualizado exitosamente',
    DELETE: 'Módulo eliminado exitosamente',
    RESTORE: 'Módulo restaurado exitosamente',
    ACTIVATE: 'Módulo activado exitosamente',
    DEACTIVATE: 'Módulo desactivado exitosamente',
  },

  // Mensages de validacion de tipo error para los endpoints
  CREATE_CONFLICT: {
    NAME: 'El nombre del módulo ya existe',
    PATH: 'El nombre de la ruta ya existe',
  },
  NOT_CONTENT: {
    MODULE: 'El módulo no existe',
    MODULES: 'No se ha encontrado ningun módulo en la base de datos',
  },
  NOT_MODIFIED: {
    UPDATE: 'Error al actualizar el módulo', // Para el endpoint de (PATH) para actualizar
    DELETE: 'Error al desactivar el módulo', // Para el endpoint de (PUT) para eliminar
  },
};
