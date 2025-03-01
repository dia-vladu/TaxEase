import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import "../../institutions/components/OKModal/OKModal.scss";

const InfoModal = ({ toggleModal }) => {
    useEffect(() => {
        document.body.classList.add('active-modal');
        return () => {
            document.body.classList.remove('active-modal');
        };
    }, []);

    return (
        <>
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <div className="OK-top-part">
                        <h1>Change Password!</h1>
                        <button className="close-modal" onClick={toggleModal}>
                            <i><FontAwesomeIcon icon={faXmarkCircle} /></i>
                        </button>
                    </div>
                    <div className="bottom-part">
                        <p>An email has been sent to your email address.
                            To change your password click on the link in the email.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InfoModal