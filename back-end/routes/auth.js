const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation');


//User model
const User = require('../models/User');


// Login
//router.get('/login', (req, res) => res.json({ "message": "THIS IS SUPER SECRET, DO NOT SHARE!" }));

// Register Handle
router.post('/register', async(req, res) => {

    //validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user is already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        balance: 1000
    });
    try {
        const savedUser = await user.save();
        const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_JWT_TOKEN);
        res.header('Token', token).send({ token: token });
    } catch (err) {
        res.status(400).send(err);
    }
    console.log(req.body);
    // res.send(errors);
})

// Login Handle
router.post('/login', async(req, res) => {

    //validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email doesn\'t exist');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_JWT_TOKEN);
    res.header('Token', token).send({ token: token });
    // res.header();
    //res.send(user.name);
});


router.get('/user', verify, async(req, res) => {
    let user = await User.findOne({ _id: req.user });
    res.send(user.name);

});
module.exports = router;