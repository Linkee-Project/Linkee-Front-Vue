<script setup>
import { RouterView } from 'vue-router';
import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<template>
<div>
  <AppHeader />
  <main>
    <RouterView />
  </main>
</div>
</template>

<style scoped></style>
