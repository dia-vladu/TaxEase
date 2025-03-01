import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateTaxAdjustments } from '../utils/taxAdjustment';
import apiDashboard from '../services/api/apiDashboard';

export const generatePDF = async (paymentId, institution, data, userAccount) => {
    try {
        const payment = data.payments.find((p) => p.id === paymentId);
        const payer = await apiDashboard.getUserById(userAccount.accountId);
        let payee;
        try {
            const response = await apiDashboard.getUserByCode(payment.benefitedPersonId);
            payee = response.data;
            console.log("payee:", payee);
        } catch (error) {
            payee = { identificationCode: payment.benefitedPersonId };
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setFont('Arial', 'bold');
        doc.text('TaxEase', 15, 20);

        doc.setFontSize(14);
        doc.setFont('Arial', 'bold');
        doc.text('Payment Proof', 105, 40, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('Arial', 'bold');
        doc.text(`Payment date:`, 15, 60);
        doc.setFont('Arial', 'normal');
        doc.text(`${new Date(payment.paymentDate).toLocaleDateString('en-GB')}`, 55, 60);

        const addPersonInfo = (label, person, x) => {
            doc.setFont('Arial', 'bold');
            doc.text(label, x, 70);
            doc.setFont('Arial', 'normal');

            if (person.name && person.surname) {
                doc.text(`Name: ${person.surname} ${person.name}`, x, 75);
            }
            doc.text(`CNP/NIF: ${person.identificationCode}`, x, 80);
            if (person.address) {
                doc.text(`Address: ${person.address}`, x, 85);
            }
        };

        addPersonInfo('PAYEE:', payee || { identificationCode: payment.benefitedPersonId }, 15);
        addPersonInfo('PAYER:', payer.data, 145);

        // Process table data
        console.log("data:", data);
        const elements = data.paidItems[paymentId]?.paymentElements || [];
        console.log("elements:", elements);
        const tableData = await Promise.all(elements.map(async (item) => {
            const knownTax = item.knownTaxId ? data.paidItems[paymentId].knownTaxes.find((tax) => tax.id === item.knownTaxId) : null;
            const knownTaxName = knownTax ? data.paidItems[paymentId].taxes.find((t) => t.id === knownTax.taxId)?.name : null;

            console.log("knownTax:", knownTax);
            console.log("knownTaxName:", knownTaxName);

            const taxResponse = item.taxId ? await apiDashboard.getTaxById(item.taxId) : null;
            const tax = taxResponse?.data || null;
            console.log("tax:", tax);

            const feeResponse = item.feeId ? await apiDashboard.getFeeById(item.feeId) : null;
            const fee = feeResponse?.data || null;
            console.log("fee:", fee);

            console.log("knownTax:", knownTax);
            console.log("institution:", institution);

            let bonificatie = 0;
            let penalitate = 0;
            let total_sum = 0;

            if (knownTax) {
                const { bonification: taxBonification, penalties: taxPenalties } = calculateTaxAdjustments(
                    knownTax,
                    new Date(payment.paymentDate),
                    institution.bonificationPercentage,
                    institution.penaltyPercentage,
                    knownTaxName
                );

                bonificatie = taxBonification ? parseFloat(taxBonification.amount.toFixed(2)) : 0;
                penalitate = taxPenalties ? parseFloat(taxPenalties.amount.toFixed(2)) : 0;

                total_sum = knownTax?.amount - bonificatie + penalitate;
            } else if (fee) {
                total_sum = fee.amount;
            } else if (tax) {
                total_sum = item.amount;
            }

            return [
                knownTax ? knownTaxName : fee ? fee.name : tax ? tax.name : 'No Description',
                { content: `${knownTax ? knownTax.amount : fee ? fee.amount : tax ? item.amount : null} lei` },
                { content: `${bonificatie} lei`, styles: { textColor: 'green' } },
                { content: `${penalitate} lei`, styles: { textColor: 'red' } },
                { content: `${total_sum} lei` }
            ];
        }));

        autoTable(doc, {
            startY: 100,
            head: [['Name', 'Amount', 'Bonification', 'Penalty', 'Total']],
            body: tableData,
            theme: 'grid',
            margin: { top: 5 },
        });

        const lastElementY = doc.lastAutoTable.finalY;

        doc.setTextColor('#000');
        doc.setFont('Arial', 'bold');
        doc.setFontSize(12);
        doc.text(`Total Amount:`, 150, lastElementY + 20);
        doc.text(`${payment.amount} lei`, 180, lastElementY + 20);

        doc.save(`payment_${paymentId}.pdf`);
    } catch (error) {
        console.error(error);
    }
};