import React from 'react'
import DownloadSection from '../DownloadSection/DownloadSection'
import UploadSection from '../UploadSection/UploadSection'
import FooterInrolare from '../Footer/FooterInrolare'
import './InrolareContent.scss'

export default function InrolareContent() {

    return (
        <div className="wrapper inrolare">
            <div className="main-section-inrolare">
                <div className="main-section-inrolare-content">
                    <DownloadSection />
                    <UploadSection />
                </div>
            </div>
            <div className="footer-inrolare">
                <FooterInrolare />
            </div>
        </div >
    )
}
