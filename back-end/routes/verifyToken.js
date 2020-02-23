const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    // get token and remove Bearer from string
    const token = req.header('Authorization').slice(7);
    console.log(token);

    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.SECRET_JWT_TOKEN);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}