<template>
  <div class="admin-layout">
    <AdminNavbar />

    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminNavbar from "@/components/layout/admin/navbar/AdminNavbar.vue";
</script>



<style scoped>
.admin-layout {
  width: 100%;
  height: 100vh;              /* 뷰포트 전체 높이 */
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #e8f6ff, #cfe9ff);
  overflow: hidden;           /* 전체 페이지 스크롤 제거 */
}

.content-area {
  flex: 1;                    /* 헤더 제외 나머지 공간 모두 차지 */
  overflow-y: auto;           /* 여기만 스크롤 */
  padding: 40px;
  box-sizing: border-box;
}
</style>
