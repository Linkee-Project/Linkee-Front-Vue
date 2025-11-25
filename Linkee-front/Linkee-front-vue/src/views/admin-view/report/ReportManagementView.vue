<template>
  <div class="notice-wrapper">
    <div class="notice-container">

      <!-- 상단 영역 -->
      <div class="notice-header">

        <!-- 왼쪽 비워둠 -->
        <div></div>

        <!-- 가운데 -->
        <h2 class="title" @click="resetFilter">신고관리</h2>

        <!-- 오른쪽 필터 -->
        <div class="right-btns">
          <el-select v-model="selectedType" placeholder="신고유형" class="select-type" @change="filterReports">
            <el-option label="전체" value=""></el-option>
            <el-option label="채팅(C)" value="채팅"></el-option>
            <el-option label="게시글(B)" value="게시글"></el-option>
            <el-option label="문의(R)" value="문의"></el-option>
            <el-option label="유저(U)" value="유저"></el-option>
            <el-option label="게임(G)" value="게임"></el-option>
          </el-select>

          <button class="btn-sort" @click="filterStatus('Y')">처리완료</button>
          <button class="btn-sort" @click="filterStatus('N')">처리미완료</button>

          <button class="btn-reset" @click="resetFilter">초기화</button>
        </div>
      </div>

      <!-- 테이블 -->
      <table class="notice-table">
        <thead>
        <tr>
          <th>신고번호</th>
          <th>제목</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>작성자</th>
          <th>관리자</th>
          <th>신고유형</th>
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
          <td>{{ item.type }}</td>
          <td>{{ item.status }}</td>

          <td class="manage-btn">
            <button class="btn-small" @click="goDetail(item.id)">신고상세</button>
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

/* 신고 데이터 */
const originalList = ref([
  { id: 1, title: "신고사항 1번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저1번임", admin: "관리자1번임", type: "채팅", status: "Y" },
  { id: 2, title: "신고사항 2번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저6번임", admin: "관리자1번임", type: "게시글", status: "Y" },
  { id: 3, title: "신고사항 3번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저2번임", admin: "관리자1번임", type: "유저", status: "N" },
  { id: 4, title: "신고사항 4번임", reg: "2025/11/10", mod: "2025/11/10", user: "유저4번임", admin: "관리자1번임", type: "게임", status: "N" },
]);

const filteredList = ref([...originalList.value]);

/* 상태 필터 */
const filterStatus = (flag) => {
  filteredList.value = originalList.value.filter(item => item.status === flag);
  currentPage.value = 1;
};

/* 유형 필터 */
const selectedType = ref("");

const filterReports = () => {
  if (!selectedType.value) {
    filteredList.value = [...originalList.value];
  } else {
    filteredList.value = originalList.value.filter(item => item.type === selectedType.value);
  }
  currentPage.value = 1;
};

/* 초기화 */
const resetFilter = () => {
  selectedType.value = "";
  filteredList.value = [...originalList.value];
  currentPage.value = 1;
};

/* 신고상세 페이지 이동 */
const goDetail = (id) => {
  router.push(`/admin/reports/${id}`);
};

/* 페이지네이션 */
const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize));

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

/* 신고 유형 select */
.select-type {
  width: 120px;
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
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  cursor: pointer;
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
</style>
