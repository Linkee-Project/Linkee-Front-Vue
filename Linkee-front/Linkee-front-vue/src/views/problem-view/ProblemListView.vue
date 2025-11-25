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
          <!-- 데이터 있을 때 -->
          <tr
              v-for="problem in paginatedProblems"
              :key="problem.id"
              class="problem-row"
              @click="goDetail(problem.id)"
          >
            <td>{{ problem.id }}</td>
            <td>{{ problem.category }}</td>
            <td>{{ problem.title }}</td>
            <td>{{ problem.writer }}</td>
            <td>{{ formatDate(problem.createdAt) }}</td>
          </tr>

          <!-- 데이터 없을 때 -->
          <tr v-if="paginatedProblems.length === 0">
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import SearchForm from '@/components/base/form/SearchForm.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import PaginationButton from '@/components/base/button/PaginationButton.vue'

//icon
import problemBackIcon from '@/assets/problem_back_icon.svg'
import problemCreateIcon from '@/assets/problem_create_icon.svg'

// 카테고리
const categories = ['전체', '네트워크', '데이터베이스', '자료구조', '운영체제']
const selectedCategory = ref('전체')

// 검색 키워드
const searchKeyword = ref('')

// 페이지 상태
const page = ref(1)
const size = ref(10)


const allProblems = ref([
  {
    id: 11,
    category: '네트워크',
    title: 'TCP 3-way handshake 흐름을 설명하시오.',
    writer: '김명지니어스',
    createdAt: '2025-11-20'
  },
  {
    id: 10,
    category: '운영체제',
    title: '운영체제 마스터 풀어보시오',
    writer: '우하하',
    createdAt: '2025-11-20'
  },
  {
    id: 9,
    category: '데이터베이스',
    title: '정규화가 필요한 이유와 장단점은?',
    writer: 'DB마스터',
    createdAt: '2025-11-19'
  },
  {
    id: 8,
    category: '자료구조',
    title: '스택과 큐의 차이점을 설명하시오.',
    writer: 'CS러버',
    createdAt: '2025-11-18'
  },
  {
    id: 7,
    category: '운영체제',
    title: '프로세스와 스레드의 차이는?',
    writer: 'OS전문가',
    createdAt: '2025-11-17'
  },
  {
    id: 6,
    category: '네트워크',
    title: 'OSI 7계층 각각의 역할은?',
    writer: '김명지니어스',
    createdAt: '2025-11-16'
  },
  {
    id: 5,
    category: '데이터베이스',
    title: '트랜잭션의 ACID 특성을 설명하시오.',
    writer: 'DB러버',
    createdAt: '2025-11-15'
  },
  {
    id: 4,
    category: '자료구조',
    title: '해시 테이블의 충돌 해결 방법에는 무엇이 있는가?',
    writer: '자료구조고수',
    createdAt: '2025-11-14'
  },
  {
    id: 3,
    category: '운영체제',
    title: 'Deadlock의 발생 조건을 설명하시오.',
    writer: 'OS마스터',
    createdAt: '2025-11-13'
  },
  {
    id: 2,
    category: '네트워크',
    title: 'HTTP와 HTTPS 차이점은?',
    writer: '웹개발자',
    createdAt: '2025-11-12'
  },
  {
    id: 1,
    category: '자료구조',
    title: '시간 복잡도 Big-O 표기법을 설명하시오.',
    writer: 'CS학생',
    createdAt: '2025-11-11'
  },

])

const router = useRouter()

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

// 카테고리 + 검색으로 필터링
const filteredProblems = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()

  return allProblems.value.filter((p) => {
    // 카테고리 필터
    const matchCategory =
        selectedCategory.value === '전체' ||
        p.category === selectedCategory.value

    // 검색 필터 (제목 + 작성자)
    const matchKeyword =
        kw === '' ||
        p.title.toLowerCase().includes(kw) ||
        p.writer.toLowerCase().includes(kw)

    return matchCategory && matchKeyword
  })
})


const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProblems.value.length / size.value))
})


const paginatedProblems = computed(() => {
  const start = (page.value - 1) * size.value
  const end = start + size.value
  return filteredProblems.value.slice(start, end)
})


const changeCategory = (cat) => {
  if (selectedCategory.value === cat) return
  selectedCategory.value = cat
  page.value = 1
}

// 검색 이벤트 처리
const onSearch = (keyword) => {
  searchKeyword.value = keyword?.trim?.() ?? ''
  page.value = 1
}

// 필터 결과가 줄어서 현재 page가 범위를 넘어가면 보정
watch(filteredProblems, () => {
  if (page.value > totalPages.value) {
    page.value = 1
  }
})
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
