<script setup>
defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="list-row">
    <span class="row-item category">{{ bookmark.category }}</span>
    <span class="row-item title">{{ bookmark.title }}</span>
    <span class="row-item date">{{ bookmark.date }}</span>
  </div>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #333;
}

.list-row:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.row-item {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- 컬럼 너비 (카테고리, 제목, 등록일) --- */
.category {
  flex: 3;
  color: #666;
}

.title {
  flex: 4;
  text-align: left;
  padding: 0 15px;
  min-width: 0;
}

.date {
  flex: 3;
  color: #666;
}

/* 반응형 웹 */
@media (max-width: 768px) {
  .list-row {
    font-size: 14px;
    padding: 15px 5px;
  }
  .title {
    padding: 0 8px;
  }
}
</style>
