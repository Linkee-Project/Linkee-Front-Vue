<script setup>
import MyPageMenu from './MyPageMenu.vue'
import UserLevelBox from './UserLevelBox.vue'
</script>

<template>
  <aside class="left-sidebar">
    <MyPageMenu />
    <UserLevelBox />
  </aside>
</template>

<style scoped>
.left-sidebar {
  width: 100%; /* Default to 100% width for responsiveness */
  height: 100%;
  flex-shrink: 0; /* Prevent sidebar from shrinking */

  /* Flexbox 레이아웃 적용 */
  display: flex;
  flex-direction: column;
  gap: 30px; /* Add gap between children */
  /* Removed: justify-content: space-between; */
}

/* 반응형 */
@media (min-width: 769px) {
  .left-sidebar {
    width: 260px; /* Fixed width for larger screens */
  }
}
</style>
