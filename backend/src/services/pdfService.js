const axios = require("axios");
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');

const API_URLS = {
    GET_UTILIZATOR: "http://localhost:8080/api/users/code",
};

async function generatePDf(metadata) {
    const userData = await axios.get(`${API_URLS.GET_UTILIZATOR}/${metadata.identificationCode}`);
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
    doc.text(`${new Date(selectedPlata.data_efectuare).toLocaleDateString('en-GB')}`, 55, 60);
    doc.setFont('Arial', 'bold');
    doc.text('PAYEE:', 15, 70);
    doc.text('PAYER:', 145, 70);
    doc.setFont('Arial', 'normal');
    doc.setFontSize(10);
    doc.text(`Full Name: ${userData.surname} ${userData.name}`, 145, 75, { align: 'left' });
    doc.text(`CNP/NIF: ${userData.identificationCode}`, 145, 80, { align: 'left' });
    doc.text(`Address: ${userData.address}`, 145, 85, { align: 'left' });

    let startY = 100;
    doc.setDrawColor(119, 119, 119);
    doc.line(20, 90, 185, 90);

    doc.setFontSize(14);
    doc.setFont('Arial', 'bold');
    doc.text('Payment Elements:', 15, startY);

    doc.setFontSize(12);
    startY += 10;
    let total = 0;

    const elementePlatiteTableDataPromises = metadata.items.map(async (elementPlatit) => {
        const response_nume = await axios.get(`http://localhost:8080/api/taxes/${elementPlatit.id}`)
        const impozitName = response_nume.data.nume;
        const reponse_suma = await axios.get(`http://localhost:8080/api/knownTaxes/${elementPlatit.id}`)
        const impozitSuma = reponse_suma.data.suma;
        total += impozitSuma;
        return [impozitName, impozitSuma, total];
    });

    const elementePlatiteTableData = await Promise.all(elementePlatiteTableDataPromises);

    autoTable(doc, {
        startY,
        head: [['Name', 'Amount']],
        body: elementePlatiteTableData,
        theme: 'grid',
        margin: { top: 5 },
    });

    startY += elementePlatiteTableData.length * 10;
    const lastElementY = startY - 10;

    doc.setFont('Arial', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Amount:`, 145, lastElementY + 20);
    doc.text(`${total}`, 176, lastElementY + 20);

    // Save PDF and/or send
    const pdfData = doc.output('arraybuffer'); 
    await sendPDFToUser(userData.email, pdfData);
}

async function sendPDFToUser(email, pdfData) {
    await axios.post('/paymentProof', {
        userEmail: email, 
        generatedPdf: pdfData,
    });
}