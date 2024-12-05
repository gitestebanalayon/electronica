import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import Users from '../users/entities/users.entity';
import { UsersServices } from '../users/users.service';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<{
    token: string;
    email: string;
    groupId: { id: number; description: string }[];
    permissions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }> {
    try {
      // Busca al usuario incluyendo el campo de contraseña
      const user = await this.usersService.findOneByEmailWithPassword(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verifica la contraseña
      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verifica si el grupo y los permisos están disponibles
      if (!user.group_description || !user.group_description.groupPermission) {
        throw new UnauthorizedException(
          'No permissions associated with user group',
        );
      }

      const groupPermission = user.group_description.groupPermission.find(
        (perm) => perm.group_id === perm.group_id,
      );

      if (!groupPermission) {
        throw new UnauthorizedException(
          'No permissions found for the user class',
        );
      }

      // Configura los permisos
      const permissions = {
        create: groupPermission.create || false,
        read: groupPermission.read || false,
        update: groupPermission.update || false,
        delete: groupPermission.delete || false,
      };

      // Configura los detalles del grupo
      const groupId = [
        {
          id: user.group_description.id,
          description: user.group_description.description,
        },
      ];

      // Construye el payload para el token
      const payload = {
        id: user.id,
        email: user.email,
        groupId: groupId.map((group) => group.description),
        permissions,
        is_root: user.is_root,
        is_staff: user.is_staff,
      };

      // Firma el token
      const token = await this.jwtService.signAsync(payload);

      // Retorna la respuesta
      return {
        token,
        email,
        groupId,
        permissions,
      };
    } catch (error) {
      console.log(error);

      // Maneja los errores y los lanza con un formato adecuado
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Si es otro error, lanza un InternalServerErrorException o similar
      throw new InternalServerErrorException(
        'An error occurred during login. Please try again later.',
      );
    }
  }

  // async login({ email, password }: LoginDto): Promise<{
  //   token: string;
  //   email: string;

  //   groupId: { id: number; description: string }[]; // Cambiado para ser un objeto
  //   //groupId_name: string; // Nueva propiedad para la descripción del grupo

  //   classId: { id: number; description: string }[]; // Cambiado para ser un array de objetos
  //   //classId_name: string; // Nueva propiedad para la descripción de la clase

  //   permissions: {
  //     create: boolean;
  //     read: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   };
  // }> {
  //   // En vez de FinOneByEmail, ahora usar este, debido a que en entity usuarios se cambio
  //   // La contraseña a select: false para que no se muestre en get
  //   const user = await this.usersService.findOneByEmailWithPassword(email);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials'); // O maneja el error según tu lógica
  //   }

  //   // Aquí debes verificar la contraseña del usuario
  //   const isPasswordValid = await bcryptjs.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials'); // O maneja el error según tu lógica
  //   }

  //   // Asegúrate de que el grupo y los permisos estén disponibles
  //   if (!user.group_description || !user.group_description.groupPermission) {
  //     throw new UnauthorizedException(
  //       'No permissions associated with user group',
  //     );
  //   }

  //   const groupPermission = user.group_description.groupPermission.find(
  //     (perm) => perm.class_id === perm.class_id, // Asegúrate de tener classId en el objeto user
  //   );

  //   if (!groupPermission) {
  //     throw new UnauthorizedException(
  //       'No permissions found for the user class',
  //     );
  //   }

  //   // Agregar permisos al objeto del usuario
  //   const permissions = {
  //     create: groupPermission.create || false,
  //     read: groupPermission.read || false,
  //     update: groupPermission.update || false,
  //     delete: groupPermission.delete || false,
  //   };

  //   // Crear objeto de groupId
  //   const groupId = [
  //     {
  //       id: user.group_description.id, // ID del grupo
  //       description: user.group_description.description, // Descripción del grupo
  //     },
  //   ];

  //   // Cambiar classId a un array de objetos
  //   const classId = user.group_description.groupPermission.map((perm) => ({
  //     id: perm.class_m.id || 0, // Obtener el ID correcto de class
  //     description: perm.class_m.description || '', // Obtener la descripción de la clase
  //   }));

  //   //const classId = [groupPermission.class_m.id || 0]; // Envolver en un array // Asegúrate de obtener el ID correcto de class

  //   // // Obtén las descripciones de grupo y clase
  //   // const groupId_name = user.group_description.description; // Asegúrate de que esta propiedad exista
  //   // const classId_name = groupPermission.class_m.description; // Asegúrate de que esta propiedad exista

  //   // Construye el payload para el JWT
  //   const payload = {
  //     id: user.id,
  //     email: user.email,
  //     groupId: groupId.map((group) => group.description), // Este ID se utiliza en el token
  //     classId: classId.map((cls) => cls.id), // Solo los IDs de las clases
  //     permissions: permissions, // Incluir permisos en el payload
  //     is_root: user.is_root,
  //     is_staff: user.is_staff,
  //   };

  //   const token = await this.jwtService.signAsync(payload);

  //   return {
  //     token,
  //     email,

  //     groupId, // Retornar el objeto con id y description
  //     //groupId_name, // Incluye la descripción del grupo

  //     permissions: permissions, // Retornar permisos junto con la respuesta

  //     classId,
  //     //classId_name, // Incluye la descripción de la clase
  //   };
  // }

  private async findUserByCredentials(data: LoginDto): Promise<Users | null> {
    // Busca el usuario en la base de datos por correo electrónico
    const user = await this.usersService.findOneByEmail(data.email);
    return user;
  }

  // Método para decodificar el token
  decodeToken(token: string): Promise<{
    token: string;
    email: string;
    groupId: { id: number; description: string }[]; // Ajustar aquí también
    permissions: number; // Retornar permisos junto con la respuesta
  }> {
    try {
      return this.jwtService.verify(token); // Esto retornará los datos decodificados
    } catch {
      throw new UnauthorizedException('Token no válido');
    }
  }
}
