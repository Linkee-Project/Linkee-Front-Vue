<script>
import UserNavbar from "@/components/layout/user/navbar/UserNavbar.vue";
import UserSidebar from "@/components/layout/user/sidebar/UserSidebar.vue";

export default {
  name: "App",
  components: {
    UserNavbar,
    UserSidebar,
  },
};


</script>

<template>
  <div id="app">
    <!-- 여기서 헤더를 전체 레이아웃에 추가! -->
    <UserNavbar v-if="!$route.meta.hideLayout"/>

    <div class="main-layout" v-if="!$route.meta.hideLayout">
      <div class="router-view-container">
        <router-view/>


      </div>
      <UserSidebar/>
    </div>

    <router-view v-else/>
  </div>
</template>

<style scoped>

body {
  margin: 0 !important;
}

html, body, #app {
  height: 100%;
  margin: 0 !important;
  padding: 0;
  overflow: hidden; /* 스크롤 완전 제거 */
}


/* 전체 페이지 기본 스타일 */
#app {
  font-family: "Noto Sans KR", sans-serif;
  background: #D4EBF5;
  height: 100%;
  overflow: hidden; /* 스크롤 완전 제거 */
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