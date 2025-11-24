<script setup >
import {ref, computed} from "vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import {useRouter} from "vue-router"; //페이지 이동을 위해

const router = useRouter();

//서버 연결 후 교체
const notices = ref([
  { id: 13, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 12, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 11, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 10, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 9, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 8, title: "시스템 점검 안내", writer: "관리자", date: "2025-11-17", viewCount: "20"},
  { id: 7, title: "공지사항입니다.", writer: "관리자", date: "2025-11-17", viewCount: "20" },
  { id: 6, title: "공지사항입니다.", writer: "관리자", date: "2025-11-16", viewCount: "20" },
  { id: 5, title: "공지사항입니다.", writer: "관리자", date: "2025-11-15", viewCount: "20" },
  { id: 4, title: "공지사항입니다.", writer: "관리자", date: "2025-11-15", viewCount: "20" },
  { id: 3, title: "공지사항입니다.", writer: "관리자", date: "2025-11-14", viewCount: "20" },
  { id: 2, title: "공지사항입니다.", writer: "관리자", date: "2025-11-14", viewCount: "20" },
  { id: 1, title: "공지사항입니다.", writer: "관리자", date: "2025-11-13", viewCount: "20" },
]);

//검색 키워드 상태
const keyword = ref("");

//검색 필터: 포함 여부로 판단
const filteredNotices = computed(() =>
    notices.value.filter(n =>
        n.title.toLowerCase().includes(keyword.value.toLowerCase())
    )
);

//페이지 네이션 상태
const currentPage = ref(1);  // 현재 페이지
const itemsPerPage = 15;      // 한 페이지에 보여줄 항목 개수

//전체 페이지 수 계산
const totalPages = computed(() =>
    Math.ceil(filteredNotices.value.length / itemsPerPage)
);

//현재 페이지에 맞는 공지사항만 보여주기
const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNotices.value.slice(start, start + itemsPerPage);
});

//공지사항 클릭시 상세 페이지로 이동
const goDetail = (item) => {
  router.push({
    name: "NoticeDetail",
    params: {
      id: item.id,
    },
    query: {
      title: item.title,
      writer: item.writer,
      date: item.date,
      viewCount : item.viewCount
    }
  });
};
</script>

<template>
  <div class="notice-page">
    <div class="title-wrapper">
      <button class="back-btn" @click="router.push('/')">←</button>
      <h2 class="title">📢 공지사항</h2>
    </div>

    <!-- 검색바 -->
    <div class="search-wrapper">
      <SearchForm v-model="keyword" @search="()=>{}" />
    </div>

    <!-- 공지사항 목록 테이블 -->
    <div class="table-wrapper">
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
          <!--페이지네이션으로 잘린 공지사항 반복 렌더링-->
          <tr
              v-for="item in paginatedNotices"
              :key="item.id"
              class="row"
              @click="goDetail(item)"
          >
            <td>{{ item.id }}</td>
            <td class="title-cell">{{ item.title }}</td>
            <td>{{ item.writer }}</td>
            <td>{{ item.date }}</td>
            <td>{{item.viewCount}}</td>
          </tr>
          <!-- 검색 결과가 없을 경우 -->
          <tr v-if="paginatedNotices.length === 0">
            <td colspan="4" class="empty">검색 결과가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 하단 페이지네이션 -->
    <PaginationButton
        v-model:currentPage="currentPage"
        :totalPages="totalPages"
        class="mt-20"
    />
  </div>
</template>

<style scoped>
/* 전체 페이지 레이아웃 및 패딩 설정 */
.notice-page {
  width: 90%;
  padding: 30px 50px;
  margin: 0 auto;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-left: 10px;
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
  color: #0094f6;
  transition: 0.2s;
}

.back-btn:hover {
  box-shadow: 0 6px 18px rgba(0, 148, 246, 0.3);
  transform: translateY(-2px);
}

.title {
  font-size: 22px;
  font-weight: 700;
}
/*========================================*/
/* 검색 바 */
.search-wrapper {
  width: 400px;
  margin-bottom: 20px;
}
/*========================================*/
/* 공지사항 테이블 전체 스타일 */
.table-wrapper {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 148, 246, 0.15);
}

.notice-table {
  width: 100%;
  background: white;
  border-radius: 10px;
  border-collapse: collapse;
}
/* 테이블 헤더 스타일 */
.notice-table th {
  background: #eef7ff;
  padding: 14px;
  font-size: 14px;
  text-align: center;
}
/* 테이블 셀 공통 스타일 */
.notice-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
/*========================================*/
/* 공지 한 줄에 hover 및 클릭 가능 효과 */
.row {
  cursor: pointer;
  transition: 0.2s;
}
.row:hover {
  background: #f7fbff;
}
/*========================================*/
/* 제목 열만 왼쪽 정렬 + padding */
.title-cell {
  text-align: left;
  padding-left: 20px;
}

/* 검색 결과 없을 때 표시 메시지 */
.empty {
  padding: 40px;
  text-align: center;
  color: #888;
}
.mt-20 {
  margin-top: 20px;
}
</style>