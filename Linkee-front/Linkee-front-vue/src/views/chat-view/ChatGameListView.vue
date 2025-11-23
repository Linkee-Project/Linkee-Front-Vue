<!-- views/FreeBoard.vue -->
<template>
  <div class="free-board">
    <!-- 상단 카테고리 영역 -->
    <section class="free-board__category">
      <BaseButton
          v-for="category in categories"
          :key="category.id"
          size="large"
          color="emerald"
          class="free-board__category-btn"
          @click="selectedCategory = category.id"
      >
        {{ category.name }}
      </BaseButton>

      <BaseButton
          size="small"
          color="orange"
          class="free-board__category-create-btn"
      >
        방 만들기
      </BaseButton>
    </section>

    <!-- 검색 영역 -->
    <section class="free-board__search">
      <SearchForm
          v-model="keyword"
          @search="handleSearch"
        />
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
        <div class="room-card__title">
          {{ room.title }}
        </div>
        <div class="room-card__footer">
          <span>👥 {{ room.memberCount }} / {{ room.maxMemberCount }}</span>
        </div>
      </BaseButton>

      <!-- 데이터 없을 때 -->
      <div
          v-if="!pagedRooms.length"
          class="room-card-empty"
      >
        방이 없습니다. 새로운 방을 만들어보세요!
      </div>
    </section>

    <!-- 페이지네이션 -->
    <section class="free-board__pagination">
      <button
          class="pagination-btn"
          :disabled="page === 1"
          @click="page--"
      >
        ‹
      </button>

      <button
          v-for="p in totalPages"
          :key="p"
          class="pagination-page"
          :class="{ 'pagination-page--active': p === page }"
          @click="page = p"
      >
        {{ p }}
      </button>

      <button
          class="pagination-btn"
          :disabled="page === totalPages"
          @click="page++"
      >
        ›
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseButton from '@/components/base/button/BaseButton.vue';
import SearchForm from '@/components/base/form/SearchForm.vue';

const keyword = ref('');
const page = ref(1);
const pageSize = 12;

const categories = ref([
  { id: 1, name: '카테고리1' },
  { id: 2, name: '카테고리2' },
  { id: 3, name: '카테고리3' },
  { id: 4, name: '카테고리4' },
  { id: 5, name: '카테고리5' },
]);

const selectedCategory = ref(null);

// 테스트용 방 리스트
const rooms = ref([
  {
    id: 32,
    title: '너 자신을 알라딘',
    memberCount: 4,
    maxMemberCount: 5,
    categoryId: 1,
    categoryName: '카테고리',
  },
  ...Array.from({ length: 20 }).map((_, idx) => ({
    id: idx + 1,
    title: '방제목',
    memberCount: 3,
    maxMemberCount: 5,
    categoryId: (idx % 5) + 1,
    categoryName: '카테고리',
  })),
]);

// 검색 + 카테고리 필터 적용된 방들
const filteredRooms = computed(() => {
  const normalize = str => str.replace(/\s+/g, '').toLowerCase();
  const kw = normalize(keyword.value);

  return rooms.value.filter((room) => {
    const title = normalize(room.title);
    const matchKeyword = !kw || title.includes(kw);
    const matchCategory = !selectedCategory.value || room.categoryId === selectedCategory.value;
    return matchKeyword && matchCategory;
  });
});

// 페이지네이션 계산
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRooms.value.length / pageSize)),
);

const pagedRooms = computed(() => {
  if (page.value > totalPages.value) {
    page.value = totalPages.value;
  }
  const start = (page.value - 1) * pageSize;
  return filteredRooms.value.slice(start, start + pageSize);
});

// 검색 , 초기화 핸들러
const handleSearch = (value) => {
  keyword.value = value;
  page.value = 1;
};




// 방 카드 클릭
const handleRoomClick = (room) => {
  console.log('방 클릭', room);

};
</script>

<style scoped>
.free-board {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px 40px;
}

/* 카테고리 영역 */
.free-board__category {
  display: flex;
  align-items: center;
  gap: 16px;
}

.free-board__category-btn {
  min-width: 120px;
  height: 90px;
}

.free-board__category-create-btn {
  margin-left: auto;
}

/* 검색 영역 */
.free-board__search {
  margin-top: 4px;
}

/* 카드 리스트 */
.free-board__rooms {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px 24px;
  margin-top: 8px;
}

/* BaseButton에 얹는 카드 스타일 */
.room-card-btn {
  width: 100%;
  border-radius: 16px;
  padding: 16px 18px;
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
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #7a8ca3;
}

.room-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ffffffaa;
  font-weight: 600;
}

.room-card__category {
  font-size: 10px;
}

.room-card__title {
  margin-top: 18px;
  font-size: 15px;
  font-weight: 600;
  color: #1c3757;
}

.room-card__footer {
  margin-top: 18px;
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
</style>
