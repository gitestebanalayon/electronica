// ESTE DECORADOR SERVIRÁ PARA QUE PUEDAS USAR LA PROTECCIÓN Y ROLES DECORADORES DE FORMA GLOBAL EN OTRAS RUTAS
// DECORADOR QUE PODRÁ SER UTILIZADO EN TODOS LADOS
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
