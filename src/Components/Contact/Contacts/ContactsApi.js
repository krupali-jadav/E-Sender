import { message } from "antd";
import axiosInstance from "../../../util/axiosInstance";

export const addContact = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/contact/add", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to add contact");
    }
};

export const getAllContacts = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/contact/all", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to fetch contacts");
    }
};

export const saveContact = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/contact/save", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to update contact");
    }
};

export const deleteContact = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/contact/delete", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to delete contact");
    }
};

export const changeContactBlockStatus = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/contact/change-block-status", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to update block status");
    }
};