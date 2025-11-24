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
    <UserNavbar />

    <div class="main-layout">
      <div class="router-view-container">
        <router-view />


<!--        <router-link to="/">-->
<!--          <button>메인 페이지로 이동</button>-->
<!--        </router-link>-->
<!--        <router-link to="/component-test">-->
<!--          <button>TEST 페이지 이동</button>-->
<!--        </router-link>-->
<!--        <router-link to="/chat/game/rooms">-->
<!--          <button>chat 페이지 이동</button>-->
<!--        </router-link>-->
      </div>
      <UserSidebar />
    </div>

  </div>
</template>

<style scoped>
/* body 스크롤 제거 */
body {
  margin: 0 !important;
}

#app {
  font-family: "Noto Sans KR", sans-serif;
  background: #D4EBF5;
  height: 100vh; /* 화면 전체 높이 사용 */
  display: flex; /* flex 컨테이너로 설정 */
  flex-direction: column; /* 세로 방향 정렬 */
  overflow: hidden; 
}

/* 메인 컨텐츠 + 사이드바 배치 */
.main-layout {
  flex: 1; /* 남는 세로 공간을 모두 차지 */
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 100%;
}

.router-view-container {
  flex: 1; /* UserSidebar를 제외한 남은 가로 공간을 모두 차지 */
  overflow-y: auto; /* 컨텐츠가 길어지면 여기서만 스크롤 */
  height: 100%;
}
</style>