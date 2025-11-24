<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="user-item">
    <img class="avatar" :src="user.avatar" alt="avatar" />

    <div class="info">
      <p class="name">{{ user.name }}</p>
      <p class="status">{{ user.status }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.status {
  font-size: 12px;
  color: #8a9aa5;
  margin: 0;
}
</style>
