<template>
  <div class="pagination">
    <button
        class="pagination-btn"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
    >
      ‹
    </button>

    <button
        v-for="p in totalPages"
        :key="p"
        class="pagination-page"
        :class="{ 'pagination-page--active': p === currentPage }"
        @click="changePage(p)"
    >
      {{ p }}
    </button>

    <button
        class="pagination-btn"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
});

const emit = defineEmits(['update:currentPage']);

const changePage = (newPage) => {
  if (newPage < 1 || newPage > props.totalPages) return;
  emit('update:currentPage', newPage);
};
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
}
.pagination-btn,
.pagination-page {
  border: none;
  outline: none;
  min-width: 24px;
  height: 24px;
  border-radius: 25%;
  font-size: 10px;
  cursor: pointer;
  background: rgba(250, 250, 255, 0.74);
  box-shadow: 0 6px 14px rgba(0, 148, 246, 0.2);
  color: #7688a3;
}
.pagination-btn:disabled {
  cursor: default;
  opacity: 0.4;
}
.pagination-page--active {
  background: #44bcf9;
  color: white;
  transform: translateY(-1px);
}
</style>
