import React, { useState } from 'react'
import './InregistrareContent.scss'
import userImage from "../../assets/images/user-profile-image.png"
import bankImage from "../../assets/images/bank.png"
import { useNavigate } from 'react-router-dom'
import InrolareModal from './institutions/components/InrolareModal'
import MailContext from '../../context/MailContext'

export default function InregistrareContent() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [updatedMail, setUpdatedMail] = React.useState('');

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <MailContext.Provider value={{ updatedMail, setUpdatedMail }}>
            <div className='wrapper'>
                <div className='main-section-inregistrare'>
                    <div className="main-section-inregistrare-content">
                        <div className="deschide-cont-section section">
                            <h2>Individual</h2>
                            <img src={userImage} alt="" />
                            <p>Open a free account and pay your taxes efficiently</p>
                            <button onClick={() => { navigate("/create-account") }}>Open new account</button>
                        </div>
                        <div className="inrolare-section section">
                            <h2>Public Institution</h2>
                            <img src={bankImage} alt="" />
                            <p>Collect tax faster</p>
                            <button
                                onClick={() =>
                                    setShowModal(true)}>
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
                {showModal && (<InrolareModal toggleModal={toggleModal} setUpdatedMail={setUpdatedMail}/>)}
            </div>
        </MailContext.Provider>
    )
}
