<script setup>
import { useRoute } from "vue-router";
import UserNavbar from "@/components/layout/user/navbar/UserNavbar.vue";
import UserSidebar from "@/components/layout/user/sidebar/UserSidebar.vue";
import BaseToast from "@/components/base/toast/BaseToast.vue";
import { provide, ref } from "vue";

const route = useRoute();

// Toast ref
const toastRef = ref(null);

// 어디서든 사용 가능하도록 provide
provide("toast", {
  show: (msg) => toastRef.value.showToast(msg)
});
</script>

<template>
  <div id="app">

    <!-- Navbar -->
    <UserNavbar
        v-if="!route.path.startsWith('/admin')
           && !route.meta.hideLayout
           && route.name !== 'Login'
           && route.name !== 'SignUp'"
    />

    <div class="main-layout"
         v-if="!route.meta.hideLayout && !route.path.startsWith('/admin')">

      <div
          :class="{ 'router-view-container': !route.path.startsWith('/admin') }"
      >
        <router-view/>
      </div>


      <!-- Sidebar -->
      <UserSidebar
          v-if="!route.path.startsWith('/admin')
             && !route.meta.hideLayout
             && route.name !== 'Login'
             && route.name !== 'SignUp'
             && route.name !== 'Notice'
             && route.name !== 'NoticeDetail'
             && !route.meta.hideSidebar"
      />
    </div>

    <div v-else class="full-screen-page">
      <router-view/>
    </div>

    <!-- 전역 토스트 컴포넌트 위치 -->
    <BaseToast ref="toastRef" />
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
}


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

  /* 사이드바를 오른쪽 끝으로 밀어냄 */
  justify-content: flex-start;

  /* router-view가 남는 공간 차지 */
  width: 100%;
}


.router-view-container {
  flex: 1; /* 메인 콘텐츠가 남은 공간 다 차지함 */
  height: calc(100vh - 90px);
  overflow: hidden;
}

.full-screen-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>