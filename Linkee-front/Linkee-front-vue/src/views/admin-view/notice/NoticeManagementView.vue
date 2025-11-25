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
          <td>{{ item.displayId }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.admin }}</td>
          <td>{{ item.reg }}</td>
          <td>{{ item.mod }}</td>
          <td>{{ item.views }}</td>
          <td>{{ item.active }}</td>
          <td class="manage-btn">
            <button class="btn-small" @click="goDetail(item.id)">✏️</button>
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
//ref: 반응형 값 만들기, computed: 계산된 값(의존하는 값 바뀌면 자동 갱신), onMounted:컴포넌트가 화면에 처음 랜더링 된 시점에 실행
//watch: 특정 값이 변할 때마다 어떤 함수를 실행
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseToast from "@/components/base/toast/BaseToast.vue";
import { fetchNoticeList } from "@/api/noticeApi";

const router = useRouter();
const toastRef = ref(null);

/* Api에서 받아온 목록 저장*/
const originalList = ref([]); //전체 데이터
const filteredList = ref([]); //필터 적용 데이터

/* 필터 상태 (Y / N / null) */
const currentActive = ref(null);
//페이지네이션
const currentPage = ref(1);
const pageSize = 10;
const totalElements = ref(0);


/* 공지 목록 Api 불러오기 */
const loadNotices = async () => {
  try {
    const res = await fetchNoticeList({
      page: currentPage.value - 1,
      size: pageSize,
      active: currentActive.value
    });

    console.log("API RESPONSE:", res);

    // res.content = 실제 데이터 배열
    originalList.value = res.content.map(n => ({
      id: n.noticeId,
      title: n.noticeTitle,
      admin: n.adminName,
      reg: n.createdAt,
      mod: n.updatedAt,
      views: n.noticeViews,
      active: n.isActive
    }));

    // 필터 초기화
    filteredList.value = [...originalList.value];

    // 전체 갯수
    totalElements.value = res.totalElements;

  } catch (e) {
    console.error(e);
    toastRef.value.showToast("공지사항 불러오기에 실패했습니다");
  }
};

//페이지 변경 시 자동 reload
//currentPage.value가 바뀔 때마다 loadNotices()실행
watch(() => currentPage.value, () => {
  loadNotices();
})

//첫 로딩
onMounted(() => {
  loadNotices();
});

//필터링 기능
const filterActive = (flag) => {
  filteredList.value = originalList.value.filter(item => item.active === flag);
  currentPage.value = 1;
}
const resetFilter = () => {
  filteredList.value = [...originalList.value];
  currentPage.value = 1;
};

//상세 이동 및 삭제
const goDetail = (id) => {
  router.push(`/admin/notices/${id}`);
};

//페이지네이션

const totalPages = computed(() =>
    Math.ceil(totalElements.value / pageSize)
);

//순번은 displayId로 따로 부여
//item에 index속성 추가
const paginatedList = computed(() =>
    filteredList.value.map((item, index) => ({
      ...item,
      displayId: (currentPage.value - 1) * pageSize + index + 1 // 화면용 번호(1부터 시작)
    }))
);

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
