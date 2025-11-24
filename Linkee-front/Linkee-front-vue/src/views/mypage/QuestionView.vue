<script setup>
import { ref, computed } from 'vue';
import QuestionListItem from '@/components/layout/mypage/question/QuestionListItem.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';

// 더미 데이터 추가 (페이지네이션 확인용)
const allQuestions = ref([
  { id: 1, category: '네트워크', title: 'TCP 3-way handshake 흐름을 묻는 문제', date: '2025-01-02' },
  { id: 2, category: '자료구조', title: '연결 리스트 삽입 위치를 정하는 문제', date: '2025-01-02' },
  { id: 3, category: '운영체제', title: '라운드 로빈 스케줄링에 대한 설명 문제', date: '2025-01-01' },
  { id: 4, category: '데이터베이스', title: '트랜잭션 격리 수준을 비교하는 문제', date: '2024-12-30' },
  { id: 5, category: '네트워크', title: 'HTTP와 HTTPS의 차이점에 대한 질문', date: '2024-12-29' },
  { id: 6, category: '자료구조', title: '해시 테이블 충돌 해결 방안 문의', date: '2024-12-28' },
  { id: 7, category: '운영체제', title: '세마포어와 뮤텍스의 차이', date: '2024-12-27' },
]);

const currentPage = ref(1);
const itemsPerPage = ref(4);

const totalPages = computed(() => Math.ceil(allQuestions.value.length / itemsPerPage.value));

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allQuestions.value.slice(start, end);
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 문제 조회</h2>
    <div class="list-content">
      <!-- 테이블 헤더 -->
      <div class="list-header">
        <span class="header-item category">카테고리</span>
        <span class="header-item title">제목</span>
        <span class="header-item date">등록일</span>
      </div>
      <!-- 질문 목록 -->
      <div class="items-wrapper">
        <QuestionListItem
          v-for="question in paginatedQuestions"
          :key="question.id"
          :question="question"
        />
        <div v-if="paginatedQuestions.length === 0" class="empty-list">
          조회된 문제가 없습니다.
        </div>
      </div>
    </div>
    <!-- 페이지네이션 -->
    <div class="pagination-wrapper">
      <PaginationButton
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<style scoped>
/* 목록 컨테이너 (하얀 박스) */
.list-container {
  background: white;
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

/* 페이지 제목 */
.list-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #0094F6;
  margin-bottom: 20px;
}

/* 테이블 컨텐츠 */
.list-content {
  overflow-y: auto;
}

/* 테이블 관련 스타일 */
.list-header {
  display: flex;
  padding: 12px 0;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0094F6;
  font-size: 16px;
}

.header-item {
  text-align: center;
}

.category { flex: 3; }
.title { flex: 4; text-align: left; padding: 0 15px; min-width: 0; }
.date { flex: 3; }

.empty-list {
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 16px;
}

/* 페이지네이션 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

/* 반응형 */
@media (max-width: 768px) {
  .list-container {
    padding: 20px;
  }
  .list-header {
    font-size: 14px;
  }
  .title {
    padding: 0 8px;
  }
}
</style>
