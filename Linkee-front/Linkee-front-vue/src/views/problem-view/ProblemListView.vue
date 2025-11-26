<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 제목 -->
      <header class="problem-header">
        <button class="back-btn" @click="goBack">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제게시판</h1>
      </header>

      <!-- 카테고리 탭 -->
      <nav class="category-tabs">
        <button
            v-for="cat in categories"
            :key="cat"
            class="tab"
            :class="{ 'is-active': selectedCategory === cat }"
            @click="changeCategory(cat)"
        >
          {{ cat }}
        </button>
      </nav>

      <!-- 검색 -->
      <div class="search-row">
        <SearchForm
            v-model="searchKeyword"
            @search="onSearch"
        />
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
          <!-- 로딩 중 -->
          <tr v-if="loading">
            <td colspan="5" style="text-align: center; padding: 20px;">
              데이터를 불러오는 중입니다...
            </td>
          </tr>
          <!-- 데이터 있을 때 -->
          <tr
              v-else-if="problems.length > 0"
              v-for="problem in problems"
              :key="problem.questionId"
              class="problem-row"
              @click="goDetail(problem.questionId)"
          >
            <td>{{ problem.questionId }}</td>
            <td>{{ problem.categoryName }}</td>
            <td>{{ problem.questionTitle }}</td>
            <td>{{ problem.userNickname }}</td>
            <td>{{ formatDate(problem.createdAt) }}</td>
          </tr>
          <!-- 데이터 없을 때 -->
          <tr v-else>
            <td colspan="5" style="text-align: center; padding: 20px;">
              등록된 문제가 없습니다.
            </td>
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProblemStore } from '@/stores/problemStore'

import SearchForm from '@/components/base/form/SearchForm.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import PaginationButton from '@/components/base/button/PaginationButton.vue'

//icon
import problemBackIcon from '@/assets/problem_back_icon.svg'
import problemCreateIcon from '@/assets/problem_create_icon.svg'

// Store 사용
const problemStore = useProblemStore()
const { problems, loading, totalPages } = storeToRefs(problemStore)

// 로컬 상태
const categories = ['전체', '네트워크', '데이터베이스', '자료구조', '운영체제']
const selectedCategory = ref('전체')
const searchKeyword = ref('')
const page = ref(1) // 현재 페이지 (1-based)
const size = ref(10) // 페이지 크기

const router = useRouter()

// 🚨 중요: 임시 카테고리 매핑 객체 - 백엔드의 실제 ID에 맞춰 수정 필요!
const categoryMap = {
  '전체': undefined, // '전체'는 categoryId를 보내지 않음
  '운영체제': 1,
  '네트워크': 2,
  '자료구조': 3,
  '데이터베이스': 4
  // TODO: 실제 백엔드의 카테고리 ID에 맞춰 이 매핑을 정확히 수정해주세요!
};

// 데이터 로드 함수
const loadProblems = () => {
  let currentCategoryId = categoryMap[selectedCategory.value];

  // '전체' 카테고리이거나 매핑된 ID가 없으면 categoryId를 보내지 않습니다.
  if (selectedCategory.value === '전체' || currentCategoryId === undefined) {
    currentCategoryId = undefined; // categoryId를 보내지 않도록 설정
  }

  // store의 fetchProblems는 0-based index를 사용하므로 page-1 전달
  problemStore.fetchProblems(
      page.value - 1,
      size.value,
      currentCategoryId, // 변환된 categoryId 전달
      searchKeyword.value // 검색 키워드 전달
  );
};

// 라이프사이클 훅: 컴포넌트가 마운트될 때 데이터 로드
onMounted(() => {
  loadProblems()
})

// 페이지 번호가 변경되면 데이터 다시 로드
watch(page, () => {
  loadProblems()
})


const goCreate = () => {
  router.push({ name: 'ProblemCreate' })
}

const goDetail = (id) => {
  router.push({
    name: 'ProblemDetail',
    params: { id },
  })
}

const goBack = () => {
  router.back()
}

// 날짜 포맷 (yyyy-MM-dd 형태 유지)
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

const changeCategory = (cat) => {
  if (selectedCategory.value === cat) return
  selectedCategory.value = cat
  page.value = 1 // 카테고리 변경 시 페이지 초기화
  loadProblems(); // 카테고리 변경 시 데이터 다시 로드
}

// 검색 이벤트 처리
const onSearch = (keyword) => {
  searchKeyword.value = keyword?.trim?.() ?? ''
  page.value = 1 // 검색 시 페이지 초기화
  loadProblems(); // 검색 시 데이터 다시 로드
}
</script>

<style scoped>
/* 전체 배경 */
.problem-page {
  height: 100%;
  overflow: auto;
}

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
.search-row :deep(.search-form) {
  justify-content: flex-start;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
}


.creat-btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  display: inline-block;
}


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
.problem-row {
  cursor: pointer;
}

.problem-row:hover {
  background: #f9fafb;
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

  .category-tabs {
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
  }

  .tab {
    font-size: 14px;
  }

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

  .action-row {
    margin-bottom: 16px;
  }

  .problem-list-card {
    padding: 12px 12px;
    border-radius: 12px;
  }

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
