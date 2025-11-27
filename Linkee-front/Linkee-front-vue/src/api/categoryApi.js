import api from "@/api/axios.js";

export const fetchCategories = async () => {
    const res = await api.get("question/categories");
    return res.data;
};