<template>
  <button class="admin-btn" :class="[sizeClass]" @click="$emit('click')">
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: { type: String, default: 'small' }, // 'small' | 'medium' | 'large'
  label: { type: String, default: '' },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'medium':
      return 'btn--medium';
    case 'large':
      return 'btn--large';
    default:
      return 'btn--small';
  }
});
</script>

<style scoped>
.admin-btn {
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  background-color: #f0f7ff;
  color: #333;
}

.admin-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 148, 246, 0.2);
  filter: brightness(1.05);
}

.btn--small {
  min-width: 60px;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 10px;
}

.btn--medium {
  min-width: 120px;
  padding: 8px 18px;
  font-size: 14px;
  border-radius: 12px;
}

.btn--large {
  min-width: 200px;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 15px;
}
</style>
