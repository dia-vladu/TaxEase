import { useState, useEffect } from 'react'
import React from 'react'
import Select from 'react-select';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './PaymentPageContent.scss';
import usePaymentSession from '../../hooks/usePaymentSession';
import useCheckOutPaymentSession from "../../hooks/useCheckOutPaymentSession";

axios.defaults.withCredentials = true;

export default function PlataPageContent() {
    const [dropdownOptionsJudet, setDropdownOptionsJudet] = useState([]);
    const [dropdownOptionsInstitutie, setDropdownOptionsInstitutie] = useState([]);
    const [dropdownOptionsTaxa, setDropdownOptionsTaxa] = useState([]);
    const { navigateToPayPortal } = usePaymentSession();

    const [formValues, setFormValues] = useState({
        county: '',
        institution: '',
        tax: '',
        amount: '',
        email: '',
        payerCode: '',
        payeeCode: '',
        surname: '',
        name: '',
    });

    const [formErrors, setFormErrors] = useState({
        county: '',
        institution: '',
        tax: '',
        amount: '',
        email: '',
        payerCode: '',
        payeeCode: '',
        surname: '',
        name: '',
    });

    const inputFields = [
        { id: 'county', label: 'County' },
        { id: 'institution', label: 'Institution' },
        { id: 'tax', label: 'Fee/Tax' },
        { id: 'amount', label: 'Amount' },
        { id: 'email', label: 'Email' },
        { id: 'payerCode', label: 'CNP / NIF payer *' },
        { id: 'payeeCode', label: 'CNP / NIF payee  *' },
        { id: 'surname', label: 'Surname' },
        { id: 'name', label: 'Name' }
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCleared, setIsCleared] = useState(false);
    const [userData, setUserData] = useState({
        surname: '',
        name: '',
        email: '',
        payerCode: '',
    });

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/login');
                const { isLoggedIn, user } = response.data;
                if (isLoggedIn) {
                    setIsLoggedIn(true);
                }
                if (user) {
                    const userResponse = await axios.get(`http://localhost:8080/api/users/${user.userId}`);
                    if (userResponse) {
                        const { surname, name, email, identificationCode } = userResponse.data;
                        setUserData((prevUserData) => ({
                            ...prevUserData,
                            surname,
                            name,
                            email,
                            payerCode: identificationCode,
                        }));
                        //console.log('UserData:', userData, 'utilizator:', userResponse.data);
                    }
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };

        checkLoginStatus();
        //console.log('UserData2:', userData)
    }, [isCleared]);

    useEffect(() => {
        console.log('userData3:', userData)
        if (isLoggedIn) {
            setFormValues((prevValues) => ({
                ...prevValues,
                email: userData.email || '',
                payerCode: userData.payerCode || '',
                surname: userData.surname || '',
                name: userData.name || '',
            }));
        }
    }, [isLoggedIn, userData]);

    useEffect(() => {
        fetchDropdownOptionsJudet();
    }, []);

    const fetchDropdownOptionsJudet = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/counties');
            console.log(typeof response, response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);

            const dropdownOptionsFormatted = data.map((option) => ({
                value: option.name,
                label: option.name,
                code: option.code,
            }));
            setDropdownOptionsJudet(dropdownOptionsFormatted);
        } catch (error) {
            console.error('Error fetching dropdown options:', error);
        }
    };

    const fetchDropdownOptionsInstitutie = async (selectedCounty) => {
        console.log(selectedCounty)
        console.log('selectedCounty.code', selectedCounty.code)
        try {
            const response = await fetch(
                `http://localhost:8080/api/enrolledInstitutions/code/${selectedCounty.code}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                console.warn('Unexpected response format:', data);
                setDropdownOptionsInstitutie([]);
                setFormValues((prevValues) => ({
                    ...prevValues,
                    institution: '',
                    tax: '',
                    amount: '',
                }));
                return;
            }
            const dropdownOptionsFormatted = data.map((option) => ({
                value: option.name,
                label: option.name,
                cui: option.cui,
            }));
            setDropdownOptionsInstitutie(dropdownOptionsFormatted);
            setFormValues((prevValues) => ({
                ...prevValues,
                institution: '',
                tax: '',
                amount: '',
            }));
        } catch (error) {
            console.error('Error fetching institution options:', error);
        }
    };

    const fetchDropdownOptionsTaxa = async (selectedInstitution) => {
        try {
            const response = await fetch(`http://localhost:8080/api/enrolledInstitutions/feesAndTaxes/${selectedInstitution.cui}`);
            console.log(typeof response, response);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('dataTaxe&IMpozite:', data);

            if (!Array.isArray(data)) {
                console.warn('Unexpected response format:', data);
                setDropdownOptionsTaxa([]);
                setFormValues((prevValues) => ({
                    ...prevValues,
                    tax: '',
                    amount: '',
                }));
                return;
            }
            const dropdownOptionsFormatted = data.map((option) => ({
                value: option.NAME,
                label: option.NAME,
                amount: option.AMOUNT,
                id: option.ID,
            }));
            setDropdownOptionsTaxa(dropdownOptionsFormatted);
            setFormValues((prevValues) => ({
                ...prevValues,
                tax: '',
                amount: '',
            }));
        } catch (error) {
            console.error('Error fetching dropdown options:', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
        setFormErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
    };

    const handleSelectChange = (selectedOption, fieldId) => {
        const { value } = selectedOption;

        setFormValues((prevValues) => {
            const updatedValues = { ...prevValues, [fieldId]: value };

            if (fieldId === "tax") {
                const selectedTax = dropdownOptionsTaxa.find(option => option.value === value);
                updatedValues.amount = selectedTax?.amount || "";
            }

            return updatedValues;
        });

        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldId]: "" }));

        const fieldActions = {
            county: () => {
                fetchDropdownOptionsInstitutie(selectedOption);
                setDropdownOptionsTaxa([]);
            },
            institution: () => fetchDropdownOptionsTaxa(selectedOption),
        };

        fieldActions[fieldId]?.();
    };

    const handleClearInputs = () => {
        const clearedValues = Object.keys(formValues).reduce((acc, key) => {
            acc[key] = "";
            return acc;
        }, {});

        setFormValues(clearedValues);
        setFormErrors(clearedValues);
        setIsCleared(true);
    };

    useEffect(() => {
        if (isCleared) {
            setIsCleared(false);
        }
    }, [isCleared]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        const { metadata, items } = preparePaymentData();

        navigateToPayPortal(metadata, items, "unregistered");
    };

    const validateForm = () => {
        const errors = {};
        inputFields.forEach((field) => {
            if (!formValues[field.id]) {
                errors[field.id] = "Please fill in this field!";
            }
        });
        return errors;
    };

    const preparePaymentData = () => {
        const selectedInstitution = dropdownOptionsInstitutie.find(option => option.value === formValues["institution"]);
        const cui = selectedInstitution?.cui || "";

        const selectedTax = dropdownOptionsTaxa.find(option => option.value === formValues["tax"]);
        const isFee = selectedTax?.amount !== "";

        const metadata = {
            payerCode: formValues.payerCode,
            payeeCode: formValues.payeeCode,
            amount: formValues.amount,
            institutionCui: cui,
            fee_id: isFee ? selectedTax.id : null,
            fee_name: isFee ? formValues["tax"] : null,
            tax_id: isFee ? null : selectedTax.id,
            tax_name: isFee ? null : formValues["tax"],
            surname: formValues.surname,
            name: formValues.name,
            email: formValues.email,
        };

        const items = { id: metadata.fee_id || metadata.tax_id };

        return { metadata, items };
    };

    useCheckOutPaymentSession("unregistered");

    return (
        <div className='wrapper-plata'>
            <div className="plateste-info">
                <h1>Pay without authentication</h1>
                <p>For this payment option, real-time consultation of payment obligations and transaction
                    history are not available, so you can only pay taxes and duties the amount of which you already know.<br />
                    If you know the full amount of taxes due, you will be able to pay in full, but without being able to view
                    the details and take advantage of other facilities.</p>
            </div>
            <form action="" className="plateste-form">
                <div className="part">
                    <div className="form-element">
                        <label htmlFor="county">
                            <span className="label-text">
                                County :
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
                                placeholder="Select county"
                                value={formValues['county'] ? { value: formValues['county'], label: formValues['county'] } : null}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, 'county')
                                }
                                options={dropdownOptionsJudet}
                                filterOption={({ label }, inputValue) =>
                                    label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                isSearchable
                                required
                            />
                        </label>
                    </div>
                    <div className="form-element">
                        <label htmlFor="institution">
                            <span className="label-text">
                                Institution :
                                {formErrors.institution && (
                                    <p className="error">
                                        <i>
                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                        </i>
                                        {formErrors.institution}
                                    </p>
                                )}
                            </span>
                            <Select
                                id="institution"
                                placeholder="Select institution"
                                value={formValues['institution'] ? { value: formValues['institution'], label: formValues['institution'] } : null}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, 'institution')
                                }
                                options={dropdownOptionsInstitutie}
                                filterOption={({ label }, inputValue) =>
                                    label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                isSearchable
                                required
                            />
                        </label>
                    </div>
                    <div className="form-element">
                        <label htmlFor="tax">
                            <span className="label-text">
                                Fee/Tax :
                                {formErrors.tax && (
                                    <p className="error">
                                        <i>
                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                        </i>
                                        {formErrors.tax}
                                    </p>
                                )}
                            </span>
                            <Select
                                id="tax"
                                placeholder="Select fee/tax"
                                value={formValues['tax'] ? { value: formValues['tax'], label: formValues['tax'] } : null}
                                onChange={(selectedOption) => {
                                    handleSelectChange(selectedOption, 'tax');

                                    // Update state properly instead of mutating the object
                                    setFormValues(prevValues => ({
                                        ...prevValues,
                                        amount: selectedOption?.amount || '' // Ensure empty fallback
                                    }));
                                }}
                                options={dropdownOptionsTaxa}
                                filterOption={({ label }, inputValue) =>
                                    label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                isSearchable
                                required
                            />
                        </label>
                    </div>
                    {inputFields.slice(3, 5).map((field) => (
                        <div className="form-element" key={field.id}>
                            <label htmlFor={field.id}>
                                <span className='label-text'>
                                    {field.label} :
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
                                    value={formValues[field.id]}
                                    onChange={handleInputChange}
                                    required
                                />
                                {console.log(formValues['amount'])}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="part">
                    {inputFields.slice(5).map((field) => (
                        <div className="form-element" key={field.id}>
                            <label htmlFor={field.id}>
                                <span className='label-text'>
                                    {field.label} :
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
                                    value={formValues[field.id]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </form>
            <div className="nif-info">
                <p>* In the case of foreign citizens, the tax identification number (NIF) must be filled in.</p>
            </div>
            <div className="plateste-buttons">
                <button type="submit" className="plateste" onClick={handleSubmit}>Pay</button>
                <button className="renunta" onClick={handleClearInputs}>Cancel</button>
            </div>
        </div>
    )
}
