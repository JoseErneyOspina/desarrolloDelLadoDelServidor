//
// Prueba de la cuenta generada de ethereal para Nodemailer
// https://ethereal.email/

//
// Prueba sobre la consola con node test.js
//

const nodemailer = require('nodemailer');

//Generar el servicio SMTP con la cuenta de ethereal.email
nodemailer.createTestAccount((err, account)=>{

	if (err) {
		console.error('Fallo la creacion del est en la cuenta' + err.message);
		return process.exit(1);

	}

	// Si no tenemos error, seguimos para obtener las credenciales...
	console.log('Credenciales obtenidas...');

	// Crear datos de la conexion...
	let transporter = nodemailer.createTransport({

		host: 'smtp.ethereal.email',
		port: 587,

		auth: {
			user:'grayce.wisoky91@ethereal.email',
			pass:'jPSQmHGsVJZSWhc3sR'
		}

	});

		// Creamos el mensaje (objeto)
	let message = {
			from: 'cmulero83@icloud.com',
			to: 'grayce.wisoky91@ethereal.email',
			subject: 'Nodemailr is unicode friendly',
			text: 'Hola mundo...',
			html: '<p><b>Hola</b> mundo...</p>'

	};

	// Realizamos el envio...
	transporter.sendMail(message, (err, info)=>{
		if (err) {
			console.log('Ocurrio un error', + err.message);
			return process.exit(1);
		}

		console.log('Mensaje enviado:  %s ', info.messageId);

		// Solo si se enviar a traves de Ethereal acount
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	});

});

