const crypto = require('crypto');

module.exports = (_db) => {
    db = _db
    return OrderModel
}

class OrderModel {

    static #insertOrderLines(orderId, lines, i) {
        return db.query('INSERT INTO order_details(orderId, advert, priceUnit, quantity, orderedOn, state) VALUES(?,?,?,?,NOW(),5)', [orderId, lines[i].advertId, lines[i].priceUnit, lines[i].selectedQuantity])
        .then ((res) => {
            return db.query('UPDATE adverts SET quantity=quantity-? WHERE id=?', [lines[i].selectedQuantity, lines[i].advertId])
            .then((res) => {
                if (i >= lines.length-1) {
                    return res;
                }
                return this.#insertOrderLines(orderId, lines, i+1)
            })
            .catch((err) => {
                return err;
            })

        })
        .catch((err) => {
            return err;
        })
    }

    static payOrder(req) {
        const orderId = crypto.randomBytes(16).toString("hex");

        return db.query('START TRANSACTION')
            .then((res) => {
                // select last_INSERT_ID() as lastId from ...
                return db.query('INSERT INTO orders(id, client, address, zip, city, orderedOn) VALUES(?,?,?,?,?,NOW())', [orderId, req.id, req.body.address, req.body.zip, req.body.city])
                .then((res) => {
                    return this.#insertOrderLines(orderId, req.body.items, 0)
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