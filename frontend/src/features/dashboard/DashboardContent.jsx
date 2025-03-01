import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DashboardImpozite from './DashboardImpozite';
import DashboardUserInfo from './DashboardUserInfo';
import './DashboardContent.scss';
import DashboardIstoric from './DashboardIstoric';
import DashboardProfil from './DashboardProfil';
import DashboardPlatiProgramate from './DashboardPlatiProgramate';
import { useNavigate } from 'react-router-dom';
import { ProfilePictureProvider } from '../../context/ProfilePictureContext';
//import useUserData from './useUserData';

export default function DashboardContent() {
    const navigate = useNavigate();
    let location = useLocation();
    //const { userData, error } = useUserData(userAccount);

    const handleButtonClick = (route) => {
        //navigate(route, { state: { userAccount } });
        navigate(route);
    };

    // if (error) {
    //     return <div>{error}</div>;
    // }

    // if (!userData) {
    //     return <div>Loading...</div>;
    // }

    const buttonData = [
        { rootPath: '/dashboard', path: '', label: 'Payment Duties' },
        { rootPath: '/dashboard', path: '/istoric', label: 'History' },
        { rootPath: '/dashboard', path: '/profil', label: 'Profile' },
    ];

    const renderButton = (rootPath, path, label) => {
        const currentPath = location.pathname.replace(rootPath, '') || '';
        const isActive = path === "" ? currentPath === ""
            : currentPath.startsWith(path);

        return (
            <button
                key={path}
                className={isActive ? 'active' : ''}
                onClick={() => handleButtonClick(rootPath + path)}>
                {label}
            </button>
        );
    };

    return (
        <ProfilePictureProvider>
            <div className='wrapper'>
                <DashboardUserInfo />
                <div className="butoane">
                    {buttonData.map(({ rootPath, path, label }) => renderButton(rootPath, path, label))}
                </div>
                <div className="main-section margine inaltime-max">
                    {location.pathname === '/dashboard' && <DashboardImpozite />}
                    {location.pathname.startsWith('/dashboard/istoric') && <DashboardIstoric />}
                    {location.pathname === '/dashboard/profil' && <DashboardProfil />}
                </div>
            </div>
        </ProfilePictureProvider>
    )
}
