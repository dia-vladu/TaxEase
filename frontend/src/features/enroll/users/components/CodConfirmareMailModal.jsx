import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import '../../institutions/components/OKModal/OKModal.scss';
import '../../institutions/components/InrolareModal.scss';

const CodConfirmareModal = ({ toggleModal, generatedCode, formData }) => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        document.body.classList.add('active-modal');
        return () => document.body.classList.remove('active-modal');
    }, []);

    const handleCodChange = (event) => {
        setCode(event.target.value);
        setErrorMessage('');
    };

    const handleCloseModal = () => toggleModal();

    const handleModalContentClick = (e) => e.stopPropagation();

    const sendConfirmationRequest = async () => {
        try {
            const accountResponse = await fetch("http://localhost:8080/api/accounts/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if(!accountResponse.ok){
                throw new Error(`Account creation failed: ${accountResponse.statusText}`);
            }

            const emailResponse = await fetch("http://localhost:8080/api/emails/createAccount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: formData["email"] }),
            });

            if(!emailResponse.ok){
                throw new Error(`Email confirmation request failed: ${emailResponse.statusText}`);
            }

            navigate("/login");
        } catch (error) {
            console.error("Error sending confirmation request:", error);
        }
    };

    const handleRequestLinkClick = () => {
        if (!code) {
            setErrorMessage("Please enter the confirmation code.");
            return;
        }

        if (code !== generatedCode) {
            setErrorMessage("Invalid code!");
            return;
        }

        console.log("Generated:", generatedCode, "vs Entered:", code);
        sendConfirmationRequest();
    };

    return (
        <>
            <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content" onClick={handleModalContentClick}>
                    <div className="OK-top-part">
                        <h1>Email confirmation code</h1>
                        <button className="close-modal" onClick={handleCloseModal}>
                            <FontAwesomeIcon icon={faXmarkCircle} />
                        </button>
                    </div>
                    <div className="bottom-part-inrolare">
                        <p>An email containing a confirmation code has been sent to the provided address.</p>
                        <input type="text" placeholder="please enter code" value={code} onChange={handleCodChange} />
                        {errorMessage && (
                            <p className="error">
                                <FontAwesomeIcon icon={faExclamationCircle} />{errorMessage}
                            </p>
                        )}
                        <button type="button" onClick={handleRequestLinkClick}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CodConfirmareModal;