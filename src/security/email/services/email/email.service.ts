import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../../dtos/send-email.dto';
import { Email } from '../../providers/email/email';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(private emailProvider: Email) {}

  async sendEmail(body: SendEmailDto): Promise<boolean> {
    const { from, subjectEmail, sendTo } = body;
    const html = await this.getTemplate(body); // Espera la respuesta de getTemplate
    await this.emailProvider.sendEmail(from, subjectEmail, sendTo, html);
    return true;
  }

  // async healthCheck(): Promise<{ statusService: string }> {
  //   try {
  //     await this.emailProvider.testEmail();
  //     return {
  //       statusService: 'UP',
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  private async getTemplate(body: SendEmailDto): Promise<string> {
    const template = await this.getTemplateFile(body.template);
    const html = template.fillTemplate(body); // Llamar a la función fillTemplate
    return html;
  }

  private async getTemplateFile(
    template: string,
  ): Promise<{ fillTemplate: (body: SendEmailDto) => string }> {
    const pathToTemplate = join(
      __dirname,
      '..',
      '..',
      'templates',
      `${template}.js`,
    );

    const templateFile = await import(pathToTemplate); // Importación dinámica
    return templateFile;
  }
}
