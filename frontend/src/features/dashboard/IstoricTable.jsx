import React, { useState, useEffect, useContext, useCallback } from 'react';
import './IstoricTable.scss';
import UserContext from '../../context/UserContext';
import apiDashboard from '../../services/api/apiDashboard';
import { generatePDF } from '../../utils/generatePDF';

export default function IstoricTable() {
    const { userAccount, userData } = useContext(UserContext);
    const [expandedRows, setExpandedRows] = useState({});
    const [data, setData] = useState({
        payments: [],
        institutions: [],
        paidItems: {} // keyed by paymentId
    });

    const loadDashboardData = useCallback(async () => {
        try {
            const payments = await apiDashboard.getPayments(userData.identificationCode);
            const uniqueCuis = [...new Set(payments.data.data.map((p) => p.institutionCUI))];
            const institutions = await apiDashboard.getInstitutions(uniqueCuis);

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

    // Helper to fetch payment details without UI side effects
    const loadPaymentDetails = async (paymentId) => {

        if (data.paidItems[paymentId]) {
            return data.paidItems[paymentId]; // Return the already loaded data for this payment
        }

        try {
            console.log("paymentId:", paymentId);
            const paymentElements = await apiDashboard.getPaymentElements(paymentId);
            console.log("paymentElements:", paymentElements);

            const knownTaxIds = paymentElements?.data.map((el) => el.knownTaxId).filter(Boolean) || [];
            const taxIds = paymentElements?.data.map((el) => el.taxId).filter(Boolean) || [];
            const feeIds = paymentElements?.data.map((el) => el.feeId).filter(Boolean) || [];

            const knownTaxes = knownTaxIds.length > 0 ? await apiDashboard.getKnownTaxes(knownTaxIds) : [];
            const taxIdsForKnownTaxes = knownTaxes.map((t) => t.taxId).filter(Boolean);

            const taxesToFetch = taxIdsForKnownTaxes.length > 0 ? taxIdsForKnownTaxes : taxIds;
            const taxes = taxesToFetch.length > 0 ? await apiDashboard.getTaxes(taxesToFetch) : [];

            const fees = feeIds.length > 0 ? await apiDashboard.getFees(feeIds) : [];

            const paymentData = {
                paymentElements: paymentElements.data || [],
                knownTaxes,
                taxes,
                fees,
            };

            setData((prevData) => ({
                ...prevData,
                paidItems: { ...prevData.paidItems, [paymentId]: paymentData },
            }));

            return paymentData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const toggleRow = async (paymentId) => {
        if (expandedRows[paymentId]) {
            setExpandedRows((prev) => ({ ...prev, [paymentId]: false }));
            return;
        }

        if (data.paidItems[paymentId]) {
            setExpandedRows((prev) => ({ ...prev, [paymentId]: true }));
            return;
        }

        try {
            const details = await loadPaymentDetails(paymentId);
            if (details) {
                setData((prev) => ({
                    ...prev,
                    paidItems: { ...prev.paidItems, [paymentId]: details },
                }));
                setExpandedRows((prev) => ({ ...prev, [paymentId]: true }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDFHandler = async (paymentId, institution) => {

        if (!data.paidItems[paymentId]) {
            const details = await loadPaymentDetails(paymentId);
            if (details) {
                setData((prev) => ({
                    ...prev,
                    paidItems: { ...prev.paidItems, [paymentId]: details },
                }));
            }
        }

        const currentData = {
            ...data,
            paidItems: { ...data.paidItems },
        };

        console.log("currentData:", currentData);
        await generatePDF(paymentId, institution, currentData, userAccount);
    };

    const getElementNameAndAmount = (elem, paymentId) => {
        console.log("data:", data);
        const knownTax = data.paidItems[paymentId].knownTaxes.find((t) => t.id === elem.knownTaxId);
        const knownTaxName = knownTax ? data.paidItems[paymentId].taxes.find((t) => t.id === knownTax.taxId).name : null;
        const tax = data.paidItems[paymentId].taxes.find((t) => t.id === elem.taxId);
        const fee = data.paidItems[paymentId].fees.find((f) => f.id === elem.feeId);

        if (knownTax) {
            return { name: knownTaxName, amount: `${knownTax.amount} lei` };
        }
        if (tax) {
            return { name: tax.name, amount: `${elem.amount} lei` };
        }
        if (fee) {
            return { name: fee.name, amount: `${fee.amount} lei` };
        }
        return { name: 'Unknown', amount: 'N/A' };
    };

    return (
        <div className='scrollable-table'>
            {data.institutions.map((institution) => {
                const paymentsForInstitution = data.payments.filter((p) => p.institutionCUI === institution.cui);
                return (
                    <div key={institution.cui}>
                        <p className='denumire-institutie'>{institution.name}</p>
                        <table>
                            <thead>
                                <tr className='parent-th'>
                                    <th>Reference</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Proof</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsForInstitution.map((payment) => (
                                    <React.Fragment key={payment.id}>
                                        <tr className='table-tr'>
                                            <td className='margine-stg'>{payment.id}</td>
                                            <td className='margine-stg'>{`${payment.amount} lei`}</td>
                                            <td className='margine-stg'>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                            <td className='middle'>
                                                <button className='descarca' onClick={() => generatePDFHandler(payment.id, institution)}>Download</button>
                                            </td>
                                            <td className='middle drop'>
                                                <button className='drop-btn' onClick={() => toggleRow(payment.id)}>
                                                    {expandedRows[payment.id] ? '▲' : '▼'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRows[payment.id] && (
                                            <tr className='drop-tr'>
                                                <td colSpan="5">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className='colspan-3'>Tax Name</th>
                                                                <th className='colspan-2'>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(data.paidItems[payment.id]?.paymentElements || []).map((elem) => {
                                                                const { name, amount } = getElementNameAndAmount(elem, payment.id);

                                                                return (
                                                                    <tr>
                                                                        <td>{name}</td>
                                                                        <td>{amount}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );

}