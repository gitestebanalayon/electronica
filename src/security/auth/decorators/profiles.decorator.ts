import { SetMetadata } from '@nestjs/common';

export const GROUP_KEY = 'groups';
export const PERMISSIONS_KEY = 'permissions';

// Decorador compuesto para establecer grupo, clase y permisos requeridos
export const AuthWithProfilesClass = (
  groupId: string[],
  permissions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  },
): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    SetMetadata(GROUP_KEY, groupId)(target, propertyKey, descriptor);
    SetMetadata(PERMISSIONS_KEY, permissions)(target, propertyKey, descriptor);
  };
};
