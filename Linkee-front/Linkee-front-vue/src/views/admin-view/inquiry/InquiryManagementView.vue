<template>
  <div class="notice-wrapper">
    <div class="notice-container">

      <!-- 상단 영역 -->
      <div class="notice-header">

        <!-- 왼쪽: 비워둠(문의등록 없음) -->
        <div></div>

        <!-- 가운데 -->
        <h2 class="title" @click="resetFilter">문의관리</h2>

        <!-- 오른쪽 -->
        <div class="right-btns">
          <button class="btn-sort" @click="filterAnswer('Y')">답변완료</button>
          <button class="btn-sort" @click="filterAnswer('N')">답변미완료</button>
          <button class="btn-reset" @click="resetFilter">초기화</button>
        </div>
      </div>

      <!-- 테이블 -->
      <table class="notice-table">
        <thead>
        <tr>
          <th>문의번호</th>
          <th>제목</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>작성자</th>
          <th>관리자</th>
          <th>답변상태</th>
          <th>관리</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in paginatedList" :key="item.inquiryId">
          <td>{{ item.displayId }}</td>
          <td>{{ item.inquiryTitle }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>{{ item.userNickname }}</td>
          <td>{{ item.adminNickname ?? '-' }}</td>
          <td>{{ item.answerStatus }}</td>
          <td class="manage-btn">
            <button class="btn-small" @click="goAnswer(item)">답변</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <PaginationButton
          :currentPage="currentPage"
          :totalPages="totalPages"
          @update:currentPage="changePage"
      />

      <!-- Toast -->
      <BaseToast ref="toastRef" />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseToast from "@/components/base/toast/BaseToast.vue";
import {fetchInquiryList} from "@/api/inquiryApi.js";

const router = useRouter();
const toastRef = ref(null);

const inquiryList = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const filterStatus = ref(null);

const paginatedList = computed(() =>
    inquiryList.value.map((item, index) => ({
      ...item,
      displayId: (currentPage.value - 1) * 10 + index + 1
    }))
);

const formatDate = (date) => {
  return date ? date.replace("T", " ").slice(0, 16) : "-";
};

const loadList = async () => {
  try {
    const res = await fetchInquiryList({
      page : currentPage.value -1,
      size : 10,
      answerStatus : filterStatus.value
    });

    inquiryList.value = res.content;
    totalPages.value = res.totalPages;
  } catch (e) {
    console.error(e);
    toastRef.value.showToast("문의 목록 조회 실패 ⚠️");
  }
};

onMounted(loadList);

//필터 적용 함수
const filterAnswer = (status) => {
  filterStatus.value = status;
  currentPage.value = 1;
  loadList();
};

//필터 초기화
const resetFilter = () => {
  filterStatus.value = null;
  currentPage.value = 1;
  loadList();
}

//페이지 변경
const changePage = (page) => {
  currentPage.value = page;
  loadList();
}

/* 답변 페이지 이동 */
const goAnswer = (item) => {
  router.push({
    name: "AdminInquiryAnswer",
    params: { id: item.inquiryId }
  });
};



</script>

<style scoped>
.notice-wrapper {
  width: 100%;
  padding: 20px;
}

.notice-container {
  background: #eef6ff;
  padding: 20px;
  border-radius: 12px;
}

/* 헤더 */
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
}

.right-btns {
  display: flex;
  gap: 10px;
}

/* 버튼 */
.btn-sort,
.btn-reset {
  background: white;
  border: 1px solid #cdd4e0;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-sort:hover,
.btn-reset:hover {
  background: #eaf4ff;
}

.btn-small {
  background: #ffffff;
  border: 1px solid #cfd4e0;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.btn-small:hover {
  background: #eaf4ff;
}

/* 테이블 */
.notice-table {
  width: 100%;
  background: white;
  margin-top: 20px;
  border-radius: 10px;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.notice-table th,
.notice-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
}

.notice-table th {
  background: #f7f9fc;
  font-weight: bold;
}

.manage-btn button {
  font-size: 12px;
}
</style>
