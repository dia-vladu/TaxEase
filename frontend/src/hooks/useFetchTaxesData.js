import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTaxesData = (taxes) => {
    const [taxesData, setTaxesData] = useState([]);

    useEffect(() => {
        if (!taxes || taxes.length === 0) return;

        const fetchTaxesData = async () => {
            console.log("Fetching tax data...");
            try {
                const responses = await Promise.all(
                    taxes.map((tax) => axios.get(`http://localhost:8080/api/taxes/${tax.taxId}`))
                );

                const fetchedTaxesData = responses.map((response) => response.data);

                setTaxesData(fetchedTaxesData);
                console.log('taxes data:', fetchedTaxesData);
            } catch (error) {
                console.error('Error fetching taxes data:', error);
            }
        };

        fetchTaxesData();
    }, [taxes]);

    return taxesData;
};

export default useFetchTaxesData;