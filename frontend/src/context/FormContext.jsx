import React, { createContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    tin: '', //Tax Identification Number
    surname: '',
    name: '',
    email: '',
    phoneNumber: '',
    county: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
    cardNumber: '',
    expiryDate: ''
  });

  const updateFormData = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;