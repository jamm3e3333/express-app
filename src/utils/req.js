const axios = require('axios');
const validCard = async(cardNum, cb) => {
    try{
        const valid = await axios.get(`http://private-264465-litackaapi.apiary-mock.com/cards/${cardNum}/validity`);
        const state = await axios.get(`http://private-264465-litackaapi.apiary-mock.com/cards/${cardNum}/state`);
        return cb(undefined, {valid: valid.data, state: state.data});
    }
    catch(e){
        cb(e,undefined);
    }
}

module.exports = validCard;