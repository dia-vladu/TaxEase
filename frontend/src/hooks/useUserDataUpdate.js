import { useState } from "react";
import useUserAccount from './useUserAccount'; 
import useUserData from './useUserData';

const useUserDataUpdate = (userId) => {
    const [triggerRefetch, setTriggerRefetch] = useState(false);
    const { userAccount, error: userAccountError } = useUserAccount();
    const { userData, setUserData, error: userDataError } = useUserData(userAccount, triggerRefetch);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If there's an issue with fetching userAccount or userData, return early
    if (userAccountError || userDataError) {
        setError(userAccountError || userDataError);
        return { updateUserData: null, loading, error };
    }

    const updateUserData = async (field, value, resetEditingState) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/update/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ field, value }),
            });
            if (response.ok) {
                const updatedUserData = await response.json();
                setUserData(updatedUserData);

                localStorage.setItem('userData', JSON.stringify(updatedUserData));

                resetEditingState();
                // Optionally trigger a refetch to sync with the server data
                setTriggerRefetch((prevState) => !prevState);
            } else {
                setError("Failed to update user data.");
            }
        } catch (err) {
            setError("Error updating user data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { updateUserData, loading, error };
};

export default useUserDataUpdate;