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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #D4EBF5, #acd2ff);
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  box-sizing: border-box;
}
</style>
