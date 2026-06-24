import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const createProject = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/projects",
            payload
        );

        if (response.data?.success) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error("Failed to create project");
    }
};

export const getProjects = async () => {
    try {
        const response = await axiosInstance.get("/api/projects");

        if (response.data?.success) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error("Failed to fetch projects");
    }
};
export const createTemplate = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/templates",
            payload
        );

        if (response.data?.success) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error("Failed to create template");
    }
};

export const getTemplatesByProject = async (projectId) => {
    try {
        const response = await axiosInstance.get(
            `/api/templates/project/${projectId}`
        );

        if (response.data?.success) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error("Failed to fetch templates");
    }
};
export const updateTemplate = async (templateId, payload) => {
    try {
        const response = await axiosInstance.put(
            `/api/templates/${templateId}`,
            payload
        );

        if (response.data?.success) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error("Failed to update template");
    }
};
    
export const getTemplateById = async (templateId) => {
    try {
        const response = await axiosInstance.get(
            `/api/templates/${templateId}`
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};