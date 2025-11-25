<template>
  <div class="notice-wrapper">
    <div class="notice-container">

      <!-- 상단 영역 -->
      <div class="notice-header">

        <!-- 왼쪽 -->
        <button class="btn-register" @click="router.push('/admin/notices/create')">
          공지등록
        </button>

        <!-- 가운데 -->
        <h2 class="title" @click="resetFilter">공지관리</h2>

        <!-- 오른쪽 -->
        <div class="right-btns">
          <button class="btn-sort" @click="filterActive('Y')">활성화</button>
          <button class="btn-sort" @click="filterActive('N')">비활성화</button>
          <button class="btn-reset" @click="resetFilter">초기화</button>
        </div>
      </div>

      <!-- 테이블 -->
      <table class="notice-table">
        <thead>
        <tr>
          <th>공지번호</th>
          <th>제목</th>
          <th>관리자</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>조회수</th>
          <th>활성여부</th>
          <th>관리</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in paginatedList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.admin }}</td>
          <td>{{ item.reg }}</td>
          <td>{{ item.mod }}</td>
          <td>{{ item.views }}</td>
          <td>{{ item.active }}</td>
          <td class="manage-btn">
            <button class="btn-small" @click="goDetail(item.id)">✏️</button>
            <button class="btn-small" @click="deleteNotice(item.id)">❌</button>
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

/* 전체 공지 데이터 */
const originalList = ref([
  { id: 1, title: "공지사항 1번임", admin: "관리자1번임", reg: "2025/11/10", mod: "2025/11/10", views: 23, active: "Y" },
  { id: 2, title: "공지사항 2번임", admin: "관리자2번임", reg: "2025/11/10", mod: "2025/11/10", views: 12, active: "Y" },
  { id: 3, title: "공지사항 3번임", admin: "관리자2번임", reg: "2025/11/10", mod: "2025/11/10", views: 19, active: "Y" },
  { id: 4, title: "공지사항 4번임", admin: "관리자1번임", reg: "2025/11/10", mod: "2025/11/10", views: 8, active: "N" },
  { id: 5, title: "공지사항 5번임", admin: "관리자1번임", reg: "2025/11/10", mod: "2025/11/10", views: 11, active: "Y" },
]);

/* 현재 보여줄 필터링된 리스트 */
const filteredList = ref([...originalList.value]);

/* 상세페이지 이동 */
const goDetail = (id) => {
  router.push(`/admin/notices/${id}`);
};

/* 삭제 기능 */
const deleteNotice = (id) => {
  const confirmDelete = confirm("정말 삭제하시겠습니까?");
  if (!confirmDelete) return;

  originalList.value = originalList.value.filter(item => item.id !== id);
  filteredList.value = filteredList.value.filter(item => item.id !== id);

  toastRef.value.showToast("삭제가 완료되었습니다.");

  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
};

/* 필터링 기능 */
const filterActive = (flag) => {
  filteredList.value = originalList.value.filter(item => item.active === flag);
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

/* ----- header ----- */
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
}

.right-btns {
  display: flex;
  gap: 10px;
}

/* 버튼 스타일 */
.btn-register {
  background: #6daffe;
  color: white;
  border: none;
  padding: 7px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-register:hover {
  background: #5a9fee;
}

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

.btn-small {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: 0.2s;
}
.btn-small:hover {
  transform: scale(1.2);
}
</style>
