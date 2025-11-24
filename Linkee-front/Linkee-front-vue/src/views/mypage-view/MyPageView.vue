<script setup>
import LeftSidebar from '@/components/mypage/sidebar/LiftSidebar.vue';
</script>

<template>
  <div class="mypage-container">
    <LeftSidebar />
    <div class="mypage-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.mypage-container {
  display: flex;
  gap: 20px; /* 사이드바와 콘텐츠 사이 간격 축소 */
  padding: 40px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.mypage-content {
  flex-grow: 1;
  min-width: 0; /* flex 자식 요소가 줄어들 수 있도록 추가 */
}

/* 반응형 */
@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
}
</style>