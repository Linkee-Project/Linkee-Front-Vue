<script setup>
import { ref, computed } from 'vue';
import AdminButton from '@/components/base/button/AdminButton.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import BaseButton from '@/components/base/button/BaseButton.vue';
import QuestionVerifyModal from '@/components/Problem/modal/ProblemVerifyModal.vue';

const questions = ref(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `문제게시글 ${i + 1}번임`,
      writer: `유저${(i + 1) * 2 - 1}번임`,
      createdAt: '2025/11/10',
      updatedAt: '2025/11/10',
      views: [23, 12, 8, 35, 62][i],
      verified: i % 2 === 0 ? 'Y' : 'N',  // 검증상태
      isDeleted: 'N',                     // 삭제 여부 (소프트 삭제)
      // 모달 상세 정보
      category: '네트워크',
      content: 'TCP 3-way handshake의 각 단계(SYN, SYN+ACK, ACK)를 순서대로 설명하세요.',
      options: [
        '클라이언트가 ACK를 먼저 보낸다.',
        '클라이언트 SYN → 서버 SYN+ACK → 클라이언트 ACK.',
        '서버가 두 번 SYN을 보낸다.',
        '자동으로 연결된다.',
      ],
      answer: 2,
    }))
);

const isModalVisible = ref(false);
const selectedQuestion = ref(null);

// 🔎 필터 상태
const filters = ref({
  verified: 'ALL',   // ALL | Y | N
  deleted: 'ALL',    // ALL | NORMAL | DELETED
});

// 🔎 필터된 리스트 (화면에서 이걸 사용)
const filteredQuestions = computed(() => {
  return questions.value.filter((q) => {
    // 검증 상태 필터
    if (filters.value.verified !== 'ALL') {
      if (q.verified !== filters.value.verified) return false;
    }

    // 게시 상태 필터 (isDeleted)
    if (filters.value.deleted !== 'ALL') {
      const targetFlag = filters.value.deleted === 'DELETED' ? 'Y' : 'N'; // NORMAL → N, DELETED → Y
      if (q.isDeleted !== targetFlag) return false;
    }

    return true;
  });
});

// 필터 초기화
const resetFilters = () => {
  filters.value = {
    verified: 'ALL',
    deleted: 'ALL',
  };
};

// 모달 열기
const openVerifyModal = (question) => {
  selectedQuestion.value = question;
  isModalVisible.value = true;
};

// 검증완료 처리
const handleVerify = (questionId) => {
  const idx = questions.value.findIndex(q => q.id === questionId);
  if (idx !== -1) {
    questions.value[idx] = {
      ...questions.value[idx],
      verified: 'Y',
    };
  }
  isModalVisible.value = false;
};

// 삭제 (소프트 삭제: isDeleted만 Y로 변경)
const handleDelete = (questionId) => {
  if (!confirm('해당 문제를 삭제(숨김) 처리하시겠습니까?')) return;

  const idx = questions.value.findIndex(q => q.id === questionId);
  if (idx !== -1) {
    questions.value[idx] = {
      ...questions.value[idx],
      isDeleted: 'Y',
    };
  }
};

// Pagination
const currentPage = ref(1);
const totalPages = ref(5);

const updateCurrentPage = (newPage) => {
  currentPage.value = newPage;
  console.log('Current page:', currentPage.value);
  // TODO: 페이지 변경 시 문제 목록 재요청
};
</script>

<template>
  <div class="question-management-container">
    <h2 class="page-title">문제게시판 관리</h2>

    <!-- 상단 필터 영역 -->
    <div class="filter-row">
      <div class="filter-group">
        <!-- 검증 상태 필터 -->
        <label class="filter-label" for="verified-filter">검증상태</label>
        <select
            id="verified-filter"
            v-model="filters.verified"
            class="filter-select"
        >
          <option value="ALL">전체</option>
          <option value="Y">검증완료</option>
          <option value="N">검증미완료</option>
        </select>

        <!-- 게시 상태 필터 (삭제 여부) -->
        <label class="filter-label" for="deleted-filter">게시상태</label>
        <select
            id="deleted-filter"
            v-model="filters.deleted"
            class="filter-select"
        >
          <option value="ALL">전체</option>
          <option value="NORMAL">정상</option>
          <option value="DELETED">삭제됨</option>
        </select>
      </div>

      <!-- 우측: 필터 초기화 버튼 -->
      <BaseButton
          label="필터 초기화"
          color="gray"
          size="small"
          @click="resetFilters"
      />
    </div>

    <!-- 테이블 -->
    <div class="table-wrapper">
      <table class="question-table">
        <thead>
        <tr>
          <th>문제번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>조회수</th>
          <th>검증상태</th>
          <th>게시상태</th>
          <th>검증</th>
          <th>삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="question in filteredQuestions" :key="question.id">
          <td>{{ question.id }}</td>
          <td class="title-cell">{{ question.title }}</td>
          <td>{{ question.writer }}</td>
          <td>{{ question.createdAt }}</td>
          <td>{{ question.updatedAt }}</td>
          <td>{{ question.views }}</td>
          <td>{{ question.verified === 'Y' ? '검증완료' : '검증미완료' }}</td>
          <td>{{ question.isDeleted === 'Y' ? '삭제됨' : '정상' }}</td>
          <td>
            <AdminButton @click="openVerifyModal(question)">검증</AdminButton>
          </td>
          <td>
            <AdminButton @click="handleDelete(question.id)">삭제</AdminButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <PaginationButton
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:currentPage="updateCurrentPage"
    />

    <!-- 문제 검증 모달 -->
    <QuestionVerifyModal
        :visible="isModalVisible"
        :question-data="selectedQuestion"
        @update:visible="isModalVisible = $event"
        @verify="handleVerify"
    />
  </div>
</template>

<style scoped>
.question-management-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: 600;
}

/* 🔹 필터 영역 */
.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 13px;
  color: #4b5563;
}

.filter-select {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d0d7e2;
  font-size: 13px;
  background: #f9fbff;
  color: #111827;
  outline: none;
}

.filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

/* 🔹 테이블 */
.table-wrapper {
  overflow-x: auto;
}

.question-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.question-table th {
  background: #f0f7ff;
  padding: 12px;
  font-weight: 600;
}

.question-table td {
  background: #fff;
  padding: 14px;
  text-align: center;
  border-radius: 12px;
}

.title-cell {
  text-align: left;
  padding-left: 20px;
}
</style>
