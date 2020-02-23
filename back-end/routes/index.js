const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');

const Keno = require('../keno/index');

//User model
const User = require('../models/User');

router.get('/cash', verify, async(req, res) => {
    let user = await User.findOne({ _id: req.user });
    console.log(user.balance);
    res.status(200).send((user.balance).toString());
});
router.put('/increseBalance', verify, async(req, res) => {
    let user = await User.findOne({ _id: req.user });
    user.balance += parseInt(req.body.increaseBy);
    user.save();
    res.status(200).send((user.balance).toString());
});
router.put('/play', verify, async(req, res) => {
    let user = await User.findOne({ _id: req.user });
    user.balance -= parseInt(req.body.bet);
    if (user.balance < 0) {
        res.status(400).send("Out of balance");
        return
    }
    var winNumbers = Keno.shuffle();
    var yourWin = Keno.checkWinnings(req.body.selected, req.body.bet, winNumbers);
    user.balance += yourWin;
    user.save();
    res.status(200).send({ winNumbers: winNumbers, win: (yourWin - req.body.bet).toString() });
});
module.exports = router;