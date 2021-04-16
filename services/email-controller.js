const nodemailer = require( 'nodemailer' );
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: 'hgloo.app.c@gmail.com',
        pass: 'asdf.456',
    },
    tls: {
      rejectUnauthorized: false,  
    },
});

let mailOptions = {
    from: 'hgloo.app.c@gmail.com',
    to: 'jareyesm@unah.hn',
    subject: 'Hello',
    text: 'Hello world',
    html: '<b>Hello world?</b>',
};

async function sendMail() {
    const message = null;
    await transporter.sendMail( mailOptions, ( error, info ) => {
        if ( error ) {
            return console.log( error );
        } else {
            console.log('Message sent: %s', info.messageId);
            message = info.messageId;    
        }
    });

    return { message: message };
}

module.exports = {
    sendMail
}