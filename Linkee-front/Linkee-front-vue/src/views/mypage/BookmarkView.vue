<script setup>
import { ref, computed } from 'vue';
import BookmarkListItem from '@/components/layout/mypage/bookmark/BookmarkListItem.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';

// 더미 북마크 데이터 (페이지네이션 확인용)
const allBookmarks = ref([
  { id: 1, category: '네트워크', title: 'HTTP와 HTTPS의 차이점에 대한 북마크', date: '2023-11-25' },
  { id: 2, category: '자료구조', title: '알고리즘 복잡도 계산법 북마크', date: '2023-11-24' },
  { id: 3, category: '운영체제', title: '프로세스와 스레드의 차이 북마크', date: '2023-11-23' },
  { id: 4, category: '데이터베이스', title: 'SQL 조인 종류와 사용법 북마크', date: '2023-11-22' },
  { id: 5, category: '네트워크', title: 'TCP/IP 4계층 모델 북마크', date: '2023-11-21' },
  { id: 6, category: '자료구조', title: '트리 탐색 알고리즘 북마크', date: '2023-11-20' },
  { id: 7, category: '운영체제', title: '가상 메모리 관리 기법 북마크', date: '2023-11-19' },
]);

const currentPage = ref(1);
const itemsPerPage = ref(4);

const totalPages = computed(() => Math.ceil(allBookmarks.value.length / itemsPerPage.value));

const paginatedBookmarks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allBookmarks.value.slice(start, end);
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 북마크 조회</h2>

    <div class="list-content">
      <!-- 테이블 헤더 -->
      <div class="list-header">
        <span class="header-item category">카테고리</span>
        <span class="header-item title">제목</span>
        <span class="header-item date">등록일</span>
      </div>

      <!-- 북마크 목록 -->
      <div class="items-wrapper">
        <BookmarkListItem
            v-for="bookmark in paginatedBookmarks"
            :key="bookmark.id"
            :bookmark="bookmark"
        />
        <div v-if="paginatedBookmarks.length === 0" class="empty-list">
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
.category { flex: 3; }
.title { flex: 4; text-align: left; padding: 0 15px; min-width: 0; }
.date { flex: 3; }

.empty-list {
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 16px;
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
