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
  min-height: 100vh;
  background: linear-gradient(to bottom, #e8f6ff, #cfe9ff);
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  padding: 40px;
}
</style>
