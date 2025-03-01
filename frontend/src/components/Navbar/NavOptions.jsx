import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Navbar.scss'

export default function NavOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPlatestePage = location.pathname === '/pay';
  const isMapPage = location.pathname === '/map-page';
  const isLegislatiePage = location.pathname === '/legislation';

  return (
    <div className='nav-options'>
      <button className={`navbar-option ${isPlatestePage ? 'deactivated' : ''}`}
        id="optionPlateste"
        onClick={() => { navigate("/pay") }}>
        Pay Taxes
      </button>
      <button
        className={`navbar-option ${isMapPage ? 'deactivated' : ''}`}
        id="optionInstitutii"
        onClick={() => { navigate("/map-page") }}>
        Institutions
      </button>
      <button
        className={`navbar-option ${isLegislatiePage ? 'deactivated' : ''}`}
        id="optionLegislatie"
        onClick={() => { navigate("/legislation") }}>
        Legislation
      </button>
    </div>
  )
}
