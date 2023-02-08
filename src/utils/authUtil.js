import employeeApi from "src/api/employeeApi";

const authUtil = {
    isAuthenticated: async () => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const res = await employeeApi.verifyToken();
            return res.user;
        } catch {
            localStorage.removeItem("token");
            return false;
        }
    },
};

export default authUtil;
