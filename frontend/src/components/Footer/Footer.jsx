import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Footer.scss'
import ROFlag from "../../assets/images/steag-Romania.png"

export default function Footer() {
    const navigate = useNavigate();

    const sections = [
        { id: "current-legislation", label: "Legislation" },
        { id: "data-privacy", label: "Data Privacy" },
        { id: "contact", label: "Contact" }
    ];

    const handleNavigation = (section) => {
        navigate(`/legislation#${section}`);
    };

    return (
        <footer className="footer">
            <div className="logo-container">
                <div className="logo-text">TaxEase</div>
            </div>
            <hr className="divider" />
            <div className="footer-content">
                <div className="flag">
                    <img src={ROFlag} alt="flag" />
                    <div className="flag-text">România</div>
                </div>
                <nav className="footer-links">
                    {sections.map(({ id, label }) => (
                        <button key={id} className="footer-link" onClick={() => handleNavigation(id)}>
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
        </footer>
    )
}
