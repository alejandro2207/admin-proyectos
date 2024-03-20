import nodemailer from 'nodemailer';


export const emailRegistro = async(datos) => {
    const {nombre, email, token} = datos;

    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email a enviar

    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptaks.com',
        to: email,
        subject: 'Uptask - Comprueba tu cuenta',
        text: 'Comprueba tu cuenta en Uptask',
        html: `
        <p>Hola: ${nombre} comprueba tu cuenta en Uptaks</p>
        <p>Tu cuenta ya esta casi lista solo debes hacer click en el enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });
}

export const cambioPassword = async(datos) => {
    const {nombre, email, token} = datos;
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email a enviar

    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptaks.com',
        to: email,
        subject: 'Uptask - Cambia tu password',
        text: 'Cambia tu password y continua conectado',
        html: `
        <p>Hola: ${nombre} hemos recibo una solicitud para cambio de contraseña en tu cuenta Uptaks</p>
        <p>Para actualizar tu contraseña presiona en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
        <p>Si tu no solicitaste el cambio, puedes ignorar el mensaje</p>
        `
    });
}