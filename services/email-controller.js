const nodemailer = require( 'nodemailer' );
const publicity = require('./Publicity');
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

async function sendEmail( mailOptions ) {
    await transporter.sendMail( mailOptions, ( error, info ) => {
        if ( error ) {
            return console.log( error );
        } else {
            console.log('Message sent: %s', info.messageId);
            message = info.messageId;    
        }
    });
}

async function sendMail() {
    const publicidad = await publicity.postEmail();

    console.log( publicidad );
    publicidad.forEach( async ( usuario ) => {
        if ( usuario.Categorias.length ) {
            var mailOptions = {
                from: 'hgloo.app.c@gmail.com',
                to: usuario.correo,
                subject: 'Hola ' + usuario.Nombre + ' Novedades en tus categorias suscritas',
                text: '',
                html: '',
            };
    
            mailOptions.html = `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Document</title>
                                    <style>
                                        .font {
                                            font-family: 'Montserrat', sans-serif;
                                        }
    
                                        .name-product {
                                            color: #959595;
                                            font-weight: 400;
                                            font-size: 0.8rem;
                                        }
    
                                        .presentation {
                                            font-size: 0.8rem;
                                        }
    
                                        .ubication-product {
                                            color: #0038fe;
                                            font-weight: 500;
                                            font-size: 0.8rem;
                                        }
    
                                        .card {
                                            background-color: white;
                                            border-radius: 25px;
                                        }
    
                                        .product-card {
                                            box-shadow: 0 10px 20px #0000000d, 0 6px 6px #00000000 !important;
                                        }
    
    
                                        .container {
                                            width: 50vw;
                                            height: auto;
                                            margin: auto;
                                            padding: 20px 0px;
                                        }
    
                                        .row {
                                            width: 100%;
                                        }
    
                                        .mx-auto {
                                            margin: auto !important;
                                            text-align: center;
                                        }
    
                                        .text-center {
                                            text-align: center;
                                        }
    
                                        .mb-5 {
                                            margin-bottom: 15px;
                                        }
    
                                        .img-producto {
                                            width: 44% !important;
                                            float: left;
                                            text-align: right;
                                        }
    
                                        .info-product {
                                            width: 53% !important;
                                            float: left;
                                            text-align: left;
                                            padding-left: 15px;
                                        }
                                        
                                        h6 {
                                            margin: 10px;
                                        }
    
                                        @media (max-width: 1200px) { 
                                            .img-producto {
                                                width: 46% !important;
                                            }
    
                                            .info-product {
                                                width: 50% !important;
                                            }
                                        }
                                        @media (max-width: 992px) { 
                                            .img-producto {
                                                width: 100% !important;
                                                text-align: center;
                                            }
    
                                            .info-product {
                                                width: 100% !important;
                                            }
                                        }
    
                                        @media (max-width: 768px) { 
                                            .img-producto {
                                                width: 100% !important;
                                                text-align: center;
                                            }
                                        }
    
                                        @media (max-width: 576px) { 
                                            .img-producto {
                                                width: 100% !important;
                                                text-align: center;
                                            }
                                        }
    
                                    </style>
                                    <link rel="preconnect" href="https://fonts.gstatic.com">
                                </head>
                                <body>
                                    <div class="container card product-card">
                                        <div class="row">
                                            <div class="col-10 mx-auto mt-2">
                                                <div class="row">
                                                    <div class="mx-auto mt-4">
                                                        <img src="https://firebasestorage.googleapis.com/v0/b/hgloo-app.appspot.com/o/Hgloo-images%2Flogo-blue.png?alt=media&token=360caf33-8b0c-4968-af98-64ab57e467aa" width="100px" alt="">
                                                    </div>
                                                    <div class="mb-3 text-center" style="padding: 0 20px;">
                                                        <h4 class="font name-product presentation">Hola <label style="font-size: 1.5rem; font-weight: bold;">¡${ usuario.Nombre }!</label> en Hgloo nos preocupamos por que veas lo que te importa, aqui tienes las nuevas publicaciones de tus categorias suscritas.</h4>
                                                    </div>
                                                </div>
                                                <div class="col-12 mb-5" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/hgloo-app.appspot.com/o/Hgloo-images%2Fbackground-emails.png?alt=media&token=e84cb289-cca8-4186-afe3-394f63fa0b10'); height: 10vh; background-size: cover;"></div>
                                                <div style="border: none;" style="padding: 30px 20px;">
                                                    <div class="row">`
                                                 
                                                    usuario.Categorias.forEach( ( categoria ) => {
                                                        if ( categoria.productos.length ) {
                                                            mailOptions.html += `<div class="row">
                                                                                <div class="col-12 mb-5">
                                                                                    <h6 class="font ubication-product mx-4" style="font-size: 1rem; font-weight: 500; text-align: left; padding-left: 15px;">${ categoria.nombre }</h6>
                                                                                </div>
                                                                            </div>`;
                                                        }
                                    
                                                        categoria.productos.forEach( ( producto ) => {
                                                            mailOptions.html += `
                                                            <div class="img-producto mx-auto text-center">
                                                                <img width="150px" src="${ producto.imagen }" alt="">
                                                            </div>
                                                            <div class="info-product">
                                                                <div class="row">
                                                                    <div class="col-12">
                                                                        <h6 class="font name-product">${ producto.Producto }</h6>
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <h6 class="font ubication-product">${ producto.nombreCiudad }</h6>
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <h6 class="font ubication-product">Estado</h6>
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <h6 class="font name-product">Precio</h6>
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <h6 class="font name-product">Contacto del vendedor</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row mb-0" style="display: inline-block;">
                                                                    <b>
                                                                        <a href="https://akveo.page.link/8V2f" class="font" target="_blank" 
                                                                        style="text-decoration-line: none; font-size: 0.7rem !important; color: #0038fe;">Ver producto</a>
                                                                    </b>
                                                            </div>
                                                            <div class="row mb-0" style="margin-top:10px;">
                                                                <div class="mx-auto" style="width: 10px;">
                                                                    <img width="12px" style="margin-bottom: 15px;" src="https://firebasestorage.googleapis.com/v0/b/hgloo-app.appspot.com/o/Hgloo-images%2Fdecorator-1.png?alt=media&token=1723fde3-5507-4ae7-b782-228afe58c3af" >
                                                                </div>
                                                            </div>
                                                            `;
                                                        });
                                                });
    
            mailOptions.html += `</div></div></div></div></body></html>`
            
            await sendEmail( mailOptions );
        }
    });

    date = new Date();
    return { Ok: 1, date: date }; 
}

module.exports = {
    sendMail
}
