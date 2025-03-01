import React from 'react'
import './Navbar.scss'
import NavLogo from './NavLogo'
import NavContent from './NavContent'
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const allowedPaths = ["/", "/pay", "/map-page", "/legislation"];

  const showNavContent = allowedPaths.includes(location.pathname) || location.pathname.startsWith("/dashboard");

  return (
    <header className='header'>
      <div className='navbar'>
        <NavLogo />
        {showNavContent && <NavContent />}
      </div>
    </header>
  )
}
