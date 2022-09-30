import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// Footer
const Footer = (props) => {

    let [date, setDate] = useState()

    useEffect(() =>{
        let now = new Date();
        let day = now.getDate();
        if (day < 10) {
            day = '0'+day
        }
        let month = now.getMonth()+1;
        if (month < 10) {
            month = '0'+month
        }
        let year = now.getFullYear();

        setDate(`${day}.${month}.${year}`)
    }, [])

    return (
        <footer className="page-footer">
            <div>© me ({ date })</div>
            {/*<nav>
                <div>
                    <Link className="link" to="/rules"><FontAwesomeIcon icon={icons.faList} /> Règlement</Link>
                    <Link className="link" to="/faq"><FontAwesomeIcon icon={icons.faQuestionCircle } /> FAQ</Link>
                </div>
            </nav>*/}
        </footer>
    )
}

export default Footer;