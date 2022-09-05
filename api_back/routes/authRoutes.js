const withAuth = require('../withAuth');
const withAuthUser = require('../withAuthUser');
const jwt = require('jsonwebtoken');

const config = require(process.env.HOST_DB ? '../config_example' : '../config');

const secret = process.env.SECRET || config.token.secret;
const secret_user = process.env.SECRET_USER || config.token.secret_user;

// Token connection routes
module.exports = function(app, db) {
    const UserModel = require('../models/userModel')(db);

    // Check token
    app.get('/api/v1/user/checkToken', withAuthUser, async (req, res, next) => {
        let user = await UserModel.getUserById(req.id);

        if (user.code) {
            res.json({ status: 500, error: user});
        }
        else {
            res.json({status: 200, user: user[0]});
        }
    })
}