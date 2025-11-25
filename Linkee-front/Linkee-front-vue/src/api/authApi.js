// src/api/authApi.js
import api from './axios';

// 로그인
export function loginApi(userEmail, password) {
    return api.post('/auth/login', {
        userEmail,
        password
    });
}

// 토큰 재발급
export function refreshApi() {
    return api.post('/auth/refresh');
}

// 로그아웃
export function logoutApi() {
    return api.delete('/auth/logout');
}
