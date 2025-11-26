<script setup>
import { ref, computed, onMounted, watch } from 'vue'; // watch 추가
import BookmarkListItem from '@/components/mypage/bookmark/BookmarkListItem.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import { getBookmarkedQuestions } from '@/api/problemApi.js'; // getBookmarkedQuestions 임포트

const bookmarkedProblems = ref([]); // 실제 북마크 데이터를 저장할 ref
const loading = ref(true); // 로딩 상태
const error = ref(null); // 에러 상태
const totalElements = ref(0); // API 응답에서 받을 총 요소 수

const currentPage = ref(1);
const itemsPerPage = ref(4); // 한 페이지에 보여줄 아이템 수

const totalPages = computed(() => Math.ceil(totalElements.value / itemsPerPage.value));

// 북마크된 문제들을 불러오는 함수
const fetchBookmarkedProblems = async (page, size) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getBookmarkedQuestions({ page, size });
    bookmarkedProblems.value = response.data.content;
    totalElements.value = response.data.totalElements; // 총 요소 수 업데이트
  } catch (err) {
    error.value = '북마크 목록을 불러오는 데 실패했습니다.';
    console.error('북마크 목록 로딩 실패:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookmarkedProblems(currentPage.value - 1, itemsPerPage.value);
});

// currentPage 변경 감지하여 데이터 다시 불러오기
watch(currentPage, (newPage) => {
  fetchBookmarkedProblems(newPage - 1, itemsPerPage.value);
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 북마크 조회</h2>

    <div class="list-content">
      <!-- 로딩 중 -->
      <div v-if="loading" class="empty-list">
        북마크 목록을 불러오는 중입니다...
      </div>
      <!-- 에러 발생 -->
      <div v-else-if="error" class="empty-list error-message">
        {{ error }}
      </div>
      <!-- 북마크 목록 -->
      <div v-else class="items-wrapper">
        <BookmarkListItem
            v-for="bookmark in bookmarkedProblems"
            :key="bookmark.bookmarkId"
            :bookmark="bookmark"
        />
        <div v-if="bookmarkedProblems.length === 0" class="empty-list">
          북마크 내역이 없습니다.
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
/* --- 목록 컨테이너 (하얀 박스) --- */
.list-container {
  background: white;
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

/* --- 페이지 제목 --- */
.list-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #0094F6;
  margin-bottom: 20px;
}

/* --- 테이블 컨텐츠 --- */
.list-content {
  overflow-y: auto;
}

/* --- 테이블 관련 스타일 --- */
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

/* --- 컬럼 너비 --- */
.category { display: none; } /* 카테고리 헤더 숨김 */
.title { flex: 1; text-align: left; padding: 0 15px; min-width: 0; } /* 제목 헤더가 전체 너비 차지 */
.date { display: none; } /* 등록일 헤더 숨김 */

.empty-list {
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 16px;
}

.empty-list.error-message {
  color: #d32f2f; /* 에러 메시지 색상 */
  font-weight: bold;
}

/* --- 페이지네이션 --- */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

/* --- 반응형 --- */
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
