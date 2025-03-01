import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './LegislatiePageContent.scss';
import ContactForm from './ContactForm'

const laws = [
    {
        href: "https://static.anaf.ro/static/10/Anaf/cod_procedura/Cod_Procedura_Fiscala_2023.htm",
        linkText: "LAW no. 207/2015",
        description: " on the Fiscal Procedure Code",
    },
    {
        href: "https://www.noulcodfiscal.ro/",
        linkText: "Updated Tax Code for 2023",
        description: ", including the latest changes",
    },
    {
        href: "https://static.anaf.ro/static/10/Anaf/legislatie/OG_16_2023.pdf",
        linkText: "ORDINANCE No 16 of January 31, 2023",
        description: " amending and supplementing Law no. 207/2015 on the Fiscal Procedure Code",
    },
    {
        href: "https://legislatie.just.ro/Public/DetaliiDocumentAfis/262918",
        linkText: "LAW no. 370 of December 20, 2022",
        description: " on the approval of Government Ordinance no. 16/2022, amending the Fiscal Code",
    },
];

const LawItem = ({ href, linkText, description }) => (
    <div className="lege">
        <p>
            <a href={href} target="_blank" rel="noopener noreferrer">{linkText}</a>{description}
        </p>
    </div>
);

const Section = ({ id, title, children }) => (
    <div id={id} className="part">
        <h2>{title}</h2>
        <div>{children}</div>
    </div>
);

export default function LegislationPageContent() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace("#", "");
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        }
    }, [location]);

    return (
        <div className='legi-content'>
            <Section id="current-legislation" title="Current Legislation">
                <div className="legi-section">
                    {laws.map((law, index) => <LawItem key={index} {...law} />)}
                </div>
            </Section>
            <Section id="data-privacy" title="Data privacy">
                <p className='gdpr'>
                    At TaxEase, we are committed to protecting the privacy and security of our users' personal data. We understand the importance of the personal information you provide to us
                    and we want to ensure that we respect your privacy and data protection rights. Through our privacy policy, we provide you with clear and
                    transparent information about how we collect, use, store and protect your personal data. We comply with data protection legislation and implement
                    appropriate technical and organizational measures to ensure the security and confidentiality of your information.
                </p>
                <p className='gdpr'>
                    We collect personal data only for the specified purposes and in accordance with legal principles. The personal data we collect may include information such as your name,
                    email address, postal address and other relevant information necessary to provide our services to you. We use this data to deliver the products or services you request,
                    to contact you with questions or requests, and to provide you with a personalized experience on our website. We ensure the confidentiality of your data through appropriate security measures, such as data encryption and access control.
                    We do not disclose your personal data to third parties without your consent, except as required by law or to protect our legitimate interests. You have the right to access, modify or delete
                    your personal data and to withdraw your consent at any time.
                </p>
            </Section>
            <Section id="contact" title="Contact">
                <p className='mesaj-contact-first'>To contact us, please fill in the form below &#x1F447; with your contact details.</p>
                <p className='mesaj-contact'>We will get back to you as soon as possible.</p>
                <ContactForm />
            </Section>
        </div>
    )
}
