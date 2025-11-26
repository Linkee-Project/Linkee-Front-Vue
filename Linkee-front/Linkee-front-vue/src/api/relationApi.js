import axios from "@/api/axios.js";

export const fetchMyRelations = () => {
    return axios.get("/users/relations/my");
};