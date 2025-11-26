<script setup>
import { useRouter } from 'vue-router'; // useRouter 임포트

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToProblemDetail = () => {
  router.push({ name: 'ProblemDetail', params: { id: props.bookmark.questionId } });
};
</script>

<template>
  <div class="list-row" @click="goToProblemDetail">
    <!-- category 필드는 DTO에 직접 없으므로, questionTitle을 메인으로 표시 -->
    <span class="row-item title">{{ bookmark.questionTitle }}</span>
    <!-- userNickname은 DTO에 있지만, 현재 UI에서는 표시되지 않으므로 생략 -->
    <!-- date 필드는 DTO에 없으므로 생략 -->
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
/* category와 date를 제거하고 title이 전체 너비를 사용하도록 */
.title {
  flex: 1; /* 전체 공간을 사용하도록 */
  text-align: left;
  padding: 0 15px;
  min-width: 0;
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
