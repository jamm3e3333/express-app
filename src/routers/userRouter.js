const User = require('../../models/user.js');
const epxress = require('express');
const router = new epxress.Router();

router.post('/users/create', async(req, res) => {
    const user = new User(req.body);
    try{
        if(!user){
            throw new Error("Chyba serveru.");
        }
        await user.save();
        const token = await user.genAuthToken();

        res.status(201)
            .send({user, token});
    }
    catch(e){
        res.status(400)
            .send({error: e.message});
    }
});

router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findUser(req.body.email, req.body.password);
        const token = await user.genAuthToken();
        res.status(200)
            .send({token, user});
    }
    catch(e){
        res.status(400)
            .send({error: e.message});
    }
})

module.exports = router;