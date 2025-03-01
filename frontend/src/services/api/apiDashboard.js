import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const apiDashboard = {
    getPayments: (identificationCode) =>
        apiClient.get(`/payments`, { params: { identificationCode } }),

    getInstitutions: (cuis) =>
        Promise.all(cuis.map((cui) => apiClient.get(`/enrolledInstitutions/cui/${cui}`)))
            .then((responses) => responses.map((res) => res.data)),

    getPayElements: (paymentIds) =>
        Promise.all(paymentIds.map((id) => apiClient.get(`/paymentElements/payment/${id}`)))
            .then((responses) => responses.map((res) => res.data)),

    getPaymentElements: (paymentId) => apiClient.get(`/paymentElements/payment/${paymentId}`),

    getKnownTaxes: (taxIds) =>
        Promise.all(taxIds.map((id) => apiClient.get(`/knownTaxes/${id}`)))
            .then((responses) => responses.map((res) => res.data)),

    getFeeById: (feeId) => apiClient.get(`/fees/${feeId}`),

    getTaxById: (taxId) => apiClient.get(`/taxes/${taxId}`),

    getTaxes: (taxIds) =>
        Promise.all(taxIds.map((id) => apiClient.get(`/taxes/${id}`)))
            .then((responses) => responses.map((res) => res.data)),

    getFees: (feeIds) =>
        Promise.all(feeIds.map((id) => apiClient.get(`/fees/${id}`)))
            .then((responses) => responses.map((res) => res.data)),

    getUserById: (userId) => apiClient.get(`/users/${userId}`),
    getUserByCode: (code) => apiClient.get(`/users/code/${code}`),
};

export default apiDashboard;