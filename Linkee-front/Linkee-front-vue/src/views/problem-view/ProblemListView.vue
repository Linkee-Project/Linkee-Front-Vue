<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 제목 -->
      <header class="problem-header">
        <button class="back-btn">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제게시판</h1>
      </header>

      <!-- 카테고리 탭 -->
      <nav class="category-tabs">
        <button class="tab is-active">전체</button>
        <button class="tab">네트워크</button>
        <button class="tab">데이터베이스</button>
        <button class="tab">자료구조</button>
        <button class="tab">운영체제</button>
      </nav>

      <!-- 검색 -->
      <div class="search-row">
        <SearchForm />
      </div>

      <!-- 등록 버튼 -->
      <div class="action-row" @click="goCreate">
        <BaseButton color="blue" size="medium">
          <img class="creat-btn-icon" :src="problemCreateIcon" alt="등록 아이콘" />
          <span>문제 등록하기</span>
        </BaseButton>
      </div>

      <!-- 리스트 카드  -->
      <section class="problem-list-card">
        <table class="problem-table">
          <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>8</td>
            <td>네트워크</td>
            <td>TCP 3-way handshake 흐름을 묻는 문제</td>
            <td>김명지니어스</td>
            <td>2025-11-17</td>
          </tr>
          </tbody>
        </table>
      </section>

      <!-- 페이징 -->
      <div class="pagination-row">
        <PaginationButton
            v-model:currentPage="page"
            :total-pages="totalPages"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchForm from '@/components/base/form/SearchForm.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import PaginationButton from '@/components/base/button/PaginationButton.vue'

//icon
import problemBackIcon from '@/assets/problem_back_icon.svg'
import problemCreateIcon from '@/assets/problem_create_icon.svg'

// pagination
const page = ref(1)
const totalPages = ref(5)

const router = useRouter()

const goCreate = () => {
  router.push({ name: 'ProblemCreate' })
}

</script>

<style scoped>
/* 전체 배경 */
.problem-page {
  height: 100%;
  overflow: auto;
}

/* 가운데 정렬 */
.page-inner {
  max-width: 1113px;
  margin: 80px auto 80px;
}

/* 제목 영역 */
.problem-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;
}

/* 뒤로가기 버튼 */
.back-btn {
  border: none;
  background: transparent;
  padding: 0;
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 40px;
  height: 40px;

  position: relative;
  top: 2px;
}



/* 카테고리 탭 */
.category-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.tab {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: #6b7280;
}

.tab.is-active {
  font-weight: 600;
  color: #111827;
}

/* 검색 영역 */
.search-row {
  max-width: 360px;
  margin-bottom: 24px;
}
/* searchForm 설정 problem 에서는 다르게 적용하기 위해 추가 (왼쪽 정렬 필요) */
.search-row :deep(.search-form) {
  justify-content: flex-start;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
}

/* 등록 버튼 안의 아이콘 */
.creat-btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  display: inline-block;
}

/* 등록 버튼 오른쪽 정렬 */
.action-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

/* 리스트 카드 */
.problem-list-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 18px 24px;
}

/* 테이블 */
.problem-table {
  width: 100%;
  border-collapse: collapse;
}

.problem-table th,
.problem-table td {
  padding: 12px 8px;
  font-size: 14px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.problem-table thead {
  background: #f9fafb;
  font-weight: 600;
}

/* 페이징 */
.pagination-row {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.page-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: transparent;
}
/* ------------------- 반응형 영역 ------------------- */

/* 태블릿 이하 (<= 1024px) */
@media (max-width: 1024px) {
  .page-inner {
    margin: 60px auto 60px;
    padding: 0 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .problem-list-card {
    padding: 16px 16px;
  }

  .problem-table th,
  .problem-table td {
    padding: 10px 6px;
    font-size: 13px;
  }
}

/* 모바일 (<= 768px) */
@media (max-width: 768px) {
  .page-inner {
    margin: 40px auto 40px;
    padding: 0 12px;
  }


  .problem-header {
    gap: 8px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  /* 카테고리 탭: 글자 조금 줄이고 줄 바꿈 허용 */
  .category-tabs {
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
  }

  .tab {
    font-size: 14px;
  }

  /* 검색창 폭 100% 사용 */
  .search-row {
    max-width: 100%;
    margin-bottom: 16px;
  }

  .search-row :deep(.search-form) {
    justify-content: flex-start;
  }

  .search-row :deep(.input-wrapper) {
    width: 100%;
  }

  /* 등록 버튼 여백 줄이기 */
  .action-row {
    margin-bottom: 16px;
  }

  /* 카드 안 패딩 줄이기 */
  .problem-list-card {
    padding: 12px 12px;
    border-radius: 12px;
  }

  /* 테이블 폰트 더 줄이기 */
  .problem-table th,
  .problem-table td {
    padding: 8px 4px;
    font-size: 12px;
  }

  .pagination-row {
    margin-top: 16px;
  }
}
</style>

