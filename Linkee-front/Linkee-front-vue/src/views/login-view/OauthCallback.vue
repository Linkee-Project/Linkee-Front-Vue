<template>
  <div class="loading">로그인 처리 중...</div>
</template>

<script setup>
import api from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

// 네이버 OAuth 성공 → /oauth/callback에 도착
// RefreshToken은 이미 HttpOnly 쿠키로 존재함
// → AccessToken 요청하러 /auth/refresh 호출
api.post("/auth/refresh")  //authController로 재발급
    .then(res => {
      const newAccessToken = res.data.data.accessToken;

      authStore.setAccessToken(newAccessToken);
      authStore.setUserFromToken(newAccessToken);

      router.replace("/home");
    })
    .catch(err => {
      console.error("소셜 로그인 토큰 갱신 실패", err);
      router.replace("/login");
    });
</script>
