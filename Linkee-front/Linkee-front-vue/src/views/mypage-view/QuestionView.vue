<script setup>
import { ref, onMounted, watch } from 'vue';
import QuestionListItem from '@/components/mypage/question/QuestionListItem.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import api from '@/api/axios.js'; // api import

const questions = ref([]); // API에서 가져온 질문 목록
const currentPage = ref(1); // 현재 페이지 (1부터 시작)
const totalPages = ref(1); // 전체 페이지 수
const itemsPerPage = ref(10); // 페이지당 항목 수 (API 기본값 10)

// 나의 문제 목록을 API에서 가져오는 함수
const fetchMyQuestions = async () => {
  try {
    // 백엔드는 페이지를 0부터 시작하므로 currentPage - 1
    const response = await api.get(`/question/questions/my-questions`, {
      params: {
        page: currentPage.value - 1,
        size: itemsPerPage.value,
      },
    });
    const data = response.data;
    if (data && data.content) {
      questions.value = data.content;
      totalPages.value = data.totalPages;
    }
  } catch (error) {
    console.error('나의 문제 목록을 불러오는데 실패했습니다:', error);
    questions.value = [];
    totalPages.value = 1;
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchMyQuestions();
});

// currentPage 변경 감지 및 데이터 재로드
watch(currentPage, () => {
  fetchMyQuestions();
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 문제 조회</h2>
    <div class="list-content">
      <!-- 테이블 헤더 -->
      <div class="list-header">
        <span class="header-item no">NO</span>
        <span class="header-item category">카테고리</span>
        <span class="header-item title">제목</span>
        <span class="header-item date">등록일</span>
      </div>
      <!-- 질문 목록 -->
      <div class="items-wrapper">
        <QuestionListItem
          v-for="(question, index) in questions"
          :key="question.questionId"
          :question="question"
          :index="index"
        />
        <div v-if="questions.length === 0" class="empty-list">
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

.no { flex: 1; } /* NO 컬럼 너비 */
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
