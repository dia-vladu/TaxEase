const validateParams = {
    id: (param) => !param || isNaN(param), 
    cui: (param) => !param || !/^\d{2,10}$/.test(param),
    userId: (param) => !param || isNaN(param),  
    code: (param) => !param || !/^[A-Z]{1,2}$/.test(param),
    accountId: (param) => !param || isNaN(param),
};

const checkParam = (paramName) => {
    return (req, res, next) => {
        const paramValue = req.params[paramName];

        const validationRule = validateParams[paramName];
        
        if (validationRule && validationRule(paramValue)) {
            return res.status(400).json({ error: `Invalid ${paramName}` });
        }
        next();
    };
};

module.exports = { checkParam };