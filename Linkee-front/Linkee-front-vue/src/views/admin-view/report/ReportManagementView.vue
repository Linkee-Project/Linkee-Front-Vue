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
            <el-option label="채팅(C)" value="C"></el-option>
            <el-option label="게시글(B)" value="B"></el-option>
            <el-option label="문의(R)" value="R"></el-option>
            <el-option label="유저(U)" value="U"></el-option>
            <el-option label="게임(G)" value="G"></el-option>
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
          <td>{{ item.displayId }}</td>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseToast from "@/components/base/toast/BaseToast.vue";
import { fetchReportList } from "@/api/reportApi.js";

const router = useRouter();
const toastRef = ref(null);

const originalList = ref([]);
const filteredList = ref([]);

//필터 상태
const selectedType = ref("");
const selectedStatus = ref("");

//페이지네이션
const currentPage = ref(1);
const pageSize = 10;

//유형 한국어로 표시
const typeLabelMap = {
  C: "채팅",
  B: "게시글",
  R: "문의",
  U: "유저",
  G: "게임",
};

/* 백엔드 목록 불러오기 */
const loadReports = async () => {
  try {
    const res = await fetchReportList({
      page: currentPage.value - 1,
      size: pageSize,
      type: selectedType.value || null,
      status: selectedStatus.value || null,
    });

    // 백엔드 응답 맞춰 가공
    originalList.value = res.map(item => ({
      id: item.reportId,
      title: item.reportTitle,
      reg: item.createdAt?.replace("T", " ").slice(0, 16),
      mod: item.updatedAt?.replace("T", " ").slice(0, 16),
      user: item.reporterNickname ?? item.reporterId,
      admin: item.adminNickname ?? item.adminId ?? "-",
      type: typeLabelMap[item.reportType] || item.reportType,
      status: item.reportStatus
    }));

    filteredList.value = [...originalList.value];
  } catch (e) {
    console.error(e);
    toastRef.value.showToast("신고 목록 조회 실패 ⚠️");
  }
};

onMounted(loadReports);

//상태 필터
const filterStatus = (flag) => {
  selectedStatus.value = flag;
  currentPage.value = 1;
  loadReports();
};

//유형 필터
const filterReports = () => {
  currentPage.value = 1;
  loadReports();
};

//초기화
const resetFilter = () => {
  selectedType.value = "";
  selectedStatus.value = "";
  currentPage.value = 1;
  loadReports();
};

//신고 상세이동
const goDetail = (id) => {
  router.push(`/admin/reports/${id}`);
};


//페이지 계산
const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize));

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;

  return filteredList.value.slice(start, start + pageSize).map((item, index) => ({
    ...item,
    displayId: start + index+1    // 1부터 시작 + 페이지 계산
  }));
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
