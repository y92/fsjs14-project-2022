import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectBasket, modifyBasket, cleanBasket } from '../slices/basketSlice';
//import moment from 'moment';
//import localization from 'moment/locale/fr';
//moment.updateLocale('fr', localization);

const Basket = (props) => {
    const BASKET_LS_NAME = "library-basket";
    const basket = useSelector(selectBasket);
    const dispatch = useDispatch();

    const removeFromBasket = (basket, doc) => {
        let newBasket = basket.filter(item => item.id !== doc.id);

        let lsBasket = JSON.stringify(newBasket);
        window.localeStorage.setItem(BASKET_LS_NAME, lsBasket);
    }

    const empty = () => {
        window.localeStorage.removeItem(BASKET_LS_NAME);
    }

    return (
        <div>
            <h2>Panier</h2>
            {basket.basket.length > 0 ? <table className="basket-table">
                <thead>
                    <tr>
                        <th>Document</th>
                        <th>Date de retour prévue</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan={5}>
                            <button className="empty-button"
                                    onClick={(e) => {
                                        empty();
                                    }}
                            >Vider le panier</button>
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                    {basket.basket.map((document) => {
                        return (
                            <tr key={document.id}>
                                <td>{document.title}</td>
                                <td>{document.scheduledReturnDate}</td>
                                <td><button 
                                        className="remove-item-button"
                                        onClick={(e) => {
                                            removeFromBasket(basket.basket, document)
                                        }}>Retirer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table> : <p>Votre panier est vide.</p>}
            <Link to="/lend">Emprunter</Link>
        </div>
    )
}

export default Basket;