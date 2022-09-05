import React, {useState} from 'react';
import {register} from '../../api/user';
import {Navigate} from 'react-router-dom';

const Register = (props) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [disabled, setDisabled] = useState(true);

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);

    const onSubmitForm = () => {
        let user = {
            lastName: lastName,
            firstName: firstName,
            birthDate: birthDate,
            email: email,
            password: password,
            password2: password2,
            address: address,
            zip: zip,
            city: city
        }

        setError(null);

        register(user)
        .then((data) => {
            console.log(data)
            if (data.error) {
                setError(data.error);
            }
            else if (data.status === 200) {
                setRedirect(true);
            }
        })
        .catch((err) => {
            setError("Une erreur est survenue")
            console.error(err);
        })
    }

    if (redirect) {
        return <Navigate to="/login" />
    }
    return (
        <>
            <h1>Inscription</h1>
            <form className="c-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitForm();
                  }}>
                <input type="text"
                        placeholder="Votre nom"
                        onChange={(e) => {
                            setLastName(e.currentTarget.value)
                }} />
                <input type="text"
                        placeholder="Votre prénom"
                        onChange={(e) => {
                            setFirstName(e.currentTarget.value)
                }} />
                <input type="email"
                        placeholder="Votre e-mail"
                        onChange={(e) => {
                            setEmail(e.currentTarget.value)
                }} />                
                <input type="date"
                        placeholder="Votre date de naissance"
                        onChange={(e) => {
                            setBirthDate(e.currentTarget.value)
                }} />
                <input type="password"
                        placeholder="Votre mot de passe"
                        onChange={(e) => {
                            setPassword(e.currentTarget.value)
                }} />
                <input type="password"
                        placeholder="Confirmer votre mot de passe"
                        onChange={(e) => {
                            setPassword2(e.currentTarget.value)
                }} />
                <input type="text"
                        placeholder="Votre adresse"
                        onChange={(e) => {
                            setAddress(e.currentTarget.value)
                }} />
                <input type="text"
                        placeholder="Votre code postal"
                        onChange={(e) => {
                            setZip(e.currentTarget.value)
                }} />
                <input type="text"
                        placeholder="Votre ville"
                        onChange={(e) => {
                            setCity(e.currentTarget.value)
                }} />
                {error && <div className="error">{error}</div>}
                <input type="submit" value="S'inscrire" />
            </form>
        </>
    )
}

export default Register;