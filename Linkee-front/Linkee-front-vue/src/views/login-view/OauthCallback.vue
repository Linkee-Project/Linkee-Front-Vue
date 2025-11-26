<script setup>
import api from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const query = new URLSearchParams(window.location.search);
const socialUserId = query.get("userId");

api.post("/auth/refresh")
    .then(async (res) => {

      const newAccessToken = res.data.data.accessToken;

      authStore.setAccessToken(newAccessToken);

      // 3) JWT decode → 기본 유저정보
      authStore.setUserFromToken(newAccessToken);

      // 4) DB 회원 정보(Me)
      await authStore.fetchUserMe();

      // 5) 소셜 userId 덮어쓰기
      if (socialUserId) {
        authStore.setUser({
          ...authStore.user,
          userId: Number(socialUserId),
          social: true
        });
      }

      // 6) 홈 이동
      router.replace("/home");
    })
    .catch(err => {
      console.error("소셜 로그인 토큰 갱신 실패", err);
      router.replace("/login");
    });
</script>
