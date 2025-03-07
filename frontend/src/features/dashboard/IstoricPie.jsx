import React, { useState, useEffect, useContext, useCallback } from 'react';
import Select from 'react-select';
// eslint-disable-next-line
import { Chart as ChartJS } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2';
import UserContext from '../../context/UserContext';
import apiDashboard from '../../services/api/apiDashboard';

export default function IstoricPie() {
    const { userData } = useContext(UserContext);
    const [dropdownOptionsYear, setDropdownOptionsYear] = useState([]);
    const [dropdownOptionsInstitution, setDropdownOptionsInstitution] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [data, setData] = useState({
        payments: [],
        institutions: [],
        paidItems: [], // keyed by paymentId
        knownTaxes: [],
        taxes: [],
    });
    const [formValues, setFormValues] = useState({
        institution: null,
        year: null
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
            const knownTaxIds = paymentElements.flat().map(elem => elem.knownTaxId);
            const knownTaxes = await apiDashboard.getKnownTaxes(knownTaxIds);
            const taxIds = knownTaxes.map((t) => t.taxId);
            const taxes = await apiDashboard.getTaxes(taxIds);

            console.log(typeof paymentId);
            console.log("paymentId:", paymentId);
            const years = [...new Set(
                data.payments
                    .filter(payment => paymentId.includes(payment.id))
                    .map(payment => new Date(payment.paymentDate).getFullYear())
            )];

            const dropdownOptions = years.map(year => ({
                value: year,
                label: year.toString()
            }));
            setDropdownOptionsYear(dropdownOptions);

            setData((prevData) => ({
                ...prevData,
                paidItems: paymentElements.flat(),
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

        const institutionCui = data.institutions.find((institution) => institution.name === formValues.institution)?.cui;

        const filteredPayments = data.payments.filter((payment) =>
            payment.institutionCUI === institutionCui &&
            new Date(payment.paymentDate).getFullYear() === formValues.year
        );

        console.log("data.paidItems:", data.paidItems);
        const elemPlatite = data.paidItems.filter((elem) =>
            filteredPayments.some((payment) => elem.paymentId === payment.id)
        )

        const dataForChart = elemPlatite.reduce(
            (acc, elem) => {
                const impozitAnuntat = data.knownTaxes.find(
                    (ia) => ia.id === elem.knownTaxId
                );
                const impozit = data.taxes.find((i) => i.id === impozitAnuntat.taxId);

                if (impozit && impozitAnuntat) {
                    acc.labels.push(impozit.name);
                    acc.values.push(impozitAnuntat.amount);
                }

                return acc;
            },
            { labels: [], values: [] }
        );

        console.log("data:", data);

        const chartData = {
            labels: dataForChart.labels,
            datasets: [
                {
                    label: `Tax Data for ${formValues.institution} - ${formValues.year}`,
                    data: dataForChart.values,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#8bc34a', '#9c27b0',
                        '#ff5722', '#009688', '#607d8b', '#795548', '#ff9800',
                    ],
                    hoverBackgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#8bc34a', '#9c27b0',
                        '#ff5722', '#009688', '#607d8b', '#795548', '#ff9800',
                    ],
                },
            ],
        };
        console.log("chartData:", chartData);

        setChartData(chartData);
    }, [formValues, data]);

    useEffect(() => {
        if (formValues.institution && formValues.year && data.knownTaxes.length > 0) {
            generateChartData();
        }
    }, [formValues, data.knownTaxes, generateChartData]);

    const handleSelectChange = async (selectedOption, fieldId) => {
        const value = selectedOption ? selectedOption.value : null;

        setFormValues((prevValues) => ({
            ...prevValues,
            [fieldId]: value,
            ...(fieldId === 'institution' ? { year: null } : {}),
        }));

        if (fieldId === 'institution') {
            const institutionCui = selectedOption.cui;
            const institutionPayments = data.payments.filter(payment => payment.institutionCUI === institutionCui);

            if (institutionPayments.length > 0) {
                const paymentId = institutionPayments.map(payment => payment.id);
                await loadPaymentDetails(paymentId);
            } else {
                setDropdownOptionsYear([]);
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
                    id="year"
                    placeholder="Select year"
                    value={formValues['year'] ? { value: formValues['year'], label: formValues['year'] } : null}
                    onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, 'year')
                    }
                    options={dropdownOptionsYear}
                    filterOption={({ label }, inputValue) =>
                        label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                    isSearchable
                    required
                />
            </div>
            {chartData && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "60%" }}>
                        <h3>Doughnut Chart</h3>
                        <Doughnut
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}