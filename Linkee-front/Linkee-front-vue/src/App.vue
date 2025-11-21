<script>
import UserNavbar from "@/components/layout/user/UserNavbar.vue";
import UserSidebar from "@/components/layout/user/UserSidebar.vue";

export default {
  name: "App",
  components: {
    UserNavbar,
    UserSidebar
  },
};
</script>

<template>
  <div id="app">
    <!-- 여기서 헤더를 전체 레이아웃에 추가! -->
    <UserNavbar />

    <div class="main-layout">
      <div class="router-view-container">
        <router-view />
      </div>

      <UserSidebar />
    </div>

  </div>
</template>

<style scoped>
/* 전체 페이지 기본 스타일 */
#app {
  font-family: "Noto Sans KR", sans-serif;
  background: #D4EBF5;
  min-height: 100vh;
}

/* 메인 컨텐츠 + 사이드바 배치 */
.main-layout {
  display: flex;
  flex-direction: row;

  /* 사이드바를 오른쪽 끝으로 밀어냄 */
  justify-content: flex-start;

  /* router-view가 남는 공간 차지 */
  width: 100%;
}

.router-view-container {
  flex: 1; /* 메인 콘텐츠가 남은 공간 다 차지함 */
}
</style>
