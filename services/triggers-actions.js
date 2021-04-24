const axios = require('axios');

class configHgloo {
    apiKey = '96fabda298-6cf779576c-qqyeae';
    exchangesRates = {
        1: {
            USD: 1,
        },
        2: {
            HNL: '',
        },
    }
    emailsDates = null;

    constructor() {
        // this.setExchangesRates();
        // setInterval( this.setExchangesRates , 86400000);
    }
    
    setExchangesRates() {
        axios.get('https://api.fastforex.io/fetch-one?from=USD&to=HNL&api_key=96fabda298-6cf779576c-qqyeae')
        .then(response => {
            this.exchangesRates['2'].HNL = response.data.result.HNL;
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    setEmailsDate() {

    }
}

module.exports = new configHgloo();