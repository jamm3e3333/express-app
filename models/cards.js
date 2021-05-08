const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: Number,
        required: true,
        validator(value){
            if(!validator.isCreditCard(value.toString())){
                throw new Error("Neplatné číslo karty.");
            }
        }
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
