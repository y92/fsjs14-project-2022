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
                return db.query("INSERT INTO users(login, lastName, firstName, email, birthDate, password, address, zip, city, role, registeredOn) VALUES(trim(?), trim(?), trim(?), trim(?), ?, ?, trim(?), ?, trim(?), 1, NOW())", [req.body.login, req.body.lastName, req.body.firstName, req.body.email, req.body.birthDate, hashPwd, req.body.address, req.body.zip, req.body.city])
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
                return user;
            })
            .catch((err) => {
                return err;
            })
    }

    static getUserByLogin(login) {
        return db.query("SELECT * FROM users WHERE trim(lower(login))=trim(lower(?))", [login])
            .then((user) => {
                return user;
            })
            .catch((err) => {
                return err;
            })
    }

    static getUserById(id) {
        return db.query(`SELECT us.*, 
                        (SELECT count(clientNote) FROM order_details WHERE advert IN (SELECT id FROM adverts WHERE addedBy=us.id)) as nbClientsNotes,
                        (SELECT avg(clientNote) FROM order_details WHERE advert IN (SELECT id FROM adverts WHERE addedBy=us.id)) as avgClientsNotes
                        FROM users us WHERE us.id=?`, [id])
            .then((user) => {
                return user;
            })
            .catch((err) => {
                return err;
            })
    }

    static updateProfile(id, req) {
        return db.query("UPDATE users SET login=trim(?), lastName=trim(?), firstName=trim(?), birthDate=?, address=trim(?), zip=?, city=trim(?) WHERE id=?", [req.body.login, req.body.lastName, req.body.firstName, req.body.birthDate, req.body.address, req.body.zip, req.body.city, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    static updateProfilePhoto(id, req) {
        return db.query("UPDATE users SET photo=? WHERE id=?", [req.body.imageUrl, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    static addMoneyToAccount(id, req) {
        return db.query("UPDATE users set account=account+? WHERE id=?", [req.body.moneyToAdd, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }
}