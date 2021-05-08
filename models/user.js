const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Špatný formát emailu.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(password.toLowerCase() === 'password' || password.toLowerCase() == 'heslo'){
                throw new Error("Heslo nesmí obsahovat klíčové slovo.");
            }
            if(password.length < 6){
                throw new Error("Heslo musí mít alespoň 6 znaků.!");
            }
        }
    }
})