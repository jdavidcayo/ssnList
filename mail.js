import * as nodemailer from 'nodemailer';
import { mailLoginData }from './config.js';

const transporter = nodemailer.createTransport({
  host: mailLoginData.host,
  port: mailLoginData.port,
  secure: mailLoginData.secure,
  auth: {
    user: mailLoginData.auth.user,
    pass: mailLoginData.auth.pass
  }
});

async function main (data = null) {
  let desde = 0; let cantidad = 0; let hasta = 0;
  if (data) { desde = data[0][0]; hasta = data[data.length - 1]; cantidad = data.lenght; }
  const mensaje = `<h3>Desde el <strong id="desde">${desde}</strong> hasta el <strong id="hasta">${hasta}</strong> tienes <strong id="cantidad">${cantidad}</strong> de nuevas matriculas nuevas.
  </h3>`;
  const noMatsMensaje = 'No hay nuevas matriculas disponibles.';

  let msg = mensaje;
  if (!data) msg = noMatsMensaje;
  const info = await transporter.sendMail({
    from: mailLoginData.auth.user, // sender address
    to: ['maximilianorevuelta@polizas.com.ar', 'jdavidcayo@gmail.com'], // list of receivers
    subject: 'Lista de productores', // Subject line
    text: 'Actualizacion de productores de seguros',
    html: `<!DOCTYPE html>
    <html lang="es">
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 700;
        }
        .card {
            display: inherit;
            flex-wrap: wrap;
           text-align: center; 
        }
    </style>
    <body>
        <h1>Actualización de lista de Productores de seguros.</h1>
        <div class="card">
            ${msg}
            <h2>Revisa el archivo revisa el archivo principal.</h2>
        </div>
    </body>
    </html>`,
    attachments: [
      {
        filename: 'listado.csv', // Nombre del archivo adjunto
        path: './listado.csv' // Ruta del archivo adjunto
      }
    ]
  });

  console.log('Message sent: %s', info.messageId);
}

export function sendMail (data = null) {
  main(data).catch(console.error);
}
