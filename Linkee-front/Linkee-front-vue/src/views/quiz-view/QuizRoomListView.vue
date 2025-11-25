<template>
  <div class="quiz-room">

    <section class="quiz-room__top-bar">
      <div class="quiz-room__title">
        <strong>퀴즈방</strong>
        <br>
        <span>CS 지식 배틀</span>
      </div>
      <div class="quiz-room__actions">
        <BaseButton class="btn-start">빠른 시작</BaseButton>
        <BaseButton class="btn-create" @click="openCreateModal">방 만들기</BaseButton>
      </div>
    </section>

    <div class="quiz-room__content">

      <section class="quiz-room__category">
        <BaseButton
            v-for="category in categories"
            :key="category.id"
            size="large"
            class="quiz-room__category-btn"
            @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </BaseButton>
      </section>

      <section class="quiz-room__search">
        <div class="search-bar">
          <i class="icon">🔍</i>
          <input
              type="text"
              placeholder="검색어를 입력해주세요"
              v-model="keyword"
              @keyup.enter="handleSearch"
          />
        </div>
      </section>

      <section class="quiz-room__rooms">
        <BaseButton
            v-for="room in pagedRooms"
            :key="room.id"
            class="room-card-btn"
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
            👥 {{ room.memberCount }} / {{ room.maxMemberCount }}
          </div>
        </BaseButton>

        <div v-if="!pagedRooms.length" class="room-card-empty">
          현재 참여 가능한 퀴즈방이 없습니다.
        </div>
      </section>

      <section class="quiz-room__pagination">
        <PaginationButton v-model:currentPage="page" :total-pages="totalPages" />
      </section>
    </div>
  </div>

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

      <label>
        카테고리
        <div class="modal-category-cards">
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
        </div>
      </label>
    </div>

    <template #footer>
      <BaseButton color="orange" size="small" @click="createRoom">생성</BaseButton>
      <BaseButton color="gray" size="small" @click="isModalOpen = false">취소</BaseButton>
    </template>
  </BaseModal>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchQuizRooms, quickStart } from '@/api/quizRoomApi'

import BaseButton from '@/components/base/button/BaseButton.vue'
import PaginationButton from '@/components/base/button/PaginationButton.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import BaseInput from '@/components/base/input/BaseInput.vue'

const router = useRouter()

/* ========== 모달 상태 ========== */
const isModalOpen = ref(false)
const newRoom = ref({
  title: '',
  password: '',
  categoryId: null
})

/* ========== 검색 / 페이지 / 카테고리 ========== */
const keyword = ref('')
const page = ref(1)
const pageSize = 12
//카테고리 연동 필요 
const categories = ref([])

const selectedCategory = ref(null)

/* ========== 방 목록 (백엔드 연동) ========== */
const rooms = ref([])

/** 퀴즈방 목록 조회 */
const loadRooms = async () => {
  try {
    const pageData = await fetchQuizRooms({ page: 1, size: 50 })
    rooms.value = pageData?.content ?? []
  } catch (e) {
    console.error('퀴즈방 목록 조회 실패', e)
  }
}

onMounted(() => {
  loadRooms()
})

/* ========== 모달 열기 / 방 생성 ========= */
const openCreateModal = () => {
  newRoom.value.title = ''
  newRoom.value.password = ''
  newRoom.value.categoryId = null
  isModalOpen.value = true
}

const createRoom = () => {
  if (!newRoom.value.title.trim()) {
    alert('방 제목을 입력해주세요')
    return
  }
  if (newRoom.value.categoryId === null) {
    alert('카테고리를 선택해주세요')
    return
  }

  console.log('생성된 방:', newRoom.value) // 추후 백엔드 연동 예정
  isModalOpen.value = false
}

/* ========== 필터 + 프론트 페이징 ========== */
const filteredRooms = computed(() => {
  const normalize = str => str.replace(/\s+/g, '').toLowerCase()
  const kw = normalize(keyword.value)

  return rooms.value.filter(r => {
    const matchKeyword = !kw || normalize(r.title).includes(kw)
    const matchCategory =
        !selectedCategory.value || r.categoryId === selectedCategory.value
    return matchKeyword && matchCategory
  })
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRooms.value.length / pageSize))
)

const pagedRooms = computed(() => {
  if (page.value > totalPages.value) page.value = totalPages.value
  const start = (page.value - 1) * pageSize
  return filteredRooms.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  page.value = 1
}

/* ========== 방 클릭 시 대기방 이동 ========== */
const handleRoomClick = room => {
  router.push({
    path: '/quiz/rooms/waiting',
    query: {
      roomId: room.id,
      title: room.title
    }
  })
}

/* ========== 빠른 시작 ========== */
const handleQuickStart = async () => {
  try {
    const room = await quickStart()
    router.push({
      path: '/quiz/rooms/waiting',
      query: {
        roomId: room.id,
        title: room.title
      }
    })
  } catch (e) {
    alert('참여 가능한 방이 없습니다.')
  }
}
</script>


<style scoped>
.quiz-room {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  background: linear-gradient(to bottom, #bfe2f2 0%, #d4edf9 70%);
}


/* ====================== 상단 파란바 ======================= */
.quiz-room__top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 65px;
  padding: 0 60px;
  background: #7DBEF2;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}
.quiz-room__title strong {
  color: #000000; /* 퀴즈방 */
}

.quiz-room__title span {
  color: #ffffff; /* CS 지식 배틀 */
}

.quiz-room__actions .btn-start,
.quiz-room__actions .btn-create {
  background: #FF9A62 !important;
  color: white !important;
  height: 32px;
  padding: 0 18px;
  font-size: 14px;
  border-radius: 18px;
  margin-right: 8px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.1);
}

.quiz-room__actions .btn-create {
  margin-right: 0;
}

/* ====================== 콘텐츠 ======================= */
.quiz-room__content {
  width: 100%;                 /* 화면 크기 따라 줄어듬 */
  max-width: 1200px;           /* 큰 화면에서는 제한 */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 4vw, 40px);
}

/* ====================== 카테고리 버튼 ======================= */
.quiz-room__category {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.quiz-room__category-btn {
  flex: 1 1 200px;  /* 고정 width 제거 → 공간 따라 늘어남 */
  min-width: 140px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(90deg, #4DD0E1 0%, #00BCD4 100%);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* flex-shrink: 0 제거 */
}

.quiz-room__category-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 24px rgba(0, 145, 246, 0.2);
}

/* ====================== 검색창 ======================= */
.quiz-room__search {
  display: flex;
  justify-content: center;
}

.search-bar {
  width: 100%;
  max-width: 980px;
  height: 50px;
  padding: 0 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.icon {
  font-size: 18px;
  margin-right: 10px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: none;
  color: #606060;
}

/* ====================== 카드 리스트 ======================= */
.quiz-room__rooms {
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr)); /* 카드 최소 크기 200px */
  gap: clamp(16px, 3vw, 32px);
  padding: 0 clamp(10px, 4vw, 40px);
}

.room-card-btn {
  width: 100%;
  min-height: 130px;
  min-width: 160px;
  background: linear-gradient(180deg, #F9FBFF 0%, #D9EFFF 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.room-card-btn:hover {
  transform: translateY(-6px);
  box-shadow: 0px 12px 24px rgba(27, 134, 248, 0.3);
}

.room-card__header {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  color: #737d89;
}

.room-card__badge {
  width: 20px;
  height: 20px;
  font-size: 12px;
  background: white;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-card__title {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.4;
}

.room-card__footer {
  margin-top: 8px;
  font-size: 13px;
  color: #647992;
}

.room-card-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: #f6f8fb;
  border-radius: 16px;
  color: #9aa8bf;
}


/* ====================== 반응형 (개선) ======================= */

/* 기본: auto-fill + minmax 로 자연스럽게 */
.quiz-room__rooms {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

@media (max-width: 1200px) {
  .quiz-room__rooms {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}


/* 992px 이하 (태블릿): 카드 최소너비만 줄이도록 조정 */
@media (max-width: 992px) {
  .quiz-room__rooms {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 0 20px;
  }

  .quiz-room__top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    height: auto;
    padding: 10px 20px;
  }

  .quiz-room__category {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
}

/* 768px 이하 (모바일 초기): 약간 압축, 완전 1열 강제하지 않음 */
@media (max-width: 768px) {
  .quiz-room {
    padding: 0 12px;
  }

  .quiz-room__rooms {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  .quiz-room__actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

/* 480px 이하 (작은 모바일): 이때만 확실히 1열 적용 */
@media (max-width: 480px) {
  .quiz-room__rooms {
    grid-template-columns: 1fr;
  }

  .quiz-room__category-btn {
    width: 100%;
    height: 55px;
  }
}
/* ====== 모달 내부 스타일 (자율방 기준 적용) ====== */
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
  width: 100%;
  gap: 4px;
}

.modal-form input,
.modal-form select,
.modal-category-cards {
  width: 100%;
  box-sizing: border-box;
}

/* 카테고리 버튼 그룹 */
.modal-category-cards {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: nowrap;
  justify-content: space-between;
}

/* 버튼의 크기 제어 */
.modal-category-card {
  flex: 1;
  height: 50px;
  font-size: 11px;
  padding: 4px 6px;
  min-width: 50px;
  text-align: center;
}


</style>