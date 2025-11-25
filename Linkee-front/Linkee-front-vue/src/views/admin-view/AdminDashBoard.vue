<template>
  <div class="admin-main-container">

    <!-- 중앙 로고 -->
    <div class="chat-panel-logo" @click="goUserMain">
      <img
          src="/src/assets/linkee_character.svg"
          alt="logo"
          class="logo-img"
      />
      <span class="hover-text">USER MAIN</span>
    </div>

    <!-- 원형 배치 버튼들 -->
    <div class="circle-menu">
      <BaseButton class="circle-item" @click="$router.push('/admin/users')">회원관리</BaseButton>
      <BaseButton class="circle-item" @click="$router.push('/admin/notices')">공지관리</BaseButton>
      <BaseButton class="circle-item" @click="$router.push('/admin/problems')">문제게시판</BaseButton>
      <BaseButton class="circle-item" @click="$router.push('/admin/templates')">알람템플릿</BaseButton>
      <BaseButton class="circle-item" @click="$router.push('/admin/inquiries')">문의관리</BaseButton>
      <BaseButton class="circle-item" @click="$router.push('/admin/reports')">신고관리</BaseButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/button/BaseButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const goUserMain = () => {
  router.push("/home"); // ← 원하면 다른 경로로 변경
};
</script>

<style scoped>
/* 전체 영역 (헤더 제외) */
.admin-main-container {
  position: absolute;
  top: 90px; /* 헤더 높이 */
  left: 0;
  width: 100%;
  height: calc(100vh - 90px); /* 헤더 제외 전체 영역 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 중앙 로고 */
.chat-panel-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  cursor: pointer;
  z-index: 10;

  background: linear-gradient(
      to bottom,
      #ffffff 0%,
      #f9fbff 45%,
      #eef5ff 100%
  );
  box-shadow: 0 3px 14px rgba(0, 60, 120, 0.08);
  border: 1px solid rgba(200, 220, 255, 0.5);

  transition: all 0.25s ease;
}


.logo-img {
  width: 42px;
  height: 42px;
  transition: opacity 0.25s ease;
}

.center-logo img {
  width: 100%;
  height: 100%;

}


.hover-text {
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  text-shadow:
      -1px -1px 0 rgba(183, 219, 255, 0.74),
      1px -1px 0 rgba(183, 219, 255, 0.74),
      -1px  1px 0 rgba(183, 219, 255, 0.74),
      1px  1px 0 rgba(183, 219, 255, 0.74);
}

/* 호버 시 로고 투명 → 텍스트 등장 */
.chat-panel-logo:hover{
  background: linear-gradient(
      to bottom,
      #e9e9ff 0%,
      #dbe8ff 45%,
      #d0e0ff 100%
  );
  box-shadow: 0 3px 14px rgba(0, 60, 120, 0.08);
}
.chat-panel-logo:hover .logo-img {
  opacity: 0;
}

.chat-panel-logo:hover .hover-text {
  opacity: 1;
}

/* 원형 메뉴 컨테이너 */
.circle-menu {
  position: relative;
  width: 550px;  /* 원 크기 조절 */
  height: 550px;
}
.circle-item:hover {
  transform: translate(-50%, -50%) translateY(-2px);
}
/* 버튼 공통 스타일 */
.circle-item {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 140px;
  height: 45px;
  border-radius: 25px;
  font-size: 15px;
}


/* 핵심: nth-child 로 원형 배치 */
/* 위쪽 */
.circle-item:nth-child(1) {
  top: calc(50% - 210px);
  left: 50%;
}

/* 우상단 */
.circle-item:nth-child(2) {
  top: calc(50% - 105px);
  left: calc(50% + 180px);
}

/* 우하단 */
.circle-item:nth-child(3) {
  top: calc(50% + 105px);
  left: calc(50% + 180px);
}

/* 아래쪽 */
.circle-item:nth-child(4) {
  top: calc(50% + 210px);
  left: 50%;
}

/* 좌하단 */
.circle-item:nth-child(5) {
  top: calc(50% + 105px);
  left: calc(50% - 180px);
}

/* 좌상단 */
.circle-item:nth-child(6) {
  top: calc(50% - 105px);
  left: calc(50% - 180px);
}
</style>
