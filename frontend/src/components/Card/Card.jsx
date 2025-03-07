import React, { useState, useEffect, useContext } from 'react';
import './Card.scss'
import visaImg from '../../assets/images/visa.png';
import UserContext from '../../context/UserContext';

export default function Card() {
    const { userAccount } = useContext(UserContext);
    const [cardData, setCardData] = useState(null);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/cards/${userAccount.accountId}`);
                console.log(response);
                if (response.ok) {
                    const cardData = await response.json();
                    setCardData(cardData);
                } else {
                    console.error('Failed to fetch card data');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCardData();
    }, [userAccount.accountId]);

    return (
        <div className='card-bancar'>
            <div className="card-image">
                <img src={visaImg} alt="visa-img" />
            </div>
            <div className="card-info">
                {cardData && (
                    <>
                        <p>{'*'.repeat(cardData.cardNumber.length - 4) + cardData.cardNumber.slice(-4)}</p>
                        <p>{new Date(cardData.expiryDate).toLocaleDateString('en-GB')}</p>
                    </>
                )}
            </div>
        </div>
    )
}
