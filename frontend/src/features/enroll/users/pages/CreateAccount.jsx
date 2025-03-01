import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../../../../components/Navbar/Navbar'
import CreateAccontContent from '../components/content/CreateAccountContent'

export default function CreareCont() {
    const { pathname } = useLocation();

    return pathname.startsWith('/create-account') ? (
        <>
            <Navbar />
            <CreateAccontContent />
        </>
    ) : null;
}
