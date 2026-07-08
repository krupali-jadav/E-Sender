import { message } from "antd";
import axiosInstance from "../../../util/axiosInstance";

export const addCustomField = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/user/custom-field/add",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to add custom field");
    }
};

export const getAllCustomFields = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/user/custom-field/all",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to fetch custom fields");
    }
};
export const updateCustomField = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/user/custom-field/save",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to update custom field");
    }
};
export const deleteCustomField = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/user/custom-field/delete",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to delete custom field");
    }
};

export const deleteMultipleFields = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/custom-field/delete/multiple", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to delete contacts");
    }
};