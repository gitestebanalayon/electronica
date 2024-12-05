import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/auth.guard';

export interface AuthenticatedUser {
  email: string;
  //groupId: Group;
  token: string;
}

@ApiTags('Auth')
@Controller('auth')
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

  // Validar token
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  validateToken(@Req() req: Request & { user: AuthenticatedUser }): {
    statusCode: number;
    message: string;
    user: AuthenticatedUser;
  } {
    // Si el guardia JwtAuthGuard ha validado el token, se ejecuta este código
    if (!req.user) {
      throw new UnauthorizedException('Token no válido');
    }

    return {
      statusCode: 200,
      message: 'Token validado correctamente',
      user: req.user, // Retorna los datos del usuario decodificados
    };
  }
}
