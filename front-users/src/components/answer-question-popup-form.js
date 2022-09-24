import React, { useState, useEffect } from'react';
import {useSelector, useDispatch } from 'react-redux';
import {afterUpdateProfile, selectUser} from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';
import { selectPaymentPopup, dismiss } from '../slices/paymentPopupSlice';
import { Navigate } from 'react-router-dom';
import { checkAccountPayment, addMoneyToAccount } from '../api/user';

const AnswerQuestionPopupForm = (props) => {

    const question = props.question;

    const answerSubmit = (e) => {
        e.preventDefault();
    }

    return (

        <form className="c-form" onSubmit={answerSubmit}>

        </form>
    )
}