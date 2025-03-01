import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import "./OKModal.scss";

const OKModal = ({ toggleModal }) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('active-modal');
        return () => {
            document.body.classList.remove('active-modal');
        };
    }, []);

    const handleButtonClick = () => {
        toggleModal();
        navigate('/'); 
    };

    return (
        <>
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <div className="OK-top-part">
                        <h1>Successful enrollment!</h1>
                        <button className="close-modal" onClick={handleButtonClick}>
                            <i><FontAwesomeIcon icon={faXmarkCircle} /></i>
                        </button>
                    </div>
                    <div className="bottom-part">
                        <p>Enrolment was successful. You will receive a confirmation email.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OKModal