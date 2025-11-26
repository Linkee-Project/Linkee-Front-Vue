<script setup>
import { ref, computed, onMounted, watch } from "vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import { useRouter } from "vue-router";
import { fetchNoticeList } from "@/api/noticeApi";

const router = useRouter();

// 백엔드에서 받아올 데이터
const notices = ref([]);

// 검색 키워드
const keyword = ref("");

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = ref(10);   // 변경됨(reactive)
const totalPages = ref(1);

// 필터: 정렬 기준 + 페이지 사이즈
const selectedSort = ref("createdAt,desc"); // 최신순
const selectedSize = ref(10);               // 10개씩 보기

// 날짜 포맷
const formatDate = (date) => {
  return date ? date.replace("T", " ").slice(0, 10) : "-";
};

// 공지 목록 불러오기
const loadNotices = async () => {
  try {
    const res = await fetchNoticeList({
      page: currentPage.value - 1,
      size: selectedSize.value,
      sort: selectedSort.value,
      active: "Y",
    });

    notices.value = res.content.map((n) => ({
      id: n.noticeId,
      title: n.noticeTitle,
      writer: n.adminName ?? "관리자",
      date: formatDate(n.createdAt),
      viewCount: n.noticeViews,
    }));

    totalPages.value = res.totalPages;
  } catch (e) {
    console.error(e);
  }
};

// 검색 필터
const filteredNotices = computed(() =>
    notices.value.filter((n) =>
        n.title.toLowerCase().includes(keyword.value.toLowerCase())
    )
);

// 페이지당 공지 표시
const paginatedNotices = computed(() =>
    filteredNotices.value.map((item, index) => ({
      ...item,
      displayId: (currentPage.value - 1) * selectedSize.value + index + 1,
    }))
);

// 상세 이동
const goDetail = (item) => {
  router.push({
    name: "NoticeDetail",
    params: { id: item.id },
  });
};

// 페이징 변경 시 API 재호출
watch(currentPage, loadNotices);

// 페이지 크기 변경
const changePageSize = () => {
  itemsPerPage.value = Number(selectedSize.value);
  currentPage.value = 1;
  loadNotices();
};

// 정렬 기준 변경
const changeSort = () => {
  currentPage.value = 1;
  loadNotices();
};

// 첫 로딩
onMounted(loadNotices);
</script>

<template>
  <div class="notice-wrapper">
    <div class="notice-container">

      <!-- 제목 -->
      <div class="title-wrapper">
        <button class="back-btn" @click="router.push('/home')">←</button>
        <h2 class="title">📢 공지사항</h2>
      </div>

      <!-- 검색 + 필터 행 -->
      <div class="search-filter-row">
        <div class="search-wrapper">
          <SearchForm v-model="keyword" @search="() => {}" />
        </div>

        <!-- 필터 영역 -->
        <div class="filter-row">
          <select v-model="selectedSize" @change="changePageSize">
            <option value="5">5개씩</option>
            <option value="10">10개씩</option>
            <option value="20">20개씩</option>
            <option value="50">50개씩</option>
          </select>

          <select v-model="selectedSort" @change="changeSort">
            <option value="createdAt,desc">최신순</option>
            <option value="noticeViews,desc">조회수순</option>
            <option value="noticeTitle,asc">제목순</option>
          </select>
        </div>
      </div>

      <!-- 테이블 스크롤 영역 -->
      <div class="table-scroll-area">
        <table class="notice-table">
          <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>조회수</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="item in paginatedNotices"
              :key="item.id"
              class="row"
              @click="goDetail(item)"
          >
            <td>{{ item.displayId }}</td>
            <td class="title-cell">{{ item.title }}</td>
            <td>{{ item.writer }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.viewCount }}</td>
          </tr>

          <tr v-if="paginatedNotices.length === 0">
            <td colspan="5" class="empty">검색 결과가 없습니다.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <PaginationButton
          v-model:currentPage="currentPage"
          :totalPages="totalPages"
          class="mt-20"
      />

    </div>
  </div>
</template>


<style scoped>
.notice-wrapper {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.notice-container {
  background: #eef6ff;
  padding: 20px;
  border-radius: 12px;

  width: 100%;
  height: calc(100vh - 160px); /* 너가 원하는 고정 높이 */
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
}

/* 제목 */
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 148, 246, 0.2);
  cursor: pointer;
  font-size: 20px;
}

/* 검색 */
.search-wrapper {
  width: 400px;
  margin-bottom: 10px;
}
.search-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;  /* 양쪽 배치 */
  margin-bottom: 10px;
}

/* 필터 */
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-row select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #cdd4e0;
  background: white;
  cursor: pointer;
}

/* 스크롤 영역 */
.table-scroll-area {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
}

/* 테이블 */
.notice-table {
  width: 100%;
  border-radius: 10px;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
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

.row:hover {
  background: #f7fbff;
}

</style>
