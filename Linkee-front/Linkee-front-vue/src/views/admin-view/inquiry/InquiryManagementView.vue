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
        <tr v-for="item in paginatedList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.reg }}</td>
          <td>{{ item.mod }}</td>
          <td>{{ item.user }}</td>
          <td>{{ item.admin }}</td>
          <td>{{ item.answer }}</td>
          <td class="manage-btn">
            <button class="btn-small" @click="goAnswer(item.id)">답변</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <PaginationButton
          :currentPage="currentPage"
          :totalPages="totalPages"
          @update:currentPage="currentPage = $event"
      />

      <!-- Toast -->
      <BaseToast ref="toastRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseToast from "@/components/base/toast/BaseToast.vue";

const router = useRouter();
const toastRef = ref(null);

/* 전체 문의 데이터 */
const originalList = ref([
  { id: 1, title: "문의사항 1번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저1번임", admin: "관리자1번임", answer: "Y" },
  { id: 2, title: "문의사항 2번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저6번임", admin: "관리자1번임", answer: "Y" },
  { id: 3, title: "문의사항 3번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저2번임", admin: "관리자1번임", answer: "N" },
  { id: 4, title: "문의사항 4번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저4번임", admin: "관리자1번임", answer: "N" },
]);

/* 현재 보여줄 리스트 */
const filteredList = ref([...originalList.value]);

/* 답변 페이지 이동 */
const goAnswer = (id) => {
  router.push(`/admin/inquiries/${id}`);
};

/* 상태 필터 */
const filterAnswer = (flag) => {
  filteredList.value = originalList.value.filter(item => item.answer === flag);
  currentPage.value = 1;
};

/* 필터 초기화 */
const resetFilter = () => {
  filteredList.value = [...originalList.value];
  currentPage.value = 1;
};

/* 페이지네이션 */
const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() =>
    Math.ceil(filteredList.value.length / pageSize)
);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});
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
