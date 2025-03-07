import { useMemo } from "react";

const useEnhancedTaxes = (taxesToBePaid, taxesData, getImpozitName) => {
    
    return useMemo(() => {

        console.log("Calculating tax names...");

        return taxesToBePaid.map((tax) => ({
            ...tax,
            taxName: getImpozitName(tax.taxId),
        }));
    }, [taxesToBePaid, getImpozitName]);  // Runs ONLY when taxesToBePaid changes
};

export default useEnhancedTaxes;