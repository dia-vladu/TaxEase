import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = (userAccount, triggerRefetch) => {
    const [userData, setUserData] = useState(() => {
        // Check if userData is in localStorage
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userAccount.accountId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUserData(data);
                    localStorage.setItem('userData', JSON.stringify(data));
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                setError('Failed to fetch user data');
                console.error(error);
            }
        };

        if (userAccount?.accountId) {
            fetchUserData();
        }
    }, [userAccount, triggerRefetch]);

    return { userData, error, setUserData };
};

export default useUserData;