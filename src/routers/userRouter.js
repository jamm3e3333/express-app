const validator = require('validator');
const epxress = require('express');
const router = new epxress.Router();
const User = require('../../models/user.js');
const auth = require('../../middleware/auth.js');
const validCard = require('../utils/req.js');

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
            .send();
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try{
        const tokens = req.user.tokens.filter((tok) => {
            return tok.token !== req.token;
        })
        req.user.tokens = tokens;
        await req.user.save();
        res.status(200)
            .send("User logged out.");
    }
    catch(e){
        res.status(400)
            .send({error: e.message});
    }
})

router.post('/users/logout/all', auth, async(req, res) => {
    const tokens = [];
    try{
        req.user.tokens = tokens;
        await req.user.save();
        res.status(200)
            .send("Uživatel odhlášen ze všech zařízení.");
    }
    catch(e){
        req.status(400)
            .send();
    }
})

router.delete('/users/delete', auth, async(req, res) => {
    try{
        await req.user.remove();
        res.status(200)
            .send("Uživatel byl odstraněn.");
    }
    catch(e){
        req.status(400)
            .send();
    }
})

router.get('/card/:id', auth, async(req, res) => {
    const card = req.params.id;
    const valid = validator.isCreditCard(card.toString());

    if(!valid){
        return res.status(400)
            .send('Neplatné číslo karty.');
    }
    validCard(card, (err, {valid, state}) => {
        if(err){
            return res.status(400)
                    .send({error: err.message});
        }
        res.status(200)
            .send({valid, state});
    });

});

module.exports = router;