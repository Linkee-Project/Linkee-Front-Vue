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
        <SearchForm v-model="keyword" @search="handleSearch" />
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
        <BaseInput v-model="newRoom.title" type="text" placeholder="방 제목 입력" />
      </label>
      <label>
        비밀번호 (선택)
        <BaseInput v-model="newRoom.password" type="password" placeholder="비밀번호" />
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
import { ref, computed, reactive } from "vue";
import BaseButton from "@/components/base/button/BaseButton.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import PaginationButton from "@/components/base/button/PaginationButton.vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";
import BaseInput from "@/components/base/input/BaseInput.vue";

const keyword = ref("");
const page = ref(1);
const pageSize = 12;
const isModalOpen = ref(false);

const categories = ref([
  { id: null, name: "ALL" },
  { id: 1, name: "카테고리1" },
  { id: 2, name: "카테고리2" },
  { id: 3, name: "카테고리3" },
  { id: 4, name: "카테고리4" },
  { id: 5, name: "카테고리5" },
]);

const selectedCategory = ref(null);

const rooms = ref([
  { id: 32, title: "너 자신을 알라딘", memberCount: 4, maxMemberCount: 5, categoryId: 1, categoryName: "카테고리" },
  ...Array.from({ length: 20 }).map((_, idx) => ({
    id: idx + 1,
    title: "방제목",
    memberCount: 3,
    maxMemberCount: 5,
    categoryId: (idx % 5) + 1,
    categoryName: "카테고리",
  })),
]);

const newRoom = reactive({ title: "", password: "", categoryId: null });

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

  const category = categories.value.find(c => c.id === newRoom.categoryId) || { name: "ALL" };
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
.free-board {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px); /* 화면 높이 채우기 */
}

.free-board-header {
  padding: 5px 10px;
  background: #7dbef2;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.free-board-header h5 {
  margin: 3px 0;
  font-weight: 900;
}

.free-board-header p {
  margin: 3px 0;
  font-size: 11px;
  font-weight: bold;
  color: white;
}

.free-board-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background: #f7f7f7;
  gap: 24px;
  padding: 24px 32px 40px;
}


/* 카테고리 영역 */
.free-board__category {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
}

.free-board__category-btn {
  min-width: 140px;
  height: 97px;
}


/* 검색 영역 */
.free-board__search {
  display: flex;
  background: #ffffff;
  margin-left: -32px;
  margin-right: -32px;
  padding-left: 32px; /* 선택: 내부 여백 유지하고 싶으면 추가 */
  padding-right: 32px;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.free-board__rooms-create-btn {
  height: fit-content;
}

/* 카드 리스트 */
.free-board__rooms {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4열, 각 칸 똑같이 */
  gap: 20px 24px;
  margin-top: 8px;
  grid-auto-rows: 120px; /* 모든 행 높이 동일 */
}

/* BaseButton에 얹는 카드 스타일 */
.room-card-btn {
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  justify-content: space-between;

  width: 90%;
  height: 100%; /* 행 높이에 맞게 꽉 채우기 */
  padding: 13px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7fbff, #e3f3ff);
  box-shadow: 0 12px 24px rgba(0, 148, 246, 0.12);
  cursor: pointer;
  text-align: left;
}

.room-card-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(0, 148, 246, 0.18);
}

.room-card__header {
  display: flex;
  justify-content: space-between; /* 방번호 왼쪽, 카테고리 오른쪽 */
  align-items: center;
  width: 100%;
  font-size: 11px;
  color: #7a8ca3;
}

.room-card__badge {
  min-width: 22px;
  height: 22px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 10px;
}

.room-card__category {
  font-size: 10px;
  color: #7a8ca3;
}

.room-card__title {
  margin-top: 3px;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #1c3757;
}

.room-card__footer {
  font-size: 12px;
  color: #7a8ca3;
}

.room-card-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  border-radius: 16px;
  background: #f6f8fb;
  color: #9aa8bf;
}

/* 페이지네이션 */
.free-board__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.pagination-btn,
.pagination-page {
  border: none;
  outline: none;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  background: #f0f4fa;
  color: #7688a3;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.pagination-btn:disabled {
  cursor: default;
  opacity: 0.4;
}

.pagination-page--active {
  background: #0094f6;
  color: #ffffff;
  transform: translateY(-1px);
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
  gap: 6px;          /* 버튼 간 간격 */
  margin-top: 6px;
  flex-wrap: nowrap;  /* 한 줄에 배치 */
  justify-content: space-between; /* 한 줄에 균등 배치 */
}

.modal-category-card {
  flex: 1;            /* 모든 버튼이 균등하게 너비 차지 */
  height: 50px;       /* 버튼 높이 줄임 */
  font-size: 11px;    /* 글자 크기 줄임 */
  padding: 4px 6px;   /* 안쪽 여백 조정 */
  min-width: 50px;    /* 너무 작아지지 않도록 최소 너비 */
  text-align: center;
}
</style>
