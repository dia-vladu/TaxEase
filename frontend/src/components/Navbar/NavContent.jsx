import React from 'react'
import NavOptions from './NavOptions'
import NavButtons from './NavButtons'
import { useLocation } from 'react-router-dom';

export default function NavContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className='nav-content'>
      {!isDashboard && <NavOptions />}
      <NavButtons />
    </div>
  );
}
