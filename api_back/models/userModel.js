const bcrypt = require('bcrypt');
const saltRounds = 11;

module.exports = (_db) => {
    db = _db
    return UserModel
}

class UserModel {

    static register(req) {
        return bcrypt.hash(req.body.password, saltRounds)
            .then(function(hashPwd) {
                return db.query("INSERT INTO users(lastName, firstName, email, password, address, zip, city, role, registeredOn) VALUES(trim(?), trim(?), trim(?), ?, trim(?), ?, trim(?), 1, NOW())", [req.body.lastName, req.body.firstName, req.body.email, hashPwd, req.body.address, req.body.zip, req.body.city])
                    .then((result) => {
                        return result
                    })
                    .catch((err) => {
                        return err
                    })
            })
    }

    static getUserByEmail(email) {
        return db.query("SELECT * FROM users WHERE trim(lower(email))=trim(lower(?))", [email])
            .then((user) => {
                console.log('user', user);

                if (user.length === 0) {
                    return {
                        status: 401,
                        error: "L'utilisateur demandé n'existe pas"
                    }
                }
                else {
                    return user;
                }
            })
            .catch((err) => {
                return err;
            })
    }

    static getUserById(id) {
        return db.query("SELECT * FROM users WHERE id=?", [id])
            .then((user) => {
                console.log('user', user)

                if (user.length === 0) {
                    return {
                        status: 401,
                        error: "L'utilisateur demandé n'existe pas"
                    };
                }
                else {
                    return user;
                }
            })
            .catch((err) => {
                return err;
            })
    }

    static updateProfile(id, req) {
        return db.query("UPDATE users SET lastName=trim(?), firstName=trim(?), address=trim(?), zip=?, city=trim(?) WHERE id=?", [req.body.lastName, req.body.firstName, req.body.address, req.body.zip, req.body.city, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }
}