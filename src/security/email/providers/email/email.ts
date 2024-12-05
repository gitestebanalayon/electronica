import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class Email {
  transporter = nodemailer.createTransport({
    host: '10.9.9.10', // Servidor SMTP correcto
    port: 25, // Puerto para conexiones STARTTLS
    secure: false, // Se establece como 'false' para usar STARTTLS
    auth: {
      user: 'no-responde@mppe.gob.ve', // Nombre de usuario SMTP
      pass: 'Sistemas.2023', // Contraseña o clave de autenticación
    },
    tls: {
      rejectUnauthorized: false, // Permite conexiones a servidores con certificados no válidos
    },
    logger: true, // Habilita los logs
    debug: true, // Habilita la depuración
  });

  // Definir tipos de los parámetros y el retorno de la función
  async sendEmail(
    from: string,
    subjectEmail: string,
    sendTo: string,
    html: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from, // dirección del remitente
        to: sendTo, // destinatario
        subject: subjectEmail, // asunto del correo
        html, // contenido HTML del correo
      });

      console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }

  // Definir tipos del retorno de la función
  // async testEmail(): Promise<void> {
  //   try {
  //     const info = await this.transporter.sendMail({
  //       from: `"No Reply" <${process.env.EMAIL_USER}>`, // dirección del remitente
  //       to: 'estebanalayon7@gmail.com', // destinatario
  //       subject: 'Prueba de correo', // asunto
  //       html: '<b>Este es un correo de prueba enviado desde NestJS utilizando Gmail SMTP</b>',
  //     });

  //     console.log('Correo de prueba enviado: %s', info.messageId);
  //   } catch (error) {
  //     console.error('Error al enviar correo de prueba:', error);
  //     throw error;
  //   }
  // }
}
