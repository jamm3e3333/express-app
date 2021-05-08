const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
            if(value.toLowerCase() === 'password' || value.toLowerCase() == 'heslo'){
                throw new Error("Heslo nesmí obsahovat klíčové slovo \"heslo\" nebo \"password\".");
            }
            if(value.length < 6){
                throw new Error("Heslo musí mít alespoň 6 znaků.!");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const user = this;

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.genAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SEC);
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findUser = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Neplatné údaje.");
    }
    const valid = await bcrypt.compare(password, user.password);
    if(valid){
        return user;
    }
    else{
        throw new Error("Neplatné údaje.");
    }
}

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); 
})

const User = mongoose.model('User', userSchema);

module.exports = User;