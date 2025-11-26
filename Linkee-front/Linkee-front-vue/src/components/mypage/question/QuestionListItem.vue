<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // useRouter import

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  index: { // index prop 추가
    type: Number,
    required: true,
  },
});

const router = useRouter(); // useRouter 초기화

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const goToProblemDetail = () => {
  router.push(`/problem/${props.question.questionId}`);
};
</script>

<template>
  <div class="list-row" @click="goToProblemDetail">
    <span class="row-item no">{{ index + 1 }}</span> <!-- NO 항목 추가 -->
    <span class="row-item category">{{ question.categoryName }}</span>
    <span class="row-item title">{{ question.questionTitle }}</span>
    <span class="row-item date">{{ formatDate(question.createdAt) }}</span>
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
.no {
  flex: 1;
}
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
