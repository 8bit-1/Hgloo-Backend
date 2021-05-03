const cron = require("node-cron");
const emailSender = require('./email-controller');

class SendEmail{
    actualizarNow = false; // Estado necesario al actualizar la fecha del job (cron) 
    // 0 23 * * 6
    envioCorreos = cron.schedule( "0 23 * * 6" , ()=>{
        console.log("hello world!");
        emailSender.sendMail();
    },{
        scheduled: false,
        timezone: "America/Tegucigalpa"
    });    // Aqui se guardara el cron.

    // {
    //     scheduled: true,
    //     timezone: "America/Sao_Paulo"
    //   }
    hora = '23';
    minuto = '00';
    diaSemana = '06';

    diaMes = '15';

    diario = false; // 1
    semanal = true;  // 2
    mensual = false; // 3

    constructor(  ){
        this.envioCorreos.start();
    }

    updateData(data){
        this.hora = data.hora;
        this.minuto = data.minuto;
        this.diaSemana = data.diaSemana;

        if(!data.actualizarNow){
            this.actualizarNow = true;
            return "sucessfull";
        }else{
            this.actualizarNow = false;
            return this.updateJobNow();
        }
    }

    obtainData(){
        return {
            hora: this.hora,
            minuto: this.minuto,
            diaSemana: this.diaSemana,
            diaMes: this.diaMes,
            diario: this.diario,
            semanal: this.semanal,
            mensual: this.mensual
        };
    }

    startJob(){
        this.envioCorreos.start();
        return 'started'
    }

    stopJob(){
        this.envioCorreos.stop();
        return "stopped"
    }

    minutosTres(){
        this.envioCorreos.destroy;
        this.envioCorreos = cron.schedule( "*/2 * * * * *" , ()=>{
                console.log("hello world!");
        });
        return "sucessful"
    }

    updateJobNow(){
        this.envioCorreos.destroy;
        var fecha;
        fecha = this.minuto + ' ' + this.hora + ' * * ' + this.diaSemana;
        this.envioCorreos = cron.schedule( fecha , ()=>{
            console.log('Enviando Correos...');
            console.log(emailSender.sendMail());
        },{
            scheduled: true,
            timezone: "America/Tegucigalpa"
        });
        return "sucesfull";
    }

    updateJob(){ 
        this.envioCorreos.destroy;
        var fecha;
        if(this.diario){
            fecha = this.minuto + ' ' + this.hora + ' * * *';
            this.envioCorreos = cron.schedule( fecha , ()=>{
                if(this.actualizarNow){
                    console.log(emailSender.sendMail());
                    this.actualizarNow = false();
                    this.updateJob();
                }else{
                    console.log("hello world!");
                }
            });
        }else if(this.semanal){
            fecha = this.minuto + ' ' + this.hora + ' * * ' + this.diaSemana;
            this.envioCorreos = cron.schedule( fecha , ()=>{
                if(this.actualizarNow){
                    console.log('Enviando Correos...');
                    // console.log(emailSender.sendMail());
                    this.actualizarNow = false();
                    this.updateJob();
                }else{
                    console.log('Enviando Correos...');
                    onsole.log(emailSender.sendMail());
                }
            },{
                scheduled: true,
                timezone: "America/Tegucigalpa"
            });
        }else if(this.mensual){
            fecha = this.minuto + ' ' + this.hora + ' ' + this.diaMes + ' * * ';
            this.envioCorreos = cron.schedule( fecha , ()=>{
                if(this.actualizarNow){
                    console.log(emailSender.sendMail());
                    this.actualizarNow = false();
                    this.updateJob();
                }else{
                    console.log(emailSender.sendMail());
                }
            });
        }else{
            this.envioCorreos = cron.schedule( "0 23 * * 6" , ()=>{
                if(actualizarNow){
                    console.log(emailSender.sendMail());
                    this.actualizarNow = false();
                    this.updateJob();
                }else{
                    console.log(emailSender.sendMail());
                }
            },
            {
                scheduled: true,
                timezone: "America/Tegucigalpa"
            });
        }
    }

}

module.exports = new SendEmail();

