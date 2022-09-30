module.exports = (_db) => {
    db = _db
    return AdvertModel
}

class AdvertModel {

    static addAdvert(req) {
        return db.query("INSERT INTO adverts(categ, title, description, state, stateDescr, price, quantity, addedBy, addedOn) VALUES(?,trim(?),trim(?),?,trim(?),?,?,?,NOW())", [req.body.categ, req.body.title, req.body.description, req.body.state, req.body.stateDescr, req.body.price, req.body.quantity, req.id])
            .then((result) => {
                return result
            })
            .catch((err) => {
                return err
            })
    }

    static getAdvertById(id) {
        return db.query(`SELECT ad.*, (SELECT title FROM advert_categs WHERE id=ad.categ) as categTitle, (SELECT state FROM advert_states WHERE id=ad.state) as advertState, 
                        (SELECT round(avg(clientNote),1) FROM order_details WHERE advert IN (SELECT id FROM adverts WHERE addedBy=ad.addedBy)) AS sellerAvgClientsNotes, 
                        (SELECT count(clientNote) FROM order_details WHERE advert IN (SELECT id FROM adverts WHERE addedBy=ad.addedBy)) AS sellerNbClientsNotes,
                        (SELECT login FROM users WHERE id=ad.addedBy) as addedByUser
                        FROM adverts ad WHERE ad.id=?`, [id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            })
    }

    static editAdvert(id, req) {
        return db.query("UPDATE adverts SET categ=?, title=trim(?), description=trim(?), state=?, stateDescr=trim(?), price=?, quantity=?, lastEditOn=NOW(), nbEdits=nbEdits+1 WHERE id=?", [req.body.categ, req.body.title, req.body.description, req.body.state, req.body.stateDescr, req.body.price, req.body.quantity, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    static editAdvertMainPict(id, req) {
        return db.query("UPDATE adverts SET mainPict=trim(lower(?)) WHERE id=?", [req.body.mainPict, id])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    static getAdvertsByUser(id) {
        return db.query("SELECT * FROM adverts WHERE addedBy=? ORDER BY addedOn DESC", [id])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getMyAdverts(req) {
        return this.getAdvertsByUser(req.id);
    }

    static getLastAdverts(limit) {
        return db.query("SELECT * FROM adverts WHERE quantity > 0 ORDER BY addedOn DESC LIMIT ?", [limit])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getAdvertStates() {
        return db.query("SELECT * FROM advert_states")
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getAdvertCategs() {
        let select = `WITH RECURSIVE rel_tree AS 
                         (SELECT id, title, descr, parent, 0 AS depth, CONCAT(id,'') AS path_info FROM advert_categs p WHERE parent IS NULL 
                UNION ALL SELECT sc2.id, sc2.title, sc2.descr, sc2.parent, p.depth+1 AS depth, CONCAT(p.path_info,',',sc2.id) AS path_info FROM advert_categs sc2, rel_tree p WHERE sc2.parent = p.id)
                SELECT id, title, CONCAT(REPEAT('--',depth),' ',title) AS formattedTitle, descr, depth, CONCAT('[',path_info,']') as pathInfo FROM rel_tree ORDER BY path_info ASC`;

        return db.query(select)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getMyFavoriteAdverts(req) {
        return db.query('SELECT * FROM adverts WHERE id IN (SELECT advert FROM advert_favorites WHERE user=?)', [req.id])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static hasFavorite(req, advertId) {
        return db.query('SELECT * FROM advert_favorites WHERE user=? AND advert=?', [req.id, advertId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static addAsFavorite(req, advertId) {
        return db.query('INSERT INTO advert_favorites(user, advert) VALUES(?,?)', [req.id, advertId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static deleteOneFavorite(req, advertId) {
        return db.query('DELETE FROM advert_favorites WHERE user=? AND advert=?', [req.id, advertId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static deleteAllFavorites(req) {
        return db.query('DELETE FROM advert_favorites WHERE user=?', [req.id])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getAdvertQuestions(advertId) {
        return db.query(`SELECT adq.*, (SELECT login FROM users WHERE id=adq.askedBy) AS askedByLogin, (SELECT photo FROM users WHERE id=adq.askedBy) AS askedByPhoto,
                        (SELECT login FROM users WHERE id=adq.answeredBy) AS answeredByLogin, (SELECT photo FROM users WHERE id=adq.answeredBy) AS answeredByPhoto
                         FROM advert_questions adq WHERE adq.advert=? ORDER BY askedOn DESC`, [advertId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static getAdvertQuestionById(questionId) {
        return db.query("SELECT adq.*, (SELECT addedBy FROM adverts WHERE id=adq.advert) AS advertAddedBy FROM advert_questions adq WHERE id=?", [questionId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static askQuestion(advertId, req) {
        return db.query("INSERT INTO advert_questions(advert, question, askedBy, askedOn) VALUES(?, trim(?), ?, NOW())", [advertId, req.body.question, req.id])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static answerQuestion(questionId, req) {
        return db.query("UPDATE advert_questions SET answer=trim(?), answeredBy=?, answeredOn=NOW() WHERE id=?", [req.body.answer, req.id, questionId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }

    static deleteQuestion(questionId) {
        return db.query("DELETE FROM advert_questions WHERE id=?", [questionId])
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }
}