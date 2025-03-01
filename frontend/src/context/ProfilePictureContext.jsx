import React from 'react';

const ProfilePictureContext = React.createContext();

export const ProfilePictureProvider = ({ children }) => {
    const [pozaProfil, setPozaProfil] = React.useState('');

    return (
        <ProfilePictureContext.Provider value={{ pozaProfil, setPozaProfil }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};

export default ProfilePictureContext;