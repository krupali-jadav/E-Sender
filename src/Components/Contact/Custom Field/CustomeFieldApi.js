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
    }
};