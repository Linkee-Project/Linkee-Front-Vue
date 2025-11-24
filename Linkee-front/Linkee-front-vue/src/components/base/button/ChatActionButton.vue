<script setup lang="ts">

</script>

<template>
  <button class="action-btn" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background: linear-gradient(180deg, #a3e0ff, #77b7dd);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 10px rgba(0, 148, 246, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 148, 246, 0.35);
}
</style>