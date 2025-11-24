<script setup>
import { defineEmits } from 'vue'; // defineEmits import

const props = defineProps({
  inquiry: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['show-detail']); // 'show-detail' 이벤트 정의

const handleClick = () => {
  emit('show-detail', props.inquiry); // 클릭 시 inquiry 객체를 포함하여 이벤트 발생
};
</script>

<template>
  <div class="list-row" @click="handleClick"> <!-- 클릭 이벤트 추가 -->
    <span class="row-item subject">{{ inquiry.subject }}</span>
    <span class="row-item date">{{ inquiry.date }}</span>
    <span class="row-item status" :class="{ 'answered': inquiry.status === '답변 완료' }">{{ inquiry.status }}</span>
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

/* --- 컬럼 너비 수정 (제목, 등록일, 상태) --- */
/* .type { flex: 2; color: #666; } <- '문의 유형' 스타일 제거 */

.subject {
  flex: 6; /* 제목 비율 증가 */
  text-align: left;
  padding: 0 15px;
  min-width: 0;
}

.date {
  flex: 3; /* 등록일 비율 증가 */
  color: #666;
}

.status {
  flex: 3; /* 답변 상태 비율 증가 */
  color: #666;
  font-size: 16px; /* 명시적으로 폰트 크기 16px 지정 */
}

.status.answered {
  color: #0094F6; /* 답변 완료 시 파란색 */
  font-weight: 600;
}


/* 반응형 웹: 화면 너비가 768px 이하일 때 적용 */
@media (max-width: 768px) {
  .list-row {
    font-size: 14px;
    padding: 15px 5px;
  }
  .subject {
    padding: 0 8px;
  }
}
</style>

