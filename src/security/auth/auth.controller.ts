import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/auth.guard';
import Users from '../users/entities/users.entity';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import { Request } from 'express';
import { UnlockAccountDto } from './dto/unlock-account.dto';
import { RecoveryCodeDto } from './dto/reset-code.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { FilterUserDto, FilterUserVerifyDto } from './dto/filter-user.dto';
import { RestoreGmailDto } from './dto/restore-gmail.dto';
import { Maintenance } from './guard/maintenance.guard';

export interface AuthenticatedUser {
  token: string;
}

@ApiTags('Auth')
@Controller('auth')
@UseGuards(Maintenance)
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() data: LoginDto,
  ): Promise<{ statusCode: number; message: string; data: AuthenticatedUser }> {
    const result = await this.authServices.login(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }

  // Validar token
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('account/validate-token')
  validateToken(@Req() req: Request & { user: AuthenticatedUser }): {
    statusCode: number;
    message: string;
  } {
    // Si el guardia JwtAuthGuard ha validado el token, se ejecuta este código
    if (!req.user) {
      throw new UnauthorizedException('Token no válido');
    }

    return {
      statusCode: 200,
      message: 'Token validado correctamente',
    };
  }
  @Get('filter')
  async findOne(
    @Query() data: FilterUserDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.findOne(data);
  }

  @Get('account/filter')
  async findOneUser(
    @Query() data: FilterUserVerifyDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.findOneUser(data);
  }

  @HttpCode(HttpStatus.OK)
  @Put('account/unlock')
  async unlockAccount(
    @Body() data: UnlockAccountDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.unlockAccount(data);
    return await this.authServices.unlockAccount(data);
  }

  @HttpCode(HttpStatus.OK)
  @Put('account/code')
  async resetCode(
    @Body() data: RecoveryCodeDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.resetCode(data);
    return await this.authServices.resetCode(data);
  }

  @HttpCode(HttpStatus.OK)
  @Put('account/restore-password')
  async restorePassword(
    @Body() data: RestorePasswordDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.restorePassword(data);
  }

  @HttpCode(HttpStatus.OK)
  @Put('account/restore-gmail')
  async restoreGmail(
    @Body() data: RestoreGmailDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.authServices.restoreGmail(data);
  }
}
