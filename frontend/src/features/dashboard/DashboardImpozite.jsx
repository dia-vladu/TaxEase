import React, { useState, useContext } from 'react';
import axios from 'axios';
import './DashboardImpozite.scss';
import UserContext from '../../context/UserContext';
import useFetchCardData from '../../hooks/useFetchCardData';
import useFetchTaxesData from '../../hooks/useFetchTaxesData';
import useFetchInstitutionsData from '../../hooks/useFetchInstitutionsData';
import useFetchTaxesToBePaid from '../../hooks/useFetchTaxesToBePaid';
import useEnhancedTaxes from '../../hooks/useEnhancedTaxes';
import usePaymentSession from '../../hooks/usePaymentSession';
import useCheckOutPaymentSession from "../../hooks/useCheckOutPaymentSession";

axios.defaults.withCredentials = true;

export default function DashboardImpozite() {
    const { userAccount } = useContext(UserContext);
    const { userData } = useContext(UserContext);
    const identificationCode = userData?.identificationCode;
    const { cardId } = useFetchCardData(userAccount);

    const [expandedRows, setExpandedRows] = useState([]);
    const taxesToBePaid = useFetchTaxesToBePaid(userAccount);
    const taxesData = useFetchTaxesData(taxesToBePaid);
    const institutionsData = useFetchInstitutionsData(taxesToBePaid);
    const { navigateToPayPortal } = usePaymentSession();

    const toggleRow = (institutieId) => {
        setExpandedRows((prevRows) => {
            if (prevRows.includes(institutieId)) {
                return prevRows.filter((rowId) => rowId !== institutieId);
            } else {
                return [...prevRows, institutieId];
            }
        });
    };

    const getImpozitName = (taxId) => {
        const tax = taxesData.find((tax) => tax.id === taxId);
        console.log("tax:", tax);
        return tax ? tax.name : '';
    };

    const enhancedTaxes = useEnhancedTaxes(taxesToBePaid, taxesData, getImpozitName);
    console.log("enhancedTaxes:", enhancedTaxes);

    const getTotalSuma = (cui) => {
        console.log('taxesToBePaid', taxesToBePaid);
        const subtotal = taxesToBePaid
            .filter((tax) => tax.institutionCUI === cui)
            .reduce((total, tax) => total + parseFloat(tax.amount), 0);
        return subtotal;
    };

    console.log('identificationCode:', identificationCode)
    console.log('cardId:', cardId)

    const handleClick = (institution) => {
        const filteredTaxes = enhancedTaxes.filter((tax) => tax.institutionCUI === institution.cui);
        console.log("filteredTaxes:", filteredTaxes);

        const metadata = {
            identificationCode: identificationCode,
            institutionCui: institution.cui,
            cardId: cardId,
            items: JSON.stringify(enhancedTaxes),
        };

        navigateToPayPortal(metadata, filteredTaxes);
    };

    useCheckOutPaymentSession();

    return (
        <div className='scrollable'>
            {taxesToBePaid && taxesToBePaid.length === 0 ? (
                <div className="empty-message">
                    You have no payment duties.
                </div>
            ) :
                (
                    <table>
                        <thead>
                        </thead>
                        <tbody>
                            {institutionsData.map((institution) => {
                                const isExpanded = expandedRows.includes(institution.cui);

                                return (
                                    <React.Fragment key={institution.cui}>
                                        <tr className='parent-tr'>
                                            <td className='institutie'>{institution.name}</td>
                                            <td className='drop-button'>
                                                <button onClick={() => toggleRow(institution.cui)}>
                                                    {isExpanded ? '▲' : '▼'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <React.Fragment>
                                                <tr className='dropped-tr'>
                                                    <td colSpan="2">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Amount</th>
                                                                    <th>Date of issue</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.values(taxesToBePaid)
                                                                    .filter((tax) => tax.institutionCUI === institution.cui)
                                                                    .map((tax) => {
                                                                        return (
                                                                            <tr key={tax.id}>
                                                                                <td className='first-td'>{getImpozitName(tax.taxId)}</td>
                                                                                <td className='second-td'>{tax.amount}</td>
                                                                                <td className='third-td'>{new Date(tax.issuanceDate).toLocaleDateString('en-GB')}</td>
                                                                            </tr>)
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr className='dropped-tr'>
                                                    <td colSpan="2">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='first-td total'>Total Amount:</td>
                                                                    <td className='second-td'>{getTotalSuma(institution.cui)}</td>
                                                                    <td className='third-td plateste'>
                                                                        <button onClick={() => handleClick(institution)}>
                                                                            Pay
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
        </div>
    );
}