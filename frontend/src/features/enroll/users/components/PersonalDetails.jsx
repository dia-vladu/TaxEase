import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import './DatePersonale.scss';
import { useNavigate } from 'react-router-dom';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormContext from '../../../../context/FormContext';

export default function DatePersonale() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormContext);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({
    tin: '',
    surname: '',
    name: '',
    email: '',
    phoneNumber: '',
    county: '',
    address: '',
  });

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/counties');
      console.log(typeof response, response);
      const data = await response.json();
      console.log(data);
      const dropdownOptionsFormatted = data.map((option) => ({
        value: option.name,
        label: option.name,
      }));
      setDropdownOptions(dropdownOptionsFormatted);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phoneNumber') {
      let formattedValue = value.replace(/\s/g, '');
      if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4) + ' ' + formattedValue.slice(4);
      }
      if (formattedValue.length > 8) {
        formattedValue = formattedValue.slice(0, 8) + ' ' + formattedValue.slice(8);
      }
      formattedValue = formattedValue.trim();
      updateFormData(id, formattedValue);
    } else {
      updateFormData(id, value);
    }
    console.log(formData);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const handleSelectChange = (selectedOption) => {
    const { id, value } = selectedOption;
    updateFormData('county', value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const inputFields = [
    { id: 'tin', label: 'CNP / NIF' },
    { id: 'surname', label: 'Surname' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email Address', placeholder: 'your@real-email.com' },
    { id: 'county', label: 'County' },
    { id: 'phoneNumber', label: 'Phone Number', placeholder: '0xxx xxx xxx' },
    { id: 'address', label: 'Home Address' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    inputFields.forEach((field) => {
      if (formData[field.id].trim() === '') {
        errors[field.id] = 'Please fill in this field!';
      } else if (field.id === 'phoneNumber') {
        if (!/^[0-9\s]+$/.test(formData[field.id])) {
          errors[field.id] = 'Please enter numbers only!';
        } else if (!/^0\d{3} \d{3} \d{3}$/.test(formData[field.id])) {
          errors[field.id] = 'Please respect the format (0xxx xxx xxx xxx)!';
        }
      } else if (field.id === 'tin' && !/^\d+$/.test(formData[field.id])) {
        errors[field.id] = 'Please enter numbers only!';
      } else if (field.id === 'tin' && formData[field.id].length !== 13) {
        errors[field.id] = `Please enter 13 digit!`;
      }
    });

    setFormErrors(errors);
    console.log(Object.keys(errors).length, errors);
    if (Object.keys(errors).length === 0) {
      navigate('/create-account/account-details');
    }
  };

  return (
    <>
      <div className="main-section-header">
        <button className="deactivated">
          1 <span>Personal Details</span>
        </button>
        <button onClick={() => navigate('/create-account/account-details')}>2</button>
        <button onClick={() => navigate('/create-account/card-details')}>3</button>
      </div>
      <div className="main-section-content">
        <form className="form-creare-cont" onSubmit={handleSubmit}>
          <div className="part">
            {inputFields.slice(0, 4).map((field) => (
              <div className="form-element" key={field.id}>
                <label htmlFor={field.id}>
                  <span className='label-text'>
                    {field.label} *
                    {formErrors[field.id] && (
                      <p className="error">
                        <i>
                          <FontAwesomeIcon icon={faExclamationCircle} />
                        </i>
                        {formErrors[field.id]}
                      </p>
                    )}
                  </span>
                  <input
                    type="text"
                    id={field.id}
                    {...field.placeholder && { placeholder: field.placeholder }}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="part">
            <div className="form-element">
              <label htmlFor="county">
                <span className="label-text">
                  County *
                  {formErrors.county && (
                    <p className="error">
                      <i>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                      </i>
                      {formErrors.county}
                    </p>
                  )}
                </span>
                <Select
                  id="county"
                  placeholder="Select County"
                  value={formData['county'] ? { value: formData['county'], label: formData['county'] } : null} onChange={handleSelectChange}
                  options={dropdownOptions}
                  filterOption={({ label }, inputValue) =>
                    label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                  isSearchable
                  required
                />
              </label>
            </div>
            {inputFields.slice(5).map((field) => (
              <div className="form-element" key={field.id}>
                <label htmlFor={field.id}>
                  <span className='label-text'>
                    {field.label} *
                    {formErrors[field.id] && (
                      <p className="error">
                        <i>
                          <FontAwesomeIcon icon={faExclamationCircle} />
                        </i>
                        {formErrors[field.id]}
                      </p>
                    )}
                  </span>
                  <input
                    type="text"
                    id={field.id}
                    {...field.placeholder && { placeholder: field.placeholder }}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            ))}
          </div>
        </form>
        <div className="bottom">
          <button type="submit" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}