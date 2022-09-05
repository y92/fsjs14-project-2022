const jwt = require('jsonwebtoken');
const config = require(process.env.HOST_DB ? "./config" : "./config_example");
const secret = process.env.SECRET_USER || config.token.secret_user;

const withAuth = (req, res, next) => {

    const token = req.headers['x-access-token'];
    if (token === undefined) {
        res.json({
            status: 404,
            msg: "Token not found"
        })
    }
    else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.json({
                    status: 401,
                    msg: "Invalid token"
                })
            }
            else {
                req.id = decoded.id;
                next();
            }
        })
    }
}

module.exports = withAuth;