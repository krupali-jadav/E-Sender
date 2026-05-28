import axios from "axios";
import { store } from "../redux/store"; // Adjust the path to your store

const axiosInstance = axios.create({
    baseURL: "/api/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        console.log(state, "State"); // Log the entire state to check its structure
        const token = state.user?.token;
        console.log(token); // Adjust based on your state structure

        if (import.meta.env.VITE_MODE === "production") {
            config.baseURL = "/api/";
        } else {
            config.baseURL = import.meta.env.VITE_BASE_URL;
        }

        const isMultipartData =
            config.headers["Content-Type"] === "multipart/form-data";

        config.headers = {
            "Content-Type": isMultipartData
                ? "multipart/form-data"
                : "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
        };

        return config;
    },
    (error) => {
        // Handle request error here
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle 401 error - token expired/unauthorized
                // Optionally, clear local storage and redirect to login
                localStorage.removeItem("persist:auth");
                window.location.href = "/";
            }
        }
        return Promise.reject(error); // Ensure the error is still returned
    }
);

export default axiosInstance;