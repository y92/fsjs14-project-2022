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
        return db.query(`SELECT ad.*, c.title as categTitle, s.state as advertState, u.login as addedByUser
                        FROM adverts ad INNER JOIN advert_categs c ON c.id=ad.categ INNER JOIN advert_states s ON s.id=ad.state INNER JOIN users u ON u.id = ad.addedBy WHERE ad.id=?`, [id])
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

    static getMyAdverts(req) {
        return db.query("SELECT * FROM adverts WHERE addedBy=? ORDER BY addedOn DESC", [req.id])
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
                SELECT id, title, CONCAT(REPEAT('-',depth),' ',title) AS formattedTitle, descr, depth, CONCAT('[',path_info,']') as pathInfo FROM rel_tree ORDER BY path_info ASC`;

        return db.query(select)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        })
    }
}