import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// ========== axios instance ==========
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true,
});

// ========== Request: 토큰 자동 포함 ==========
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();

        // refresh 요청에는 Authorization 헤더 제거
        // 기존 accessToken 만료된 상태에서 refresh 요청 시
        // Authorization 들어가면 Spring Security가 그대로 401로 막음
        if (config.url.includes("/auth/refresh")) {
            config.headers.Authorization = null;
            return config;
        }

        // 인증 생략 옵션
        if (config.skipAuth) return config;

        // ⬆일반 API일 때만 accessToken 자동 포함
        if (authStore.accessToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ========== Response: success=false 처리 + 401 처리 ==========
let isRefreshing = false;

api.interceptors.response.use(
    (response) => {
        // ApiResponse 검사
        if (response.data?.success === false) {
            const err = new Error(response.data.message || "요청 실패");
            err.response = response;
            throw err;
        }
        return response;
    },

    async (error) => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (!error.response) return Promise.reject(error);

        const status = error.response.status;

        // 401 이외는 그대로 반환
        if (status !== 401) return Promise.reject(error);

        // 로그인/refresh 관련 요청이면 무한루프 방지
        if (originalRequest.url.includes("/api/v1/auth/"))
            return Promise.reject(error);

        // 토큰 없으면 그대로 실패 (로그인 필요한 API)
        if (!authStore.accessToken) return Promise.reject(error);

        // 중복 refresh 방지
        if (originalRequest._retry) return Promise.reject(error);
        if (isRefreshing) return Promise.reject(error);

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // refreshToken 사용해 새 accessToken 발급
            await authStore.refreshTokens();
            isRefreshing = false;

            // 기존 실패한 요청 다시 보내기
            originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
            return api(originalRequest);
        } catch (err) {
            isRefreshing = false;
            authStore.clearAuthState();
            return Promise.reject(err);
        }
    }
);

export default api;
