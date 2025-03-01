import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DateCont.scss';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormContext from '../../../../context/FormContext';
import CodConfirmareModal from './CodConfirmareMailModal'

export default function DateCard() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const toggleModal = () => {
    setShowModal(!showModal);
  }
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      updateFormData(id, formattedValue);
    } else {
      updateFormData(id, value);
    }
    console.log(formData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const handleInputFocus = () => {
    setShowDatePicker(true);
  };

  function generarecodConfirmare() {
    const min = 1000;
    const max = 9999;

    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString();
  }

  // useEffect(() => {
  //   if (showModal) {
  //     const randomCode = generarecodConfirmare();
  //     setGeneratedCode(randomCode); 
  //     console.log('random:',randomCode, 'vs', 'generated',generatedCode);
  //   }
  // }, [showModal]);

  // useEffect(() => {
  //   if (showModal && generatedCode !== '') {
  //     (async () => {
  //       try {
  //         await fetch('http://localhost:8080/api/codConfirmare', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ userEmail: formData['email'], generatedCode }),
  //         });
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     })();
  //   }
  // }, [generatedCode, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    for (const key in formData) {
      if (formData[key].trim() === '') {
        newErrors[key] = 'Please fill in the field!';
      } else if (key === 'numarCard') {
        if (!/^[0-9\s]+$/.test(formData[key])) {
          newErrors[key] = 'Please enter numbers only!';
        } else if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(formData[key])) {
          newErrors[key] = 'Please respect the format (xxxx xxxx xxxx xxxx)!';
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const randomCode = generarecodConfirmare();
      console.log('randomcode:', randomCode);
      try {
        setGeneratedCode(randomCode);
        toggleModal();
        await fetch('http://localhost:8080/api/emails/confirmationCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail: formData['email'], generatedCode: randomCode }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <>
        <div className="main-section-header">
          <button onClick={() => navigate('/create-account')}>1</button>
          <button onClick={() => navigate('/create-account/account-details')}>2 </button>
          <button className="deactivated">
            3<span>Card Details</span>
          </button>
        </div>
        <div className="main-section-content">
          <form className="form-creare-cont" >
            <div className="part-dc">
              <div className="form-element">
                <label htmlFor="numarCard">
                  <span className="label-text">
                    Card Number *
                    {errors.cardNumber && (
                      <p className="error">
                        <i>
                          <FontAwesomeIcon icon={faExclamationCircle} />
                        </i>
                        {errors.cardNumber}
                      </p>
                    )}
                  </span>
                  <input
                    type="text"
                    placeholder="xxxx xxxx xxxx xxxx"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-element">
                <label htmlFor="dataExpirare">
                  <span className="label-text">
                    Expiry date *
                    {errors.dataExpirare && (
                      <p className="error">
                        <i>
                          <FontAwesomeIcon icon={faExclamationCircle} />
                        </i>
                        {errors.dataExpirare}
                      </p>
                    )}
                  </span>
                  <input
                    type={showDatePicker ? 'date' : 'text'}
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={() => setShowDatePicker(false)}
                    required
                  />
                </label>
              </div>
            </div>
          </form>
          <div className="bottom">
            <button onClick={() => navigate('/create-account/account-details')}>Back</button>
            <button type="submit" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </>
      {showModal && (<CodConfirmareModal toggleModal={toggleModal} generatedCode={generatedCode} formData={formData} />)}
    </>
  );
}