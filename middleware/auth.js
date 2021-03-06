const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const valid = jwt.verify(token, process.env.JWT_SEC);
        
        const user = await User.findOne({_id: valid._id, 'tokens.token': token});
        if(!user){
            throw new Error("Nutné přihlášení!");
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch(e){
        res.status(401)
            .send({err: e.message});
    }
    
}

module.exports = auth;