import React from 'react'
import { useLocation } from 'react-router-dom';
import PersonalDetails from '../PersonalDetails';
import AccountDetails from '../AccountDetails';
import CardDetails from '../CardDetails';
import './CreareContContent.scss'

export default function CreateAccountContent() {
    let {pathname} = useLocation();

    return (
        <div className='wrapper'>
            <div className="main-section">
                {pathname === '/create-account' && <PersonalDetails/>}
                {pathname === '/create-account/account-details' && <AccountDetails/>}
                {pathname === '/create-account/card-details' && <CardDetails/>}
            </div>
        </div>
    )
}
