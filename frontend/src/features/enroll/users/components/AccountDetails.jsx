import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './DateCont.scss';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormContext from '../../../../context/FormContext';

export default function DateCont() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormContext);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateFormData(id, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Please enter a username!';
    }
    if (!formData.password) {
      newErrors.password = 'Please enter the password!';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password doesn't match!";
    }

    setErrors(newErrors);
    console.log(Object.keys(newErrors).length);
    if (Object.keys(newErrors).length === 0) {
      navigate('/create-account/card-details');
    }
  };

  return (
    <>
      <div className="main-section-header">
        <button onClick={() => navigate('/create-account')}>1</button>
        <button className="deactivated">
          2 <span>Account Details</span>
        </button>
        <button onClick={() => navigate('/create-account/card-details')}>3</button>
      </div>
      <div className="main-section-content">
        <form className="form-creare-cont" onSubmit={handleSubmit}>
          <div className="part-dc">
            <div className="form-element">
              <label htmlFor="username">
                <span className="label-text">
                  Username *
                  {errors.username && (
                    <p className="error">
                      <i>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                      </i>
                      {errors.username}
                    </p>
                  )}
                </span>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="form-element">
              <label htmlFor="password">
                <span className="label-text">
                  Password *
                  {errors.password && (
                    <p className="error">
                      <i>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                      </i>
                      {errors.password}
                    </p>
                  )}
                </span>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="form-element">
              <label htmlFor="confirmPassword">
                <span className="label-text">
                  Confirm Password *
                  {errors.confirmPassword && (
                    <p className="error">
                      <i>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                      </i>
                      {errors.confirmPassword}
                    </p>
                  )}
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
          </div>
        </form>
        <div className="bottom">
          <button onClick={() => navigate('/create-account')}>Back</button>
          <button type="submit" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}