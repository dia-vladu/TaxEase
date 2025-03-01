import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './OKModal/OKModal.scss';
import './InrolareModal.scss';
import MailContext from '../../../../context/MailContext';

const InrolareModal = ({ toggleModal, setUpdatedMail }) => {

    useEffect(() => {
        document.body.classList.add('active-modal');
        return () => {
            document.body.classList.remove('active-modal');
        };
    }, []);

    const [mail, setMail] = useState('');
    console.log(mail);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMailChange = (event) => {
        setMail(event.target.value);
        setIsEmailValid(true);
        setErrorMessage('');
        setUpdatedMail(event.target.value);
    };

    const handleCloseModal = () => {
        toggleModal();
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleRequestLinkClick = async () => {
        if (mail === '') {
            setErrorMessage('Please enter an email address.');
            setIsEmailValid(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/institutions/admin-emails');
            const data = await response.json();
            const emailAddresses = data.map((item) => item.adminEmail);
            console.log(emailAddresses);

            if (!emailAddresses.includes(mail)) {
                setIsEmailValid(false);
                setErrorMessage(
                    'The email address is not recognized as authorized. Access to the registration page is not allowed.'
                );
                setMail('');
                return;
            }

            setIsEmailValid(true);
            await fetch(`http://localhost:8080/api/emails/requestLink`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: mail }),
            });

            setIsRequestSent(true);
        } catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content" onClick={handleModalContentClick}>
                    <div className="OK-top-part">
                        <h1>Enroll now!</h1>
                        <button className="close-modal" onClick={handleCloseModal}>
                            <i>
                                <FontAwesomeIcon icon={faXmarkCircle} />
                            </i>
                        </button>
                    </div>
                    <div className="bottom-part-inrolare">
                        <p>Enter your email address to receive the link to the enrollment page.</p>
                        <input type="text" placeholder="Enter email address" value={mail} onChange={handleMailChange} />
                        {!isEmailValid && (
                            <p className="error">
                                <i>
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                </i>
                                {errorMessage}
                            </p>
                        )}
                        {isRequestSent && (
                            <p className="success">An email with the link to the enrollment page has been successfully sent!</p>
                        )}
                        {!isRequestSent && (
                            <button type="button" onClick={handleRequestLinkClick} disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Request link'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default InrolareModal;