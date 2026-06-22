import { message } from "antd";
import axiosInstance from "../../../util/axiosInstance";

export const addGroup = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/group/add", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Something went wrong");
    }
};

export const getAllGroups = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/group/all", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to fetch groups");
    }
};

export const saveGroup = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/group/save", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to update group");
    }
};

export const deleteGroup = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/group/delete", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to delete group");
    }
}

export const deleteMultipleGroups = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/user/group/delete/multiple", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to delete groups");
    }
};