import { createContext, useState, useEffect } from 'react';
import useUserData from '../hooks/useUserData';

const UserContext = createContext(null);

export const UserProvider = ({ children, userAccount: initialUserAccount }) => {
    const [userAccount, setUserAccount] = useState(initialUserAccount);
    const { userData, setUserData, error } = useUserData(userAccount);

    // Check if userData is in localStorage and update context accordingly
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);  // Set userData from localStorage if available
        }
    }, [setUserData]);

    // Sync userData with localStorage whenever it changes
    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));  // Persist userData in localStorage
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ userAccount, setUserAccount, userData, setUserData, error }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;