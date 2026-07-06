import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const addMedia = async (file, type) => {
    try {
        const formData = new FormData();

        formData.append("type", type);
        formData.append("file", file);

        const response = await axiosInstance.post("/api/media/add", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getAllMedia = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/media/all", payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to fetch media");
    }
};

export const deleteMedia = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/media/delete", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to delete media");
    }
};

export const addMultipleMedia = async (files, type) => {
    try {
        const formData = new FormData();
        formData.append("type", type);

        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await axiosInstance.post("/api/media/add-multiple", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to upload media");
    }
};

export const deleteMultipleMedia = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/media/delete-multiple", payload);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to delete media");
    }
};