import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import { Inrolare, CreateAccount } from '../features/enroll';
import Inregistrare from './Inregistrare';
import MapPage from './MapPage'
import Login from './Login';
import PaymentPage from './PaymentPage';
import Dashboard from './Dashboard';
import LegislationPage from './LegislationPage';

export default function Content() {

    return (
        <div className="content">
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/inregistrare" element={<Inregistrare />} />
                <Route path="/inrolare/*" element={<Inrolare />} />
                <Route path="/map-page" element={<MapPage/>}/>
                <Route path="/pay" element={<PaymentPage/>}/>
                <Route path="/create-account/*" element={<CreateAccount/>}/>
                <Route path="/dashboard/*" element={<Dashboard/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/legislation" element={<LegislationPage/>}/>
            </Routes>
        </div>
    )
}
