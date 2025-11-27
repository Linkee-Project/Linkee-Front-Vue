<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AdminButton from '@/components/base/button/AdminButton.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import BaseButton from '@/components/base/button/BaseButton.vue';
import QuestionVerifyModal from '@/components/Problem/modal/ProblemVerifyModal.vue';
import { getAdminProblemList, verifyProblem, adminDeleteProblem, getQuestionDetail } from '@/api/problemApi.js';

const adminProblems = ref([]); // 실제 관리자용 문제 데이터를 저장할 ref
const totalElements = ref(0); // API 응답에서 받을 총 요소 수
const loading = ref(true); // 로딩 상태
const error = ref(null); // 에러 상태

const isModalVisible = ref(false);
const selectedQuestion = ref(null); // 모달에 전달할 상세 문제 데이터
const modalDetailLoading = ref(false); // 모달 상세 정보 로딩 상태
const modalDetailError = ref(null); // 모달 상세 정보 에러 상태

// 🔎 필터 상태
const filters = ref({
  keyword: '', // 키워드 검색 추가
  verified: 'ALL',   // ALL | Y | N
  deleted: 'ALL',    // ALL | NORMAL | DELETED
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10); // 한 페이지에 보여줄 아이템 수 (기본값)

const totalPages = computed(() => Math.ceil(totalElements.value / itemsPerPage.value));

// 관리자용 문제 목록을 불러오는 함수
const fetchAdminProblems = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value - 1, // API는 0부터 시작하는 페이지 번호를 받음
      size: itemsPerPage.value,
      keyword: filters.value.keyword,
      verified: filters.value.verified === 'ALL' ? '' : filters.value.verified,
      // "NORMAL" -> "N", "DELETED" -> "Y", "ALL" -> "ALL"로 변환
      deleted: filters.value.deleted === 'ALL' ? '' : (filters.value.deleted === 'NORMAL' ? 'N' : 'Y'),
    };
    const response = await getAdminProblemList(params);
    adminProblems.value = response.data.content;
    totalElements.value = response.data.totalElements; // 총 요소 수 업데이트
  } catch (err) {
    error.value = '문제 목록을 불러오는 데 실패했습니다.';
    console.error('관리자 문제 목록 로딩 실패:', err);
  } finally {
    loading.value = false;
  }
};

// 필터 초기화
const resetFilters = () => {
  filters.value = {
    keyword: '',
    verified: 'ALL',
    deleted: 'ALL',
  };
  currentPage.value = 1; // 필터 초기화 시 첫 페이지로 이동
  // watch가 필터 변경을 감지하여 fetchAdminProblems를 호출할 것임
};

// 모달 열기
const openVerifyModal = async (question) => {
  modalDetailLoading.value = true;
  modalDetailError.value = null;
  isModalVisible.value = true; // 모달을 먼저 열어 로딩 상태를 보여줌

  try {
    const response = await getQuestionDetail(question.questionId);
    selectedQuestion.value = response.data; // 상세 문제 데이터 할당
  } catch (err) {
    modalDetailError.value = '문제 상세 정보를 불러오는 데 실패했습니다.';
    console.error('문제 상세 정보 로딩 실패:', err);
    selectedQuestion.value = null; // 에러 시 데이터 초기화
  } finally {
    modalDetailLoading.value = false;
  }
};

const isVerifying = ref(false); // 중복 실행 방지

// 검증완료 처리 (API 연동)
const handleVerify = async (questionId) => {
  if (isVerifying.value) return; // 이미 검증 진행 중이면 중복 실행 방지
  if (!confirm('해당 문제를 검증 완료 처리하시겠습니까?')) return;
  try {
    isVerifying.value = true; // 잠금 설정
    await verifyProblem(questionId);
    alert('문제가 성공적으로 검증 처리되었습니다.');
    isModalVisible.value = false; // 모달 닫기
    fetchAdminProblems(); // 목록 새로고침
  } catch (err) {
    console.error('문제 검증 실패:', err);
    alert(`문제 검증 실패: ${err.response?.data?.message || err.message}`);
  } finally {
    isVerifying.value = false; // 잠금해제
  }
};

// 삭제 (소프트 삭제: isDeleted만 Y로 변경) (API 연동)
const handleDelete = async (questionId) => {
  if (!confirm('해당 문제를 삭제(숨김) 처리하시겠습니까?')) return;
  try {
    await adminDeleteProblem(questionId);
    alert('문제가 성공적으로 삭제 처리되었습니다.');
    fetchAdminProblems(); // 목록 새로고침
  } catch (err) {
    console.error('문제 삭제 실패:', err);
    alert(`문제 삭제 실패: ${err.response?.data?.message || err.message}`);
  }
};

// 페이지 변경 시 데이터 재요청
watch(currentPage, () => {
  fetchAdminProblems();
});

// 필터 변경 시 데이터 재요청 (페이지 1로 초기화)
watch(
  filters,
  () => {
    currentPage.value = 1; // 필터 변경 시 항상 첫 페이지로
    fetchAdminProblems();
  },
  { deep: true } // filters 객체의 내부 변경도 감지
);

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchAdminProblems();
});
</script>

<template>
  <div class="question-management-container">
    <h2 class="page-title">문제게시판 관리</h2>

    <!-- 상단 필터 영역 -->
    <div class="filter-row">
      <div class="filter-group">
        <!-- 키워드 검색 -->
        <input
            type="text"
            v-model="filters.keyword"
            placeholder="키워드 검색"
            class="filter-input"
            @keyup.enter="fetchAdminProblems"
        />

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

    <!-- 로딩 및 에러 메시지 -->
    <div v-if="loading" class="empty-list">문제 목록을 불러오는 중입니다...</div>
    <div v-else-if="error" class="empty-list error-message">{{ error }}</div>

    <!-- 테이블 -->
    <div v-else class="table-wrapper">
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
        <tr v-if="adminProblems.length === 0">
            <td colspan="10" class="empty-list">조회된 문제가 없습니다.</td>
        </tr>
        <tr v-for="question in adminProblems" :key="question.questionId">
          <td>{{ question.questionId }}</td>
          <td class="title-cell">{{ question.questionTitle }}</td>
          <td>{{ question.userNickname }}</td>
          <td>{{ question.createdAt }}</td>
          <td>{{ question.updatedAt ? question.updatedAt : 'N/A' }}</td> <!-- updatedAt이 없을 경우 처리 -->
          <td>{{ question.viewCount }}</td>
          <td>{{ question.verified === 'Y' ? '검증완료' : '검증미완료' }}</td>
          <td>{{ question.isDeleted === 'Y' ? '삭제됨' : '정상' }}</td>
          <td>
            <AdminButton @click="openVerifyModal(question)">검증</AdminButton>
          </td>
          <td>
            <AdminButton @click="handleDelete(question.questionId)">삭제</AdminButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <PaginationButton
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:currentPage="currentPage = $event"
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

.filter-input { /* 키워드 검색 인풋 스타일 */
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d0d7e2;
  font-size: 13px;
  background: #f9fbff;
  color: #111827;
  outline: none;
  width: 150px; /* 적당한 너비 */
}

.filter-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

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
</style>