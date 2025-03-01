import React, { useState } from 'react'
import './FooterInrolare.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import InfoModal from '../InfoModal/InfoModal'

const Footer = () => {
    const [showModal, setShowModal] = useState(true);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <div className='footerContent'>
            <button type='button' onClick={toggleModal}>
                <i><FontAwesomeIcon icon={faQuestion} /></i>
            </button>
            {showModal && (<InfoModal toggleModal={toggleModal}/>)}
        </div>
    )
}

export default Footer