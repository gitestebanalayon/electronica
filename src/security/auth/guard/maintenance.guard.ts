import {
    Injectable,
    CanActivate,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Injectable()
export class Maintenance implements CanActivate {
    constructor() { }

    async canActivate(): Promise<boolean> {
        // Lanzar una excepción con el código 503 y un mensaje de mantenimiento
        let isMaintenance = false;

        if (isMaintenance) {
            throw new HttpException(
                'Nuestro sitio está en mantenimiento temporal. Intente nuevamente más tarde.',
                HttpStatus.SERVICE_UNAVAILABLE, // Código 503
            );
        } else {
            return true;
        }
    }
}