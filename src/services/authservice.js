import { Await } from "react-router"
import Login from "../pages/login/Login";
import api from "./api";


export const authservice = {
    signup: async (form) => {
        try {
            const response = await api.post('/signup', form);
            return response.data;
        } catch (error) {
            console.error("signup service error:", error);
            throw error; // ✅ important
        }
    },
};