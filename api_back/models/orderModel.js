const crypto = require('crypto');

module.exports = (_db) => {
    db = _db
    return OrderModel
}

class OrderModel {

    static RECEIVED_BY_CLIENT = 1;

    static SENT_TO_CLIENT = 2;
    
    static CONFIRMED_BY_SELLER = 3;
    
    static CANCELLED_BY_SELLER = 4;
    
    static PAYED = 5;
    
    static NOT_PAYED = 6;

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
        return db.query('INSERT INTO order_details(orderId, advert, priceUnit, quantity, orderedOn, state) VALUES(?,?,?,?,NOW(), ?)', [orderId, line.advertId, line.priceUnit, line.selectedQuantity, this.PAYED])
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

    /* static getMyClientsOrders(sellerId) {

        return db.query(`SELECT od.*, os.state, ad.title, ad.descr, ad.pict 
                         FROM order_details od INNER JOIN adverts ad ON ad.id=od.advert 
                                                INNER JOIN order_states os ON os.id=od.state
                        WHERE advert IN (SELECT id FROM adverts WHERE addedBy=?)`, [sellerId])
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                })
    }

       static getMyClientsOrders(sellerId) {

        return db.query(`SELECT od.*, os.state, ad.title, ad.descr, ad.pict 
                         FROM order_details od INNER JOIN adverts ad ON ad.id=od.advert 
                                                INNER JOIN order_states os ON os.id=od.state
                        WHERE advert IN (SELECT id FROM adverts WHERE addedBy=?)`, [sellerId])
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                })
    }
    */

    static #getMyClientsOrdersByState(sellerId, state1, state2) {

        return db.query(`SELECT od.*, round(od.priceUnit * od.quantity, 2) as totalPrice, oo.client, us.lastName as clientLastName,
                                us.firstName as clientFirstName, us.login as clientLogin, os.state AS orderState, ad.title, ad.description, ad.mainPict ,
                                oo.address AS deliveryAddress, oo.zip AS deliveryZip, oo.city AS deliveryCity
                         FROM order_details od INNER JOIN adverts ad ON ad.id=od.advert 
                                                INNER JOIN order_states os ON os.id=od.state
                                                INNER JOIN orders oo ON oo.id = od.orderId
                                                INNER JOIN users us ON us.id= oo.client
                        WHERE advert IN (SELECT id FROM adverts WHERE addedBy=?) and od.state IN (?,?)
                        ORDER BY receivedOn DESC, sentOn DESC, answeredOn DESC, orderedOn DESC`, [sellerId, state1, state2])
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                })
    }

    static getMyClientsPendingOrders(sellerId) {
        return this.#getMyClientsOrdersByState(sellerId, this.PAYED, this.PAYED);
    }

    static getMyClientsOrdersToSend(sellerId) {
        return this.#getMyClientsOrdersByState(sellerId, this.CONFIRMED_BY_SELLER, this.CONFIRMED_BY_SELLER);
    }

    static getMyClientsSentOrders(sellerId) {
        return this.#getMyClientsOrdersByState(sellerId, this.SENT_TO_CLIENT, this.RECEIVED_BY_CLIENT);
    }

    static getMyClientsCancelledOrders(sellerId) {
        return this.#getMyClientsOrdersByState(sellerId, this.CANCELLED_BY_SELLER, this.CANCELLED_BY_SELLER);
    }

    static getMyPutOrders(clientId) {
        return db.query(`SELECT od.*, round(od.priceUnit * od.quantity, 2) as totalPrice, oo.client, us.lastName as clientLastName,
                                us.firstName as clientFirstName, us.login as clientLogin, os.state AS orderState, ad.title, ad.description, ad.mainPict ,
                                oo.address AS deliveryAddress, oo.zip AS deliveryZip, oo.city AS deliveryCity
                         FROM order_details od INNER JOIN adverts ad ON ad.id=od.advert 
                                                INNER JOIN order_states os ON os.id=od.state
                                                INNER JOIN orders oo ON oo.id = od.orderId
                                                INNER JOIN users us ON us.id= oo.client
                        WHERE oo.client=?
                        ORDER BY receivedOn DESC, sentOn DESC, answeredOn DESC, orderedOn DESC`, [clientId])
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                })        
    }

    static checkOrderDetails(id) {
        return db.query(`SELECT od.*, ad.addedBy, oo.client 
                        FROM order_details od INNER JOIN adverts ad ON ad.id=od.advert 
                                                INNER JOIN orders oo ON oo.id=od.orderId 
                        WHERE od.id=?`, [id])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static confirmOrder(detailsId, comment) {
        return db.query('UPDATE order_details SET state=?, answeredOn=NOW(), sellerComment=trim(?) WHERE id=?', [this.CONFIRMED_BY_SELLER, comment, detailsId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static cancelOrder(detailsId, comment) {
        return db.query('START TRANSACTION')
        .then((res) => {
            return db.query('UPDATE order_details SET state=?, answeredOn=NOW(), sellerComment=trim(?) WHERE id=?', [this.CANCELLED_BY_SELLER, comment, detailsId])
            .then((res) => {
                return db.query('UPDATE adverts SET quantity=quantity+(SELECT quantity FROM order_details WHERE id=?)', [detailsId])
                .then((res) => {
                    return db.query(`UPDATE users SET account=account+(SELECT quantity*priceUnit FROM order_details WHERE id=?) 
                                    WHERE id=(SELECT client FROM orders WHERE id=(SELECT orderId FROM order_details WHERE id=?))`, [detailsId, detailsId])
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
                return err;
            })
        })
        .catch((err) => {
            return db.query('ROLLBACK');
        })
    }

    static markOrderAsSent(detailsId) {
        return db.query('UPDATE order_details SET state=?, sentOn=NOW() WHERE id=?', [this.SENT_TO_CLIENT, detailsId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static markOrderAsReceived(detailsId, comment, clientNote) {
        return db.query('START TRANSACTION')
        .then((res) => {
            return db.query('UPDATE order_details SET state=?, receivedOn=NOW(), clientComment=trim(?), clientNote=? WHERE id=?', [this.RECEIVED_BY_CLIENT, comment, clientNote, detailsId])
            .then((res) => {
                return db.query(`UPDATE users SET account=account+(SELECT quantity*priceUnit FROM order_details WHERE id=?)
                                 WHERE id=(SELECT addedBy FROM adverts WHERE id=(SELECT advert FROM order_details WHERE id=?) )`, [detailsId, detailsId])
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