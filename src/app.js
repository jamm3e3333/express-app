const express = require('express');
const app = express();
const userRouter = require('./routers/userRouter.js');
require('../db/mongodb.js');

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
    res.send("Application running");
});

module.exports = app;