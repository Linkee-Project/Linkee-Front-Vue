// src/api/authApi.js
import api from './axios';

// 로그인
export function loginApi(userEmail, password) {
    return api.post('/auth/login', {
        userEmail,
        password
    });
}
// 회원가입
export function signupApi(formData) {
    return api.post('/auth/signup', formData, { skipAuth: true });
}


// 토큰 재발급
export function refreshApi() {
    return api.post('/auth/refresh');
}

// 로그아웃
export function logoutApi() {
    return api.delete('/auth/logout');
}

// 인증번호 이메일 발송
export function sendEmailCode(email) {
    return api.post("/auth/email/send", { email } , { skipAuth: true } );
}

// 인증번호 검증
export function verifyEmailCode(email, code) {
    return api.post("/auth/email/verify", { email, code } , { skipAuth: true });
}

// 내 정보 조회
export function getUserMe() {
    return api.get('/users/user/me');
}
