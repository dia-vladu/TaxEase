import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useFetchCardData = (userAccount) => {
    const [cardId, setCardId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userAccount?.accountId) return; // Ensure accountId is available before fetching

        const fetchCardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/cards/${userAccount.accountId}`);
                setCardId(response.data.id);
            } catch (error) {
                setError(error.message || 'Failed to fetch card data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCardData();
    }, [userAccount.accountId]); // Runs when accountId changes

    return { cardId, error, loading };
};

export default useFetchCardData;