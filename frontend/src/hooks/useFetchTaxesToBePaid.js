import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTaxesToBePaid = (userAccount) => {
    const [taxesToBePaid, setTaxesToBePaid] = useState([]);

    useEffect(() => {
        if (!userAccount?.accountId) return; 

        const fetchImpoziteAnuntateData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/knownTaxes/users/${userAccount.accountId}?unpaid=true`);
                const taxes = response.data;
                setTaxesToBePaid(taxes);
                console.log('impozite de platit:', taxes);
            } catch (error) {
                console.error('Error fetching taxes:', error);
            }
        };

        fetchImpoziteAnuntateData();
    }, [userAccount.accountId]); // Re-fetch when accountId changes

    return taxesToBePaid;
};

export default useFetchTaxesToBePaid;