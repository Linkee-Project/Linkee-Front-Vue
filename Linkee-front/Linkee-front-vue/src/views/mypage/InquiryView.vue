<script setup>
import { ref, computed } from 'vue';
import InquiryListItem from '@/components/layout/mypage/inquiry/InquiryListItem.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import MyPageDetailModal from '@/components/layout/mypage/modal/MyPageDetailModal.vue'; // MyPageDetailModal import

// 더미 문의 데이터 (페이지네이션 확인용) - 'type' 속성 제거
const allInquiries = ref([
  { id: 1, subject: '로그인 오류 관련 문의드립니다.', date: '2023-11-20', status: '답변 완료', content: '로그인이 안되는 문제가 지속적으로 발생하고 있습니다. 확인 부탁드립니다.', answer: '로그인 오류에 대한 해결 방안을 안내해 드렸습니다. 메일함을 확인해 주세요.' },
  { id: 2, subject: '게임 중 렉이 발생합니다.', date: '2023-11-19', status: '답변 대기', content: '게임을 플레이하는 도중에 렉이 너무 심해서 진행이 어렵습니다. 개선 부탁드립니다.', answer: null },
  { id: 3, subject: '아이템 구매 내역 확인 요청', date: '2023-11-18', status: '답변 완료', content: '최근에 구매한 아이템 내역을 확인하고 싶습니다. 구매 내역을 알 수 있을까요?', answer: '회원님의 아이템 구매 내역을 확인하여 메일로 발송해 드렸습니다.' },
  { id: 4, subject: '새로운 퀴즈 카테고리 추가 건의', date: '2023-11-17', status: '답변 대기', content: '새로운 퀴즈 카테고리를 추가해주시면 좋을 것 같습니다. 예를 들어 "역사" 카테고리 같은 것 말이죠.', answer: null },
  { id: 5, subject: '비밀번호 변경이 안됩니다.', date: '2023-11-16', status: '답변 완료', content: '비밀번호 변경 시 오류가 발생하여 변경이 불가능합니다. 조치 부탁드립니다.', answer: '비밀번호 변경 시스템 점검 후 정상적으로 변경 가능하도록 조치하였습니다.' },
  { id: 6, subject: '모바일 환경에서 화면이 깨집니다.', date: '2023-11-15', status: '답변 대기', content: '모바일 환경에서 접속하면 화면 레이아웃이 깨져서 사용하기 불편합니다.', answer: null },
  { id: 7, subject: '환불 절차에 대해 알고 싶습니다.', date: '2023-11-14', status: '답변 완료', content: '아이템 환불 절차에 대해 자세히 알고 싶습니다. 어디서 확인할 수 있나요?', answer: '환불 절차는 고객센터 FAQ에서 확인하실 수 있습니다.' },
]);

const currentPage = ref(1);
const itemsPerPage = ref(4);
const isModalOpen = ref(false); // 모달의 열림/닫힘 상태 관리
const selectedInquiry = ref(null); // 선택된 문의 내역 정보

const totalPages = computed(() => Math.ceil(allInquiries.value.length / itemsPerPage.value));

const paginatedInquiries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allInquiries.value.slice(start, end);
});

// 모달 열기 함수
const openModal = (inquiry) => {
  selectedInquiry.value = inquiry;
  isModalOpen.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  isModalOpen.value = false;
  selectedInquiry.value = null;
};
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 문의 내역</h2>

    <div class="list-content">
      <!-- 테이블 헤더 -->
      <div class="list-header">
        <!-- <span class="header-item type">문의 유형</span> <- '문의 유형' 제거 -->
        <span class="header-item subject">제목</span>
        <span class="header-item date">등록일</span>
        <span class="header-item status">답변 상태</span>
      </div>

      <!-- 문의 목록 -->
      <div class="items-wrapper">
        <InquiryListItem
          v-for="inquiry in paginatedInquiries"
          :key="inquiry.id"
          :inquiry="inquiry"
          @show-detail="openModal"
        />
        <div v-if="paginatedInquiries.length === 0" class="empty-list">
          문의 내역이 없습니다.
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

    <!-- 문의 상세 모달 -->
    <MyPageDetailModal v-model:modelValue="isModalOpen" title="문의 상세">
      <div v-if="selectedInquiry"> <!-- Added wrapper div here -->
        <div class="inquiry-detail-content">
          <p><strong>제목:</strong> {{ selectedInquiry.subject }}</p>
          <p><strong>등록일:</strong> {{ selectedInquiry.date }}</p>
          <p><strong>상태:</strong> {{ selectedInquiry.status }}</p>

          <div class="inquiry-content-box mt-3">
            <p class="content-title">문의 내용</p>
            <p>{{ selectedInquiry.content }}</p>
          </div>

          <div class="inquiry-content-box mt-3">
            <p class="content-title">답변 내용</p>
            <p v-if="selectedInquiry.answer">{{ selectedInquiry.answer }}</p>
            <p v-else class="no-answer">아직 답변이 등록되지 않았습니다.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="modal-close-btn" @click="closeModal">닫기</button>
      </template>
    </MyPageDetailModal>
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

/* --- 컬럼 너비 수정 (제목, 등록일, 상태) --- */
/* .type { flex: 2; } <- '문의 유형' 스타일 제거 */
.subject { flex: 6; text-align: left; padding: 0 15px; min-width: 0; }
.date { flex: 3; }
.status {
  flex: 3;
  font-size: 16px; /* 명시적으로 폰트 크기 16px 지정 */
}

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

/* --- 문의 상세 모달 내용 스타일 --- */
.inquiry-detail-content p {
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.5;
  color: #333;
}

.inquiry-content-box {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  max-height: 200px; /* 내용이 길어질 경우 스크롤 */
  overflow-y: auto;
  white-space: pre-wrap; /* 공백 및 줄바꿈 유지 */
}

.modal-close-btn {
  background-color: #0094F6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: #007bbd;
}



/* --- 반응형 --- */
@media (max-width: 768px) {
  .list-container {
    padding: 20px;
  }
  .list-header {
    font-size: 14px;
  }
  .subject {
    padding: 0 8px;
  }
}
</style>

