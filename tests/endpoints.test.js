const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
const User = require('../models/user.js');


const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    email: 'uzivatel1@seznam.cz',
    password: 'ahoj1234',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SEC)
    }]
}
beforeEach( async() => {
    await User.deleteMany();    
    await new User(userOne).save();
})

test('Vytvoří nového uživatele', async() => {
    const response = await request(app).post('/users/create').send({
        email: 'uzivatel@seznam.cz',
        password: 'ahoj321'
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            email: 'uzivatel@seznam.cz'
        },
        token: user.tokens[0].token
    })
});

test('Autentizace existujícího uživatele', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id);
    
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user:{
            email: userOne.email,
        },
        token: user.tokens[user.tokens.length - 1].token
    })
});

test('Autentizace neexistujícího uživatele.', async() => {
    await request(app)
    .post('/users/login')
    .send({
        email: 'uzivatel123@seznam.cz',
        password: 'ahoj12345'
    }).expect(400);
})

test('Ověření platnosti a stavu karty s autentizací', async() => {
    const response = await request(app)
    .get(`/card/${process.env.CRD}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body).toMatchObject({
        "valid": {
            "validity_start": "2016-08-12T00:00:00",
            "validity_end": "2020-08-12T00:00:00"
        },
        "state": {
            "state_id": 100,
            "state_description": "Aktivní v držení klienta"
        }
    })
})