<script setup>
defineProps({
  question: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="list-row">
    <span class="row-item category">{{ question.category }}</span>
    <span class="row-item title">{{ question.title }}</span>
    <span class="row-item date">{{ question.date }}</span>
  </div>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  padding: 18px 0; /* 좌우 여백 제거 */
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
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */
  overflow: hidden;
  text-overflow: ellipsis; /* 내용이 길면 ...으로 표시 */
}

/* --- 컬럼 너비 수정 --- */
.category {
  flex: 3;
  color: #666;
}

.title {
  flex: 4;
  text-align: left;
  padding: 0 15px; 
  min-width: 0; /* 중요: flex 아이템이 내용보다 작아질 수 있도록 허용 */
}

.date {
  flex: 3;
  color: #666;
}


/* 반응형 */
@media (max-width: 768px) {
  .list-row {
    font-size: 14px;
    padding: 15px 0; /* 좌우 여백 제거 */
  }
  .title {
    padding: 0 8px; 
  }
}
</style>
