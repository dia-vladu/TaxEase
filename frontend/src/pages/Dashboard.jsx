import React from 'react';
import { useLocation } from 'react-router-dom';
import useUserAccount from '../hooks/useUserAccount.js';
import Navbar from '../components/Navbar/Navbar.jsx';
import DashboardContent from '../features/dashboard/DashboardContent.jsx';
import { UserProvider } from '../context/UserContext.jsx';

export default function Dashboard() {
  const { userAccount, error } = useUserAccount();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  if (error) {
    return <div>{error}</div>;
  }

  if (!userAccount) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isDashboardRoute && <Navbar userAccount={userAccount} />}
      {isDashboardRoute && (
        <UserProvider userAccount={userAccount}>
          <DashboardContent />
        </UserProvider>
      )}
    </>
  )
}
