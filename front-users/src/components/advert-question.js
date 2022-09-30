import memberPhotoNone from '../assets/memberPhotoNone.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import makeDate from '../helpers/makeDate';
import { Link } from 'react-router-dom';
import { selectUser } from '../slices/userSlice';
import { selectAnswerQuestionPopup, setQuestionToAnswer, displayAnswerQuestionPopup, dismissAnswerQuestionPopup } from '../slices/answerQuestionPopupSlice';
import { selectDeleteQuestionPopup, setQuestionToDelete, displayDeleteQuestionPopup, dismissDeleteQuestionPopup } from '../slices/deleteQuestionPopupSlice';
import { useDispatch, useSelector } from 'react-redux';



const AdvertQuestion = (props) => {
    
    const question = props.question;
    const advertAuthor = props.advertAuthor;
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    return (
        <>
            <li className="advert-question-item" key={"advert-question-"+question.id}>
                <div className="advert-question-asked-by-avatar"><img src={question.askedByPhoto || memberPhotoNone } alt={question.askedByLogin} /></div>
                <div className="advert-question-data">
                    <div className="advert-question-date-and-author">
                        <span className="advert-question-date">
                            <FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{makeDate(question.askedOn)}</span>
                        </span>
                        <span className="advert-question-author">
                            <Link to={"/user/"+question.askedBy}><FontAwesomeIcon icon={icons.faUser} /> <span>{question.askedByLogin}</span></Link>
                        </span>
                    </div>
                    <div className="advert-question-content">{question.question}</div>
                    {props.buttons && <div className="advert-question-buttons">
                        { user && user.data && (user.data.id === question.askedBy) && !question.answer && <a className="button" title="Supprimer" onClick={(e) => {dispatch(setQuestionToDelete(question)); dispatch(displayDeleteQuestionPopup(selectDeleteQuestionPopup))}}><FontAwesomeIcon icon={icons.faTimes} /></a> } 
                        { user && user.data && (user.data.id === advertAuthor) && !question.answer && <a className="button" title="Répondre" onClick={(e) => {dispatch(setQuestionToAnswer(question)); dispatch(displayAnswerQuestionPopup(selectAnswerQuestionPopup))}}><FontAwesomeIcon icon={icons.faReply } /></a> }
                    </div>}
                </div>
            </li>
            {question.answer && (
                <li className="answer-to-question-item" key={"answer-to-question-"+question.id}>
                    <div className="answered-by-avatar"><img src={question.answeredByPhoto || memberPhotoNone } alt={question.answeredByLogin} /></div>
                    <div className="answer-to-question-data">
                        <div className="answer-to-question-date-and-author">
                            <span className="answer-to-question-date">
                                    <FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{makeDate(question.answeredOn)}</span>
                            </span>
                            <span className="answer-to-question-author">
                                <Link to={"/user/"+question.answeredBy}><FontAwesomeIcon icon={icons.faUser} /> <span>{question.answeredByLogin}</span></Link>
                            </span>
                        </div>
                        <div className="answer-to-question-content">{question.answer}</div>
                    </div>
                </li>
            )}
        </>
    )
}

export default AdvertQuestion;