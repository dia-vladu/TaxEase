import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginContent.scss';
import loginImg from '../../assets/images/user-profile-image.png';
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import InfoModal from '../enroll/users/components/ChangePasswordModal';

export default function LoginContent() {
    const [isForgotPasswordHovered, setIsForgotPasswordHovered] = useState(false);
    const [isCreateAccountHovered, setIsCreateAccountHovered] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleHover = (setState) => (isHovered) => setState(isHovered);

    const togglePasswordVisibility = () => setIsPasswordVisible((prevState) => !prevState);

    const loginUser = async (username, password) => {
        const response = await fetch('http://localhost:8080/api/accounts/credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    };

    const authenticateUser = async (accountId) => {
        const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: accountId }),
            credentials: 'include',
        });

        if (loginResponse.ok) {
            navigate('/dashboard');
            setErrorMessage('');
        } else {
            const errorData = await loginResponse.json();
            throw new Error(errorData.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = formRef.current.elements.username.value;
        const password = formRef.current.elements.password.value;

        if (username === null || username.trim() === '') {
            setErrorMessage('Please enter username');
        } else if (!password) {
            setErrorMessage('Please enter password');
        } else {
            try {
                const userAccount = await loginUser(username, password);
                if (userAccount) {
                    await authenticateUser(userAccount.accountId);
                }
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message || 'Login failed');
            }
        }
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

    const toggleModal = () => {

        setShowModal(!showModal);
    }

    return (
        <>
            <div className="wrapper">
                <div className="main-section-login">
                    <div className="main-section-login-content">
                        <div className="login-form">
                            <h1>Enter your TaxEase account</h1>
                            {errorMessage && (
                                <p className="error">
                                    <i>
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                    </i>
                                    {errorMessage}
                                </p>
                            )}
                            <form ref={formRef} className='form-login'>
                                <label className="loginLabel" htmlFor="username">
                                    <input
                                        className="loginTextField"
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label className="loginLabel" htmlFor="password">
                                    <input
                                        className="loginTextField"
                                        id="password"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        required
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className={`password-toggle-icon ${isPasswordVisible ? 'visible' : ''}`}
                                        onClick={togglePasswordVisibility}>
                                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </label>
                                <a href="login"
                                    className={`link forgot ${isForgotPasswordHovered ? 'hovered' : ''}`}
                                    onMouseEnter={() => handleHover(setIsForgotPasswordHovered)(true)}
                                    onMouseLeave={() => handleHover(setIsForgotPasswordHovered)(false)}
                                    onClick={toggleModal}
                                >
                                    <span>Forgot my password</span>
                                    {isForgotPasswordHovered && <FaArrowRight />}
                                </a>
                                <button onClick={handleSubmit}>Log in</button>
                                <a href="create-account"
                                    className={`link ${isCreateAccountHovered ? 'hovered' : ''
                                        }`}
                                    onMouseEnter={() => handleHover(setIsCreateAccountHovered)(true)}
                                    onMouseLeave={() => handleHover(setIsCreateAccountHovered)(false)}
                                >
                                    <span>Create Account</span>
                                    {isCreateAccountHovered && <FaArrowRight />}
                                </a>
                            </form>
                        </div>
                        <div className="login-form-image">
                            <img src={loginImg} alt="login-img" />
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (<InfoModal toggleModal={toggleModal} />)}
        </>
    );
}
