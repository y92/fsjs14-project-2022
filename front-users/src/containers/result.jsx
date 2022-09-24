import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectBasket, clearBasket } from '../slices/basketSlice';

const Result = (props) => {
    const dispatch = useDispatch();

    useEffect(()=> {
        window.localStorage.removeItem('library-basket');
        dispatch(clearBasket());
    }, []);

    return (<div>
        <p>La commande a été effectuée avec succès.</p>
        <Link to="/">Retour</Link>
    </div>)
}

export default Result;