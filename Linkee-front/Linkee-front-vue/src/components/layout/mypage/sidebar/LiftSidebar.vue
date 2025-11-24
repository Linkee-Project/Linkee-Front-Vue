<template>
  <aside class="left-sidebar">
    <MyPageMenu />
    <UserLevelBox />
  </aside>
</template>

<script setup>
import MyPageMenu from './MyPageMenu.vue'
import UserLevelBox from './UserLevelBox.vue'
</script>

<style scoped>
.left-sidebar {
  width: 260px;

  /* Flexbox 레이아웃 적용 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 반응형 */
@media (min-width: 769px) {
  .left-sidebar {
    width: 260px;
  }
}
</style>
