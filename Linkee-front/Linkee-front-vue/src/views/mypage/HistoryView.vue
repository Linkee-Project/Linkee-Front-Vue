<script setup>
import { ref, computed } from 'vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import HistoryListItem from '@/components/layout/mypage/history/HistoryListItem.vue';
import MyPageDetailModal from '@/components/layout/mypage/modal/MyPageDetailModal.vue'; // MyPageDetailModal import

// 더미 플레이 기록 데이터
const allPlayHistory = ref([
  {
    id: 1,
    category: '네트워크',
    title: 'TCP 3-way handshake 이해하기',
    date: '2023-11-20',
    problems: [
      {
        question: 'TCP 3-way handshake의 순서를 올바르게 나열하세요.',
        answer: 'SYN → SYN+ACK → ACK 순서입니다.'
      },
      {
        question: 'SYN 플래그의 역할은 무엇인가요?',
        answer: '연결 요청을 시작하고 초기 순서 번호를 동기화합니다.'
      }
    ]
  },
  {
    id: 2,
    category: '자료구조',
    title: '스택과 큐의 차이',
    date: '2023-11-19',
    problems: [
      {
        question: '1. 스택(Stack)과 큐(Queue)의 주요 차이점은 무엇인가요?\n' +
            '\'2. 스택(Stack)과 큐(Queue)의 주요 차이점은 무엇인가요?\n\'' +
            '\'3. 스택(Stack)과 큐(Queue)의 주요 차이점은 무엇인가요?\n\'' +
            '\'4. 스택(Stack)과 큐(Queue)의 주요 차이점은 무엇인가요?\n\'',
        answer: '1. 스택은 LIFO(후입선출), 큐는 FIFO(선입선출) 구조입니다.'
      },
      {
        question: '스택에서 데이터를 추가하는 연산의 이름은 무엇인가요?',
        answer: 'Push 연산입니다.'
      },
      {
        question: '큐에서 데이터를 제거하는 연산의 이름은 무엇인가요?',
        answer: 'Dequeue 연산입니다.'
      }
    ]
  },
  {
    id: 3,
    category: '운영체제',
    title: '프로세스와 스레드',
    date: '2023-11-18',
    problems: [
      {
        question: '프로세스(Process)와 스레드(Thread)의 차이점을 설명하세요.',
        answer: '프로세스는 독립적인 메모리 공간을 가지지만, 스레드는 한 프로세스 내에서 코드, 데이터, 힙 영역을 공유하며 실행됩니다.'
      },
      {
        question: '멀티스레딩의 장점 두 가지를 말해보세요.',
        answer: '자원 공유 및 응답성 향상입니다.'
      }
    ]
  },
  {
    id: 4,
    category: '데이터베이스',
    title: '정규화 단계 개념',
    date: '2023-11-17',
    problems: [
      {
        question: '데이터베이스 정규화의 목적은 무엇인가요?',
        answer: '데이터 중복을 제거하고 이상 현상(삽입, 갱신, 삭제 이상)을 방지하여 데이터 무결성을 높이기 위함입니다.'
      },
      {
        question: '제1정규형(1NF)을 만족하기 위한 조건은 무엇인가요?',
        answer: '모든 속성 값이 원자 값(atomic value)이어야 합니다.'
      }
    ]
  }
]);


const currentPage = ref(1);
const itemsPerPage = ref(4);
const isHistoryModalOpen = ref(false); // 모달의 열림/닫힘 상태 관리
const selectedHistory = ref(null); // 선택된 플레이 기록 내역 정보

const totalPages = computed(() => Math.ceil(allPlayHistory.value.length / itemsPerPage.value));

const paginatedPlayHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allPlayHistory.value.slice(start, end);
});

// 모달 열기 함수
const openHistoryModal = (history) => {
  selectedHistory.value = history;
  isHistoryModalOpen.value = true;
};

// 모달 닫기 함수
const closeHistoryModal = () => {
  isHistoryModalOpen.value = false;
  selectedHistory.value = null;
};
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 플레이 기록</h2>

    <div class="list-content">
      <!-- 테이블 헤더 -->
      <div class="list-header">
        <span class="header-item no">NO</span>
        <span class="header-item category">카테고리</span>
        <span class="header-item title">제목</span>
        <span class="header-item date">플레이 날짜</span>
      </div>

      <!-- 플레이 기록 목록 -->
      <div class="items-wrapper">
        <HistoryListItem
          v-for="(history, index) in paginatedPlayHistory"
          :key="history.id"
          :history="history"
          :index="index"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          @show-detail="openHistoryModal"
        />
        <div v-if="paginatedPlayHistory.length === 0" class="empty-list">
          플레이 기록이 없습니다.
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

    <!-- 플레이 기록 상세 모달 -->
    <MyPageDetailModal v-model:modelValue="isHistoryModalOpen" title="문제 상세">
      <div v-if="selectedHistory">  <!-- Added wrapper div here -->
        <div class="history-detail-content">
          <p><strong>카테고리:</strong> {{ selectedHistory.category }}</p>
          <p><strong>제목:</strong> {{ selectedHistory.title }}</p>
          <p><strong>플레이 날짜:</strong> {{ selectedHistory.date }}</p>

          <div v-for="(problem, pIndex) in selectedHistory.problems" :key="pIndex" class="problem-section mt-3">
            <div class="history-content-box">
              <p class="content-title">문제 {{ pIndex + 1 }}</p>
              <p>{{ problem.question }}</p>
            </div>

            <div class="history-content-box mt-3">
              <p class="content-title">정답 {{ pIndex + 1 }}</p>
              <p>{{ problem.answer }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="modal-close-btn" @click="closeHistoryModal">닫기</button>
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
  align-items: center;
  padding: 12px 0;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0094F6;
  font-size: 16px;
}

.header-item {
  text-align: center;
  flex: 1; /* 모든 컬럼이 동일한 너비를 갖도록 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-item.no {
  flex: 0.5; /* NO 컬럼은 더 작게 */
}
.header-item.category {
  flex: 1.5; /* 카테고리 컬럼 */
  text-align: left;
  padding-left: 15px;
}
.header-item.title {
  flex: 3; /* 제목 컬럼은 더 넓게 */
  text-align: left;
  padding-left: 15px;
}
.header-item.date {
  flex: 1.5; /* 날짜 컬럼 */
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

/* --- 플레이 기록 상세 모달 내용 스타일 --- */
.history-detail-content p {
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.5;
  color: #333;
}

.history-content-box {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  max-height: 200px; /* 내용이 길어질 경우 스크롤 */
  overflow-y: auto;
  white-space: pre-wrap; /* 공백 및 줄바꿈 유지 */
}

.history-content-box.mt-3, .problem-section.mt-3 {
  margin-top: 20px; /* 문제 내용과 정답 사이 간격 */
}

.content-title {
  font-weight: bold;
  color: #0094F6;
  margin-bottom: 8px;
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
    padding: 15px 0;
  }
}
</style>
