import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './DashboardProfile.scss';
import ProfilePictureContext from '../../context/ProfilePictureContext';
import UserContext from '../../context/UserContext';
import useUserDataUpdate from "../../hooks/useUserDataUpdate";

export default function DashboardProfil() {
    const { setPozaProfil } = useContext(ProfilePictureContext);
    const { userData } = useContext(UserContext);
    const [editingField, setEditingField] = useState(null); // State to track the field being edited
    const [editedUserData, setEditedUserData] = useState(userData); // State to store edited user data
    const [selectedImage, setSelectedImage] = useState(null);
    const { updateUserData } = useUserDataUpdate(userData.id);


    useEffect(() => {
        setEditedUserData(userData);
        //console.log(editedUserData);
    }, [userData]);

    const handleEditClick = (fieldName) => setEditingField(fieldName);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingField === 'profilePicture' && selectedImage) {
            await handleProfilePictureUpdate();
        } else {
            handleUserDataUpdate();
        }
    };

    const handleProfilePictureUpdate = async () => {
        const formData = new FormData();
        formData.append('profilePicture', selectedImage);

        try {
            const { data } = await axios.put(
                `http://localhost:8080/api/accounts/update-profilePicture/${userData.id}`,
                formData
            );
            setPozaProfil(data.profilePicture);
            resetEditingState();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const handleUserDataUpdate = () => {
        console.log(`editedUserData[${editingField}]`, editedUserData[editingField]);
        updateUserData(editingField, editedUserData[editingField], resetEditingState);
    }

    const resetEditingState = () => {
        setEditingField(null);
        setSelectedImage(null);
    };

    const handleImageChange = (e) => setSelectedImage(e.target.files[0]);

    const renderField = (fieldName) => {
        const value = editedUserData[fieldName] || '';
        return editingField === fieldName ? (
            <input type="text" name={fieldName} value={value} onChange={handleInputChange} onKeyDown={handleEnterPress} />
        ) : (
            <span>{value}</span>
        );
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const renderActionButton = (fieldName) => {
        if (fieldName === editingField) {
            return fieldName === 'profilePicture' ?
                (
                    <>
                        {/* any image format is allowed (PNG, JPG, GIF, SVG, WebP, etc.) */}
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        <button className="active" onClick={handleSubmit}>Save</button>
                    </>
                )
                : (
                    <button className="active" onClick={handleSubmit}>Save</button>
                );
        }
        return <button onClick={() => handleEditClick(fieldName)}>Change</button>;
    }

    const fields = [
        { name: 'identificationCode', label: 'CNP / NIF', editable: false },
        { name: 'surname', label: 'Surname', editable: false },
        { name: 'name', label: 'Name', editable: false },
        { name: 'email', label: 'Email', editable: true },
        { name: 'phoneNumber', label: 'Phone', editable: true },
        { name: 'address', label: 'Address', editable: true },
        { name: 'profilePicture', label: 'Profile Photo', editable: true },
    ];

    return (
        <div className="afisare profil">
            <div className="date">
                {fields.map(({ editable, label, name }) => (
                    <div className="element-info" key={name}>
                        <label>{label}:</label>
                        {name !== 'profilePicture' && renderField(name)}
                        {editable && renderActionButton(name)}
                    </div>
                ))}
            </div>
        </div>
    );
}