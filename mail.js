const nodemailer = require('nodemailer');
const { mailLoginData } = require('./config.js');

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
  const mensaje = '<h3>Tienes matriculas nuevas por ver.</h3>';
  const noMatsMensaje = 'No hay nuevas matriculas disponibles.';

  let attachedFile = [
    {
      filename: 'listado.csv', // Nombre del archivo adjunto
      path: './listado.csv' // Ruta del archivo adjunto
    }
  ];

  let msg = mensaje;
  if (!data) {
    msg = noMatsMensaje;
    attachedFile = [];
  }
  const info = await transporter.sendMail({
    from: mailLoginData.auth.user, // sender address
    to: ['maximilianorevuelta@polizas.com.ar'], // list of receivers
    subject: 'Lista de productores',
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
            <h2>Revisa el archivo principal.</h2>
        </div>
    </body>
    </html>`,
    attachments: attachedFile
  });

  console.log('Message sent: %s', info.messageId);
}

function sendMail (data = null) {
  main(data).catch(console.error);
}

module.exports = {
  transporter,
  sendMail
};
