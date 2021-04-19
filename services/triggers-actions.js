const axios = require('axios');

class configHgloo {
    apiKey = '96fabda298-6cf779576c-qqyeae';

    constructor() {
        // this.setExchangesRates();
        // setInterval( this.setExchangesRates , 86400000);
    }
    
    setExchangesRates() {
        axios.get('https://api.fastforex.io/fetch-one?from=USD&to=HNL&api_key=96fabda298-6cf779576c-qqyeae')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    setEmailsDate() {

    }
}

module.exports = new configHgloo();