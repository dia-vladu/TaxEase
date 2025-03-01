import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import axios from 'axios';
import './DashboardPlatiProgramate.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import UserContext from '../../context/UserContext';

axios.defaults.withCredentials = true;

export default function DashboardPlatiProgramate() {
    const { userAccount, setUserAccount } = useContext(UserContext);
    const [dropdownOptionsInstitutie, setDropdownOptionsInstitutie] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [impoziteAnuntateData, setImpoziteAnuntateData] = useState([]);
    const [institutiiData, setInstitutiiData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [daysOptions, setDaysOptions] = useState(null);
    const [programari, setProgramari] = useState([]);
    
    const [formValues, setFormValues] = useState({
        institutie: null,
        luna: null,
        zi: null,
    });

    useEffect(() => {
        console.log('ID:', userAccount.accountId)
        fetchImpoziteAnuntateData();
        fetchProgramari();
    }, []);

    const fetchImpoziteAnuntateData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/knownTaxes/${userAccount.accountId}`);
            const impoziteAnuntate = response.data;
            setImpoziteAnuntateData(impoziteAnuntate);
            console.log('impozite anuntate:', impoziteAnuntate);
            fetchInstitutiiData(impoziteAnuntate)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInstitutiiData = async (impozite) => {
        const cuiInstitutii = impozite.map((impozit) => impozit.cui);
        try {
            const response = await Promise.all(cuiInstitutii.map(cui => axios.get(`http://localhost:8080/api/getInstitutie/${cui}`)));

            const institutii = response.reduce((unique, response) => {
                const existingIndex = unique.findIndex(item => item.cui === response.data.cui);
                if (existingIndex === -1) {
                    unique.push(response.data);
                }
                return unique;
            }, []);

            const dropdownOptions = institutii.map(institutie => ({
                value: institutie.denumire,
                label: institutie.denumire,
                cui: institutie.cui
            }));

            setInstitutiiData(institutii);
            setDropdownOptionsInstitutie(dropdownOptions);
            console.log('institutii', institutii);
        } catch (error) {
            console.error(error);
        }
    };

    const handleButtonClick = () => {
        setIsFormVisible(!isFormVisible);
    };

    const monthsOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const getMonthLabel = (monthValue) => {
        console.log('monthValue:', monthValue)
        const selectedMonth = monthsOptions.find((month) => month.value === parseInt(monthValue));
        console.log('selectedMonth:', selectedMonth)
        return selectedMonth ? selectedMonth.label : '';
    };

    const handleSelectChange = (selectedOption, fieldId) => {
        console.log('selected:', selectedOption);
        const value = selectedOption.value;
        console.log('selectedOption.value:', value);

        if (fieldId === 'institutie') {
            setFormValues((prevValues) => ({
                ...prevValues,
                institutie: value,
                luna: null,
                zi: null,
            }));
        } else if (fieldId === 'luna') {
            setFormValues((prevValues) => ({
                ...prevValues,
                luna: value,
                zi: null,
            }));
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [fieldId]: value,
            }));
        }
    };

    useEffect(() => {
        const daysOptions = [];

        const getDaysInMonth = (month) => {
            const year = new Date().getFullYear();
            return new Date(year, month, 0).getDate();
        };

        console.log('selectedMonth:', formValues['luna'])
        const daysInMonth = formValues['luna'] ? getDaysInMonth(formValues['luna']) : 0;

        for (let i = 1; i <= daysInMonth; i++) {
            daysOptions.push({ value: i, label: i.toString() });
        }

        setFormValues((prevValues) => ({
            ...prevValues,
            zi: null,
        }));

        setDaysOptions(daysOptions);
    }, [formValues['luna']]);

    const isButtonDisabled = !(
        formValues['institutie'] &&
        formValues['luna'] &&
        formValues['zi']
    );

    const [showWarning, setShowWarning] = useState(false);

    const handleSubmit = async () => {
        try {
            if (
                !formValues['institutie'] ||
                !formValues['luna'] ||
                !formValues['zi']
            ) {
                setShowWarning(true);
                return;
            }

            setShowWarning(false);
            const { luna, zi, institutie } = formValues;
            console.log('formValues', formValues)

            const cardResponse = await axios.get(`http://localhost:8080/api/cards/${userAccount.accountId}`)
            console.log('card:', cardResponse.data)

            const selectedInstitutie = institutiiData.find((item) => item.denumire === institutie);
            const cui = selectedInstitutie.cui;

            const programareBody = {
                luna: luna,
                zi: zi,
                id_card: cardResponse.data.id,
                id_utilizator: userAccount.id_utilizator,
                cui: cui,
            };
            console.log('programareBody', programareBody)

            const responseProgramare = await axios.post('http://localhost:8080/api/add-programare', programareBody);
            console.log('responseProgramare', responseProgramare)

            const fetchImpoziteUrl = `http://localhost:8080/api/get-impozite-de-platit/${userAccount.id_utilizator}`;
            const impoziteResponse = await axios.get(fetchImpoziteUrl);
            console.log('impoziteResponse', impoziteResponse)
            const impoziteToUpdate = impoziteResponse.data.filter((impozit) => impozit.cui_institutie === cui);
            console.log('impoziteToUpdate', impoziteToUpdate)

            for (const impozit of impoziteToUpdate) {
                const updateUrl = `http://localhost:8080/api/update-impozit-de-platit-programeaza/${impozit.id}`;
                const updateData = { id_programare: responseProgramare.data.id };

                await axios.put(updateUrl, updateData);
            }

            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchProgramari = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/get-programari/${userAccount.id_utilizator}`)
            const programari = response.data;
            setProgramari(programari);
            console.log('programari:', programari);
        } catch (error) {
            console.log(error);
        }
    }

    console.log('daysOptions', daysOptions)
    return (
        <div>
            <div className='btn-part'>
                {isFormVisible ? (
                    <i><FontAwesomeIcon icon={faTimesCircle} onClick={handleButtonClick} className='inchide-btn' /></i>
                ) : (
                    <button className='btn-adauga' onClick={handleButtonClick}>Add</button>
                )}
            </div>
            <div>
                {isFormVisible ? (
                    <div className='visible-form'>
                        <div className='selects'>
                            <Select
                                id="institutie"
                                placeholder="Select Institution"
                                value={formValues['institutie'] ? { value: formValues['institutie'], label: formValues['institutie'] } : null}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, 'institutie')
                                }
                                options={dropdownOptionsInstitutie}
                                filterOption={({ label }, inputValue) =>
                                    label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                isSearchable
                                required
                            />
                            <Select
                                id="luna"
                                placeholder="Select month"
                                value={formValues['luna'] ? { value: formValues['luna'], label: monthsOptions.find((option) => option.value === formValues['luna']).label } : null}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, 'luna')
                                }
                                options={monthsOptions}
                                isSearchable
                                required
                            />
                            <Select
                                id="zi"
                                placeholder="Select day"
                                value={formValues['zi'] ? { value: formValues['zi'], label: formValues['zi'] } : null}
                                onChange={(selectedOption) =>
                                    handleSelectChange(selectedOption, 'zi')
                                }
                                options={daysOptions}
                                isSearchable
                                required
                            />
                        </div>
                        <div>
                            {/* {showWarning && (
                                <p className="warning">Vă rugăm completați toate câmpurile.</p>
                            )} */}
                            <button className='btn-salveaza' onClick={handleSubmit} disabled={isButtonDisabled}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div className='programari'>
                        <table>
                            <thead>
                                <tr className='parent-th'>
                                    <th>Month</th>
                                    <th>Day</th>
                                    <th>Institution Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {programari.map((programare) => (
                                    <tr className='table-tr' key={programare.id}>
                                        <td className='margine-stg'>{getMonthLabel(programare.luna_programata)}</td>
                                        <td className='margine-stg'>{programare.zi_programata}</td>
                                        <td className='margine-stg'>{institutiiData.find((institutie) => institutie.cui === programare.cui_institutie)?.denumire}</td>
                                        <td className='middle'>
                                            <button className='sterge'>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}