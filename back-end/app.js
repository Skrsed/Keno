const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
var dotenv = require('dotenv');

dotenv.config();

//Mongoose
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Middleware
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


//Route middlewares
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/index'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));