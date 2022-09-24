const crypto = require('crypto');

module.exports = (_db) => {
    db = _db
    return OrderModel
}

class OrderModel {

    static #insertOrder(orderId, req) {
        return db.query("INSERT INTO orders(id, client, address, zip, city, orderedOn) VALUES(?,?,?,?,?,NOW())", [orderId, req.id, req.body.address, req.body.zip, req.body.city])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static #insertOrderDetails(orderId, line) {
        return db.query('INSERT INTO order_details(orderId, advert, priceUnit, quantity, orderedOn, state) VALUES(?,?,?,?,NOW(), 5)', [orderId, line.advertId, line.priceUnit, line.selectedQuantity])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static #decreaseAdvertQuantity(selectedQuantity, advertId) {
        return db.query('UPDATE adverts SET quantity=quantity-? WHERE id=?', [selectedQuantity, advertId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static #decreaseAccount(sum, userId) {
        return db.query('UPDATE users SET account=account-? WHERE id=?', [sum, userId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static #insertOrderLines(orderId, lines, i, account, userId) {
        return this.#insertOrderDetails(orderId, lines[i])
        .then ((res) => {
            return this.#decreaseAdvertQuantity(lines[i].selectedQuantity, lines[i].advertId)
            .then((res) => {
                if (account) {
                    return this.#decreaseAccount(lines[i].selectedQuantity * lines[i].priceUnit, userId)
                    .then((res) => {
                        if (i >= lines.length-1) {
                            return res;
                        }
                        else return this.#insertOrderLines(orderId, lines, i+1, account, userId);
                    })
                }
                else if (i >= lines.length-1) {
                    return res;
                }
                else return this.#insertOrderLines(orderId, lines, i+1, account, userId)
            })
            .catch((err) => {
                return err;
            })

        })
        .catch((err) => {
            return err;
        })
    }

    static payOrder(req, account=false) {
        const orderId = crypto.randomBytes(16).toString("hex");

        return db.query('START TRANSACTION')
            .then((res) => {
                // select last_INSERT_ID() as lastId from ...
                return this.#insertOrder(orderId, req)
                .then((res) => {
                    return this.#insertOrderLines(orderId, req.body.items, 0, account, req.id)
                    .then((res) => {
                        return db.query('COMMIT')
                        .then((res) => {
                            return res;
                        })
                        .catch((err) => {
                            return err;
                        })
                    })
                    .catch((err) => {
                        return err;
                    })
                })
                .catch((err) => {
                    return err;
                })
            })
            .catch((err) => {
                return db.query('ROLLBACK');
            })
    }

}