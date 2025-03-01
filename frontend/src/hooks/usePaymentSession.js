import axios from "axios";

const SESSION_URLS = {
    default: "http://localhost:8080/api/stripeSessions/create-checkout-session",
    unregistered: "http://localhost:8080/api/stripeSessions/create-checkout-session-plata-neautentificata"
};

const usePaymentSession = () => {
    const navigateToPayPortal = async (metadata, items, sessionType = "default") => {
        console.log("Navigate to pay portal...");
        const url = SESSION_URLS[sessionType] || SESSION_URLS.default;

        try {
            console.log("metadata:", metadata);

            const response = await axios.post(url,
                { items, metadata },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                const { url, session_id } = response.data;
                localStorage.setItem("session_id", session_id);
                localStorage.setItem("paymentStatus", "pending");
                window.location = url;
            } else {
                throw new Error("Failed to create payment session.");
            }
        } catch (error) {
            console.error("Error navigating to pay portal:", error);
        }
    };

    return { navigateToPayPortal };
};

export default usePaymentSession;