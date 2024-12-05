import { SendEmailDto } from '../dtos/send-email.dto';

export const fillTemplate = (body: SendEmailDto): string => {
  const { params } = body;

  return `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #191919;
            color: #ffffff;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        h1 {
            color: #ffffff;
        }

        h4 {
            color: #a0a7ac;
        }

        .h4 {
            text-align: center;
            color: #f1c232;
        }

        .container {
            text-align: center;
            max-width: 100%;
            margin: 0 auto;
            background: #191919;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.568);
        }

        img {
            width: 100px;
        }

        footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>SISTEMA GESTIÓN DE JUBILADOS</h1>
        <h4>¡Bienvenido al Sistema de Gestión Jubilados ${params.username}!</h4>
        <h4 class="h4"><strong>Contraseña:</strong> ${params.password}</h4>
    </div>
    <footer>
        <p>&copy; ${new Date().getFullYear()} 14100. Todos los derechos reservados.</p>
    </footer>
</body>

</html>
    `;
};
