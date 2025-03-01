import React from 'react'
import './DownloadSection.scss'
import { saveAs } from 'file-saver'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'

const DownloadSection = () => {
    const downloadEnrollRequest = () => {
        const request = new URL('../../assets/samples/TaxEaseEnrollForm.pdf', import.meta.url).href
        fetch(request)
            .then(response => response.blob())
            .then(blob => {
                saveAs(blob, 'TaxEaseEnrollForm.pdf')
            });
    }

    return (
        <div className='downloadSection'>
            <h2>Download Enrollment Request</h2>
            <div className="body">
                <div className='instructions'>
                    Download the enrollment request in PDF format, fill out the details electronically,
                    and upload the completed request for enrollment.
                </div>
                <button type='button' onClick={downloadEnrollRequest}>
                    <i><FontAwesomeIcon icon={faFileDownload} /></i>
                    Download</button>
            </div>
        </div>
    )
}

export default DownloadSection