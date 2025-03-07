import { useEffect } from "react";
import axios from "axios";

const PAYMENT_SUCCESS_URLS = {
    default: "http://localhost:8080/api/stripePayments/payment-success",
    unregistered: "http://localhost:8080/api/stripePayments/payment-success-plata-neautentificata"
}

const useCheckPaymentSession = (sessionType = "default") => {
    useEffect(() => {
        const session_id = localStorage.getItem("session_id");
        const paymentStatus = localStorage.getItem("paymentStatus");

        if (!session_id || !paymentStatus || paymentStatus === "success") {
            return;
        }

        const controller = new AbortController(); // Create an AbortController
        const url = PAYMENT_SUCCESS_URLS[sessionType] || PAYMENT_SUCCESS_URLS.default;

        const handlePaymentSuccess = async () => {
            try {
                console.log("Checking payment session:", session_id);

                const response = await axios.post(
                    url,
                    { session_id },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                        signal: controller.signal, // Attach signal to request
                    }
                );

                if (response.status === 200) {
                    console.log("Payment successful!");
                    localStorage.setItem("paymentStatus", "success");
                } else {
                    console.error("Payment failed!");
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request was cancelled:", error.message);
                } else {
                    console.error("Error processing payment:", error);
                }
            } finally {
                localStorage.removeItem("session_id");
                localStorage.removeItem("paymentStatus");
                console.log("localStorage cleared successfully");
            }
        };

        handlePaymentSuccess();

        return () => controller.abort(); // Cleanup function to cancel request
    }, [sessionType]);
};

export default useCheckPaymentSession;