import React, { useEffect, useState, useContext } from 'react'
import { Buffer } from 'buffer';
import './DashboardUserInfo.scss';
import Card from '../../components/Card/Card';
import PozaProfilContext from '../../context/ProfilePictureContext';
import UserContext from '../../context/UserContext';

export default function DashboardUserInfo() {
    const { userData } = useContext(UserContext);
    const { userAccount } = useContext(UserContext);
    const [defaultImage, setDefaultImage] = useState('');
    const { pozaProfil } = useContext(PozaProfilContext);

    useEffect(() => {
        if (userAccount.profilePicture) {
            const byteArray = userAccount.profilePicture.data;
            const base64Data = Buffer.from(byteArray).toString('base64');
            const imageSrc = `data:image/png;base64,${base64Data}`;
            setDefaultImage(imageSrc);
        }
        if (pozaProfil) {
            const base64Data = Buffer.from(pozaProfil.data).toString('base64');
            const imageSrc = `data:image/png;base64,${base64Data}`;
            setDefaultImage(imageSrc);
        }
    }, [userAccount, pozaProfil]);


    return (
        <div className="user-info">
            <div className="poza-profil">
                {console.log('defaultImage=', defaultImage)}
                {console.log('pozaProfil=', pozaProfil)}
                <img src={defaultImage} alt="login-img" />
            </div>
            <div className="date-user">
                {userData && (
                    <>
                        <h1>{userData.surname} {userData.name}</h1>
                        <p>{userData.identificationCode}</p>
                    </>
                )}
            </div>
            <div className="card-principal">
                <Card />
            </div>
        </div>
    )
}
