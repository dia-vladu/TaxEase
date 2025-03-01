import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTaxData = (tax) => {
    const [taxData, setTaxData] = useState(null);

    useEffect(() => {
        if (!tax?.id) return;

        const fetchTaxData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/taxes/${tax.id}`);
                setTaxData(response.data);
                console.log('tax:', response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTaxData();
    }, [tax.id]);

    return taxData;
};

export default useFetchTaxData;