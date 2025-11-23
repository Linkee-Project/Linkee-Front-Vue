<script setup>
import { useRoute } from "vue-router";
import UserNavbar from "@/components/layout/user/navbar/UserNavbar.vue";
import UserSidebar from "@/components/layout/user/sidebar/UserSidebar.vue";

const route = useRoute();
</script>

<template>
  <div id="app">

    <!-- 로그인 페이지가 아니면 Navbar 표시 -->
    <UserNavbar v-if="route.name !== 'Login' && route.name !=='SignUp'" />

    <div class="main-layout">

      <div class="router-view-container">
        <router-view />
      </div>

      <!-- 로그인 페이지가 아니면 Sidebar 표시 -->
      <UserSidebar v-if="route.name !== 'Login' && route.name !=='SignUp'" />
    </div>

  </div>
</template>


<style scoped>

body{
  margin: 0 !important;
}

html, body, #app {
  height: 100%;
  margin: 0 !important;
  padding: 0;}


/* 전체 페이지 기본 스타일 */
#app {
  font-family: "Noto Sans KR", sans-serif;
  background: #D4EBF5;
  height: 100%;
}

/* 메인 컨텐츠 + 사이드바 배치 */
.main-layout {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  /* 사이드바를 오른쪽 끝으로 밀어냄 */
  justify-content: flex-start;

  /* router-view가 남는 공간 차지 */
  width: 100%;
}


.router-view-container {
  flex: 1; /* 메인 콘텐츠가 남은 공간 다 차지함 */
}
</style>