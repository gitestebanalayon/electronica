import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import Users from '../users/entities/users.entity';
import { UsersServices } from '../users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import { AllExceptionsFilter } from 'src/core/errors/all-exceptions.filter';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async login({
    email,
    password,
  }: LoginDto): Promise<{ token: string; email: string }> {
    // En vez de FinOneByEmail, ahora usar este, debido a que en entity usuarios se cambio
    // La contraseña a select: false para que no se muestre en get
    const user = await this.usersService.findOneByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // O maneja el error según tu lógica
    }

    // Aquí debes verificar la contraseña del usuario
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials'); // O maneja el error según tu lógica
    }

    // Construye el payload para el JWT
    const payload = {
      email: user.email,
      //profiles: user.profiles, // Asegúrar de que 'roles' esté presente en `Usuarios`
    };

    const token = await this.jwtService.signAsync(payload);
    console.log(token);

    return {
      token,
      email,
    };
  }

  private async findUserByCredentials(data: LoginDto): Promise<Users | null> {
    // Busca el usuario en la base de datos por correo electrónico
    const user = await this.usersService.findOneByEmail(data.email);
    return user;
  }

  // RUTAS DE PRUEBA en este caso un service de prueba

  // Perfil del usuario autenticado
  // Perfil del usuario autenticado
  //async profile({ email, profiles }: { email: string, profiles: Profiles[] }) {
  // Verificar si el usuario tiene el perfil 'Admin'  NO USAR TËCNICA CON MUCHAS RUTAS
  //const hasAdminProfile = profiles.some(profile => profile.name === 'Admin');

  //if (!hasAdminProfile) {
  //  throw new UnauthorizedException('No tienes acceso a este recurso');
  //}

  // Si el usuario tiene el perfil 'Admin', buscar y devolver la información del usuario
  //return await this.usersService.findOneByEmail(email);
  //}
}
