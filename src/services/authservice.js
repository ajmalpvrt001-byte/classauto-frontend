import api from "./api";

export const authservice = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            console.error("login service error:", error);
            throw error;
        }
    },
    signup: async (form) => {
        try {
            const response = await api.post('/signup', form);
            return response.data;
        } catch (error) {
            console.error("signup service error:", error);
            throw error;
        }
    },
};