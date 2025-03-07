import React, { useState, useEffect, useContext, useCallback } from 'react';
import './IstoricTable.scss';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
// eslint-disable-next-line
import { Chart as ChartJS } from 'chart.js/auto';
import UserContext from '../../context/UserContext';
import apiDashboard from '../../services/api/apiDashboard';

export default function IstoricLine() {
    const { userData } = useContext(UserContext);
    const [dropdownOptionsTax, setDropdownOptionsTax] = useState([]);
    const [dropdownOptionsInstitution, setDropdownOptionsInstitution] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [data, setData] = useState({
        payments: [],
        institutions: [],
        paidItems: {}, // keyed by paymentId
        knownTaxes: [],
        taxes: []
    });
    const [formValues, setFormValues] = useState({
        institution: null,
        tax: null
    });

    const loadDashboardData = useCallback(async () => {
        try {
            const payments = await apiDashboard.getPayments(userData.identificationCode);
            const uniqueCuis = [...new Set(payments.data.data.map((p) => p.institutionCUI))];
            const institutions = await apiDashboard.getInstitutions(uniqueCuis);

            const dropdownOptions = institutions.map(institution => ({
                value: institution.name,
                label: institution.name,
                cui: institution.cui
            }));
            setDropdownOptionsInstitution(dropdownOptions);

            setData((prev) => ({ ...prev, payments: payments.data.data, institutions }));
        } catch (error) {
            console.error(error);
        }
    }, [userData.identificationCode]);

    useEffect(() => {
        if (userData.identificationCode) {
            loadDashboardData();
        }
    }, [userData, loadDashboardData]);

    const loadPaymentDetails = async (paymentId) => {
        try {
            const paymentElements = await apiDashboard.getPayElements(paymentId);
            console.log("paymentElements:", paymentElements);
            const knownTaxIds = paymentElements.flat().map(elem => elem.knownTaxId).filter(Boolean) || [];
            console.log(knownTaxIds);
            const knownTaxes = knownTaxIds.length > 0 ? await apiDashboard.getKnownTaxes(knownTaxIds) : [];

            const taxIds = knownTaxes.map((t) => t.taxId).filter(Boolean);
            const taxes = await apiDashboard.getTaxes(taxIds);
            const uniqueTaxes = [...new Map(taxes.map((tax) => [tax.id, tax])).values()];

            const dropdownOptions = uniqueTaxes.map(tax => ({
                value: tax.name,
                label: tax.name,
                id: tax.id
            }));
            setDropdownOptionsTax(dropdownOptions);

            setData((prevData) => ({
                ...prevData,
                paidItems: { ...prevData.paidItems, [paymentId]: paymentElements[0] },
                knownTaxes: knownTaxes,
                taxes: taxes,
            }));

        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const generateChartData = useCallback(async () => {

        console.log("formValues:", formValues);
        console.log("data.knownTaxes:", data.knownTaxes);

        const taxId = data.taxes.find((tax) => tax.name === formValues.tax)?.id;
        const institutionCui = data.institutions.find((institution) => institution.name === formValues.institution)?.cui;

        console.log("data:", data);

        const filteredKnownTaxes = data.knownTaxes
            .filter((elem) => elem.taxId === taxId && elem.institutionCUI === institutionCui)
            .sort((a, b) => new Date(a.issuanceDate) - new Date(b.issuanceDate));

        console.log(filteredKnownTaxes);

        const chartLabels = filteredKnownTaxes.map((elem) => new Date(elem.issuanceDate).getFullYear());
        const chartValues = filteredKnownTaxes.map((elem) => elem.amount);

        console.log('chartLabels', chartLabels)
        console.log('chartValues', chartValues)

        const chartData = {
            labels: chartLabels,
            datasets: [
                {
                    label: `${formValues.tax}`,
                    data: chartValues,
                    backgroundColor: '#014335',
                    borderColor: 'black',
                    borderWidth: 1,
                }
            ]
        };
        console.log("chartData:", chartData);

        setChartData(chartData);
    }, [formValues, data]);

    useEffect(() => {
        if (formValues.institution && formValues.tax && data.knownTaxes.length > 0) {
            generateChartData();
        }
    }, [formValues, data.knownTaxes, generateChartData]);

    const handleSelectChange = async (selectedOption, fieldId) => {
        const value = selectedOption ? selectedOption.value : null;

        setFormValues((prevValues) => ({
            ...prevValues,
            [fieldId]: value,
            ...(fieldId === 'institution' ? { tax: null } : {}),
        }));

        if (fieldId === 'institution') {
            const institutionCui = selectedOption.cui;
            const institutionPayments = data.payments.filter(payment => payment.institutionCUI === institutionCui);

            if (institutionPayments.length > 0) {
                const paymentId = institutionPayments.map(payment => payment.id);
                console.log("payment ids:", paymentId);
                await loadPaymentDetails(paymentId);
            } else {
                setDropdownOptionsTax([]);
            }
        }
    };

    return (
        <div>
            <div>
                <Select
                    id="institution"
                    placeholder="Select Institution"
                    value={formValues['institution'] ? { value: formValues['institution'], label: formValues['institution'] } : null}
                    onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, 'institution')
                    }
                    options={dropdownOptionsInstitution}
                    filterOption={({ label }, inputValue) =>
                        label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                    isSearchable
                    required
                />
                <Select
                    id="tax"
                    placeholder="Select Tax"
                    value={formValues['tax'] ? { value: formValues['tax'], label: formValues['tax'] } : null}
                    onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, 'tax')
                    }
                    options={dropdownOptionsTax}
                    filterOption={({ label }, inputValue) =>
                        label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                    isSearchable
                    required
                />
            </div>
            {chartData && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "90%" }}>
                        <h3>Line Chart</h3>
                        <Line data={chartData} />
                    </div>
                </div>
            )}
        </div>
    );

}