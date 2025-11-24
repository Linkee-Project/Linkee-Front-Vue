<template>
  <div class="home-view">
    <HomeHero />
  </div>

</template>

<script setup>
import HomeHero from "@/views/home-view/HomeHero.vue";
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 필요하면 스크롤 */
}
</style>
