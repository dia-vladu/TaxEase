import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchInstitutionsData = (taxesToBePaid) => {
    const [institutionsData, setInstitutionsData] = useState([]);

    useEffect(() => {
        if (!taxesToBePaid || taxesToBePaid.length === 0) return;

        const fetchInstitutiiData = async () => {
            const cuiList = taxesToBePaid.map((institution) => institution.institutionCUI);
            try {
                const responses = await Promise.all(
                    cuiList.map(cui => axios.get(`http://localhost:8080/api/enrolledInstitutions/cui/${cui}`))
                );
                
                // Deduplicate institutions based on 'cui'
                const uniqueInstitutions = responses.reduce((unique, response) => {
                    const existingIndex = unique.findIndex(item => item.cui === response.data.cui);
                    if (existingIndex === -1) {
                        unique.push(response.data);
                    }
                    return unique;
                }, []);
                
                setInstitutionsData(uniqueInstitutions);
                console.log('institutii:', uniqueInstitutions);
            } catch (error) {
                console.error('Error fetching institutii data:', error);
            }
        };

        fetchInstitutiiData();
    }, [taxesToBePaid]);

    return institutionsData;
};

export default useFetchInstitutionsData;