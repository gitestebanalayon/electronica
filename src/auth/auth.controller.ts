import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { ApiTags } from '@nestjs/swagger';

export interface AuthenticatedUser {
  email: string;
  //profiles: Profiles[];
  token: string;
}

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() data: LoginDto,
  ): Promise<{ statusCode: number; message: string; data: AuthenticatedUser }> {
    const result = await this.authService.login(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }
}

// RECOMENDADO OJO--------------------------------------------
// RUTAS DE PRUEBA AQUÍ USA LA OPCIÓN RECOMENDADA Y OPTIMIZADA

//Método 2 combinar decoradores , osea Auth tendrá el UseGuards también
// @Get('profile')
// @AuthWithProfiles(Profilee.ADMIN)
// profile2(@ActiveUser() user: ActiveUserInterface) {
//   console.log(user)
//   return this.authService.profile(user);
// }

// // Método 1
// //@Profile('Admin', 'User') //Nuevo decorador personalizado para los roles //Si quieres doble rol para ruta
// @Get('profile1')
// @Profile('Admin') //Decorador personalizado para los roles //Si quieres un rol para la ruta // Importante usar enums
// @UseGuards(JwtAuthGuard, ProfilesGuard)   // Importante también usar el ProfilesGuard
// profile(
//   @Req() req: Request & { user: AuthenticatedUser }
// ) {
//   return this.authService.profile(req.user);
// }
