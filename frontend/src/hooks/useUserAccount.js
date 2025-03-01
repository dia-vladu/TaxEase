import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useUserAccount = () => {
    const [userAccount, setUserAccount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserAccount = async () => {
            try {
                const loginResponse = await axios.get('http://localhost:8080/api/auth/login');
                const userId = loginResponse.data.user.userId;

                const userResponse = await axios.get(`http://localhost:8080/api/accounts/${userId}`);
                setUserAccount(userResponse.data);
            } catch (error) {
                setError(setError(error.message || 'Failed to load user account'));
                console.error(error);
            }
        };

        fetchUserAccount();
    }, []);

    return { userAccount, error };
};

export default useUserAccount;