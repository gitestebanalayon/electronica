import { Controller, UseGuards } from '@nestjs/common';
import { EmailService } from './services/email/email.service';
import { Maintenance } from '../auth/guard/maintenance.guard';

@UseGuards(Maintenance)
@Controller('api/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  // Especificar el tipo de retorno como Promise<void>
  // @Get('health')
  // async healthCheck(@Res() res: Response): Promise<void> {
  //   try {
  //     const response = await this.emailService.healthCheck();
  //     res.status(HttpStatus.OK).send(response);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // Especificar el tipo de retorno como Promise<void>
  // @Post('send-email')
  // async sendEmail(
  //   @Body() body: SendEmailDto,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   try {
  //     const response = await this.emailService.sendEmail(body);
  //     res.status(HttpStatus.OK).send(response);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
