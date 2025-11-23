<template>
  <div class="free-board">
    <!-- 헤더 -->
    <div class="free-board-header">
      <h5>자율방</h5>
      <p>자유로운 주제로 같이 토론해 보아요</p>
    </div>

    <!-- 본문 -->
    <div class="free-board-body">
      <!-- 카테고리 -->
      <section class="free-board__category">
        <BaseButton
            v-for="category in categories"
            :key="category.id"
            size="large"
            color="emerald"
            class="free-board__category-btn"
            @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </BaseButton>
      </section>

      <!-- 검색 + 방 만들기 -->
      <section class="free-board__search">
        <SearchForm v-model="keyword" @search="handleSearch"/>
        <BaseButton
            size="small"
            color="orange"
            class="free-board__rooms-create-btn"
            @click="openCreateModal"
        >
          방 만들기
        </BaseButton>
      </section>

      <!-- 방 리스트 -->
      <section class="free-board__rooms">
        <BaseButton
            v-for="room in pagedRooms"
            :key="room.id"
            color="white"
            size="medium"
            class="room-card-btn"
            :disabled="room.disabled"
            @click="handleRoomClick(room)"
        >
          <div class="room-card__header">
            <span class="room-card__badge">{{ room.id }}</span>
            <span class="room-card__category">{{ room.categoryName }}</span>
          </div>
          <div class="room-card__title">{{ room.title }}</div>
          <div class="room-card__footer">
            👥 {{ room.memberCount }} / {{ room.maxMemberCount }}
          </div>
        </BaseButton>

        <div v-if="!pagedRooms.length" class="room-card-empty">
          방이 없습니다. 새로운 방을 만들어보세요!
        </div>
      </section>

      <!-- 페이지네이션 -->
      <section class="free-board__pagination">
        <PaginationButton
            v-model:currentPage="page"
            :total-pages="totalPages"
        />
      </section>
    </div>
  </div>

  <!-- 방 만들기 모달 -->
  <BaseModal v-model="isModalOpen" title="새로운 방 만들기">
    <div class="modal-form">
      <label>
        제목
        <BaseInput v-model="newRoom.title" type="text" placeholder="방 제목 입력"/>
      </label>
      <label>
        비밀번호 (선택)
        <BaseInput v-model="newRoom.password" type="password" placeholder="비밀번호"/>
      </label>

      <!-- 카테고리 카드 선택 -->
      <label>
        카테고리
        <template class="modal-category-cards">
          <BaseButton
              v-for="cat in categories.filter(c => c.id !== null)"
              :key="cat.id"
              size="small"
              :color="newRoom.categoryId === cat.id ? 'gray' : 'emerald'"
              class="modal-category-card"
              @click="newRoom.categoryId = cat.id"
          >
            {{ cat.name }}
          </BaseButton>
        </template>
      </label>
    </div>

    <template #footer>
      <BaseButton color="orange" size="small" @click="createRoom">생성</BaseButton>
      <BaseButton color="gray" size="small" @click="isModalOpen = false">취소</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import {ref, computed, reactive} from "vue";
import BaseButton from "@/components/base/button/BaseButton.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";
import BaseInput from "@/components/base/input/BaseInput.vue";
import {useRouter} from "vue-router";

const router = useRouter();
const keyword = ref("");
const page = ref(1);
const pageSize = 12;
const isModalOpen = ref(false);

const categories = ref([
  {id: null, name: "ALL"},
  {id: 1, name: "카테고리1"},
  {id: 2, name: "카테고리2"},
  {id: 3, name: "카테고리3"},
  {id: 4, name: "카테고리4"},
  {id: 5, name: "카테고리5"},
]);

const selectedCategory = ref(null);

const rooms = ref([
  {id: 32, title: "너 자신을 알라딘", memberCount: 4, maxMemberCount: 5, categoryId: 1, categoryName: "카테고리"},
  ...Array.from({length: 20}).map((_, idx) => ({
    id: idx + 1,
    title: "방제목",
    memberCount: 3,
    maxMemberCount: 5,
    categoryId: (idx % 5) + 1,
    categoryName: "카테고리",
  })),
]);

const newRoom = reactive({title: "", password: "", categoryId: null});

// --- 클릭 이벤트 핸들러 ---
const selectCategory = (id) => {
  selectedCategory.value = id;
  page.value = 1;
};

const openCreateModal = () => {
  newRoom.title = "";
  newRoom.password = "";
  newRoom.categoryId = null;
  isModalOpen.value = true;
};

const createRoom = () => {
  if (!newRoom.title.trim()) {
    alert("방 제목을 입력해주세요");
    return;
  }
  if (newRoom.categoryId === null) {
    alert("카테고리를 선택해주세요");
    return;
  }

  const category = categories.value.find(c => c.id === newRoom.categoryId) || {name: "ALL"};
  const id = rooms.value.length ? Math.max(...rooms.value.map(r => r.id)) + 1 : 1;

  rooms.value.unshift({
    id,
    title: newRoom.title,
    memberCount: 1,
    maxMemberCount: 5,
    categoryId: newRoom.categoryId,
    categoryName: category.name,
    password: newRoom.password || null,
  });

  newRoom.title = "";
  newRoom.password = "";
  newRoom.categoryId = null;
  isModalOpen.value = false;
  page.value = 1;
};


const handleRoomClick = (room) => {
  console.log("방 클릭", room);
  router.push({
    name: "ChatGameRoom",
    params: { roomId: room.id },
    query: { title: room.title }
  });
};

const handleSearch = (value) => {
  keyword.value = value;
  page.value = 1;
};

// --- 필터 + 페이지네이션 ---
const filteredRooms = computed(() => {
  const normalize = str => str.replace(/\s+/g, "").toLowerCase();
  const kw = normalize(keyword.value);
  return rooms.value.filter(room => {
    const title = normalize(room.title);
    const matchKeyword = !kw || title.includes(kw);
    const matchCategory = !selectedCategory.value || room.categoryId === selectedCategory.value;
    return matchKeyword && matchCategory;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRooms.value.length / pageSize)));

const pagedRooms = computed(() => {
  if (page.value > totalPages.value) page.value = totalPages.value;
  const start = (page.value - 1) * pageSize;
  return filteredRooms.value.slice(start, start + pageSize);
});
</script>

<style scoped>
/* 전체 페이지 (레이아웃 안에서 공간 채움) */
.free-board-header {
  padding: 0 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background: #7DBEF2;
}

.free-board-header h5 {
  font-weight: 900;
  margin: 8px 0;
}

.free-board-header p {
  font-size: 11px;
  font-weight: bold;
  color: white;
  margin: 8px 0;
}

.free-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 본문(전체 스크롤 담당) */

.free-board-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  gap: 24px;
  padding: 24px 32px 20px;

  overflow-y: auto;
  overflow-x: hidden;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

/* 방 리스트 */
.free-board__rooms {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 24px;
  margin-top: 8px;
  flex: none;
  overflow: visible;
}

/* 방 카드 */
.room-card-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;
  padding: 13px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7fbff, #e3f3ff);
  box-shadow: 0 12px 24px rgba(0, 148, 246, 0.12);
}

.room-card__header {
  display: flex;
  justify-content: space-between; /* 좌우 배치 */
  align-items: center;
  width: 100%;
  font-size: 11px;
  padding-bottom: 5px;
  color: #7a8ca3;
}

.room-card__title {
  margin-top: 6px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #1c3757;
  padding-bottom: 5px;
  text-align: center;
}

.room-card__footer {
  font-size: 12px;
  color: #7a8ca3;
  text-align: center;
  padding-bottom: 5px;
}

.free-board__category {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 12px;

  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;

  scrollbar-width: thin;
}

/* 카테고리 버튼 크기 줄여서 한 줄 정렬 적합 */
.free-board__category-btn {
  min-width: 120px;
  height: 80px;
  flex-shrink: 0; /* 🔥 절대 줄어들지 않게 */
}


/* 검색 영역 - 완전 한 줄 */
.free-board__search {
  display: flex;
  flex-direction: row; /* 무조건 한 줄 */
  align-items: center;
  justify-content: space-between;

  background: #ffffff;

  margin-left: -32px;
  margin-right: -32px;
  padding: 8px 32px;
  gap: 12px;
}

/* 검색 input 크기 줄어들도록 설정 */
.free-board__search :deep(.search-form) {
  min-width: 150px;
}

.free-board__rooms-create-btn {
  flex-shrink: 0;
}

/* 페이지네이션 고정 (스크롤해도 따라 내려가지 않도록) */
.free-board__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  flex-shrink: 0;
  padding-bottom: 8px;
  margin-top: 20px;
}


/* 모달 관련 스타일 */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
}


.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #1c3757;
  width: 100%; /* 전체 폭 차지 */
  gap: 4px;
}

.modal-form input,
.modal-form select,
.modal-category-cards {
  width: 100%; /* 부모 label 폭에 맞춤 */
  box-sizing: border-box; /* padding 포함 폭 계산 */
}


.modal-category-cards {
  display: flex;
  gap: 6px; /* 버튼 간 간격 */
  margin-top: 6px;
  flex-wrap: nowrap; /* 한 줄에 배치 */
  justify-content: space-between; /* 한 줄에 균등 배치 */
}

.modal-category-card {
  flex: 1; /* 모든 버튼이 균등하게 너비 차지 */
  height: 50px; /* 버튼 높이 줄임 */
  font-size: 11px; /* 글자 크기 줄임 */
  padding: 4px 6px; /* 안쪽 여백 조정 */
  min-width: 50px; /* 너무 작아지지 않도록 최소 너비 */
  text-align: center;
}
</style>
