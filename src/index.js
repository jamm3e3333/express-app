const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./routers/userRouter.js');
require('../db/mongodb.js');

const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
    res.send("Application running");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})