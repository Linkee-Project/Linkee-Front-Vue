<template>
  <div class="quiz-room">

    <!-- 상단 파란바 -->
    <section class="quiz-room__top-bar">
      <div class="quiz-room__title">
        <strong>퀴즈방</strong>
        <br>
        <span>CS 지식 배틀</span>
      </div>
      <div class="quiz-room__actions">
        <!-- ✅ 빠른 시작 버튼에 클릭 이벤트 연결 -->
        <BaseButton class="btn-start" @click="handleQuickStart">빠른 시작</BaseButton>
        <BaseButton class="btn-create" @click="openCreateModal">방 만들기</BaseButton>
      </div>
    </section>

    <div class="quiz-room__content">

      <!-- 카테고리 버튼 영역 -->
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

      <!-- 검색 창 -->
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

      <!-- 퀴즈방 카드 목록 -->
      <section class="quiz-room__rooms">
        <BaseButton
            v-for="room in rooms"
        :key="room.id"
        :room="room"
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

        <div v-if="!rooms.length" class="room-card-empty">
          현재 참여 가능한 퀴즈방이 없습니다.
        </div>
      </section>

      <!-- 페이지네이션 -->
      <section class="quiz-room__pagination">
        <!-- ✅ currentPage 가 바뀌면 watch(page) 에서 다시 loadQuizRooms() 실행 -->
        <PaginationButton v-model:currentPage="page" :total-pages="totalPages" />
      </section>
    </div>
  </div>

  <!-- 방 생성 모달 -->
  <BaseModal v-model="isModalOpen" title="새로운 방 만들기">
    <div class="modal-form">

      <!-- 제목 -->
      <div class="modal-row">
        <p class="modal-label">제목</p>
        <BaseInput
            v-model="newRoom.roomTitle"
            type="text"
            placeholder="방 제목 입력"
        />
      </div>

      <!-- 정원 (±, 최대 5명) -->
      <div class="modal-row">
        <p class="modal-label">정원</p>
        <div class="capacity-control">
          <BaseButton
              size="small"
              color="white"
              class="capacity-btn"
              @click="changeCapacity(-1)"
          >
            -
          </BaseButton>

          <span class="capacity-text">
            {{ newRoom.roomCapacity }}명
          </span>

          <BaseButton
              size="small"
              color="white"
              class="capacity-btn"
              @click="changeCapacity(1)"
          >
            +
          </BaseButton>
        </div>
      </div>

      <!-- 문제 수 -->
      <div class="modal-row">
        <p class="modal-label">문제 수</p>
        <BaseInput
            v-model.number="newRoom.roomQuizLimit"
            type="number"
            min="1"
            placeholder="예) 10"
        />
      </div>

      <!-- 모드 (드롭다운) -->
      <div class="modal-row">
        <p class="modal-label">모드</p>
        <select
            v-model="newRoom.roomMode"
            class="modal-select"
        >
          <option value="S">싱글</option>
          <option value="G">그룹</option>
        </select>
      </div>

      <!-- 공개 여부 (드롭다운) -->
      <div class="modal-row">
        <p class="modal-label">공개 여부</p>
        <select
            :value="newRoom.isPrivate"
            class="modal-select"
            @change="setPrivate($event.target.value)"
        >
          <option value="N">공개</option>
          <option value="Y">비공개</option>
        </select>
      </div>

      <!-- 비밀번호 (비공개일 때만) -->
      <div
          v-if="newRoom.isPrivate === 'Y'"
          class="modal-row"
      >
        <p class="modal-label">비밀번호</p>
        <BaseInput
            v-model="newRoom.roomCode"
            type="password"
            placeholder="입장 비밀번호"
        />
      </div>

      <!-- 카테고리 -->
      <div class="modal-row">
        <p class="modal-label">카테고리</p>
        <div class="modal-category-cards">
          <BaseButton
              v-for="cat in categories.filter(c => c.id !== null)"
              :key="cat.id"
              size="large"
              :color="newRoom.categoryId === cat.id ? 'gray' : 'emerald'"
              class="modal-category-card"
              @click="newRoom.categoryId = cat.id"
          >
            {{ cat.name }}
          </BaseButton>
        </div>
      </div>

    </div>

    <template #footer>
      <BaseButton color="orange" size="small" @click="createRoom">생성</BaseButton>
      <BaseButton color="gray" size="small" @click="isModalOpen = false">취소</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchQuizRooms, quickStart, joinQuizRoom, createQuizRoom } from '@/api/quizRoomApi'
import api from '@/api/axios'

import BaseButton from '@/components/base/button/BaseButton.vue'
import PaginationButton from '@/components/base/button/PaginationButton.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import BaseInput from '@/components/base/input/BaseInput.vue'

const router = useRouter()

/* =========================================================
   1. 모달 상태
   - NEW_ROOM_DEFAULT 로 초기 상태 정의
   - 모달 열 때마다 리셋해서 이전 값이 남지 않게 함
========================================================= */
const isModalOpen = ref(false)

const NEW_ROOM_DEFAULT = {
  roomTitle: '',
  roomCapacity: 2,
  roomQuizLimit: 10,
  roomMode: 'G',
  isPrivate: 'N',
  roomCode: '',
  categoryId: null,
}

const newRoom = ref({ ...NEW_ROOM_DEFAULT })

const openCreateModal = () => {
  newRoom.value = { ...NEW_ROOM_DEFAULT }
  isModalOpen.value = true
}

/* 방 생성 */
const createRoom = async () => {
  // ✅ 최소한의 필수값 검증
  if (!newRoom.value.roomTitle.trim()) return alert('방 제목을 입력해주세요.')
  if (!newRoom.value.roomCapacity || newRoom.value.roomCapacity <= 0) return alert('정원을 입력해주세요.')
  if (!newRoom.value.roomQuizLimit || newRoom.value.roomQuizLimit <= 0) return alert('문제 수를 입력해주세요.')
  if (newRoom.value.categoryId === null) return alert('카테고리를 선택해주세요.')
  if (newRoom.value.isPrivate === 'Y' && !newRoom.value.roomCode.trim()) {
    return alert('비공개 방은 비밀번호를 입력해야 합니다.')
  }

  const payload = {
    categoryId: newRoom.value.categoryId,
    roomTitle: newRoom.value.roomTitle.trim(),
    roomMode: newRoom.value.roomMode,
    isPrivate: newRoom.value.isPrivate,
    roomQuizLimit: Number(newRoom.value.roomQuizLimit),
    roomCapacity: Number(newRoom.value.roomCapacity),
    roomCode: newRoom.value.isPrivate === 'Y' ? newRoom.value.roomCode : null,
  }

  try {
    const quizRoomId = await createQuizRoom(payload)

    isModalOpen.value = false

    // 방 생성 후 바로 대기실로 이동
    // 상세 정보는 대기실 진입 시 백엔드에서 다시 조회
    router.push({
      name: 'QuizRoomWaiting',
      params: { quizRoomId },
    })

  } catch (e) {
    console.error('방 생성 실패', e)
    alert('방 생성에 실패했습니다.')
  }
}

/* 정원 증감 (1~5 제한) */
const changeCapacity = (delta) => {
  const next = newRoom.value.roomCapacity + delta
  if (next < 1 || next > 5) return
  newRoom.value.roomCapacity = next
}

/* 공개 여부 토글 */
const setPrivate = (flag) => {
  newRoom.value.isPrivate = flag
  if (flag === 'N') {
    newRoom.value.roomCode = ''
  }
}

/* =========================================================
   2. 카테고리
========================================================= */
const categories = ref([{ id: null, name: '전체' }])
const selectedCategory = ref(null) // null = 전체

const loadCategories = async () => {
  try {
    const res = await api.get('/question/categories')
    const list = res.data

    categories.value = [
      { id: null, name: '전체' },
      ...list.map(c => ({
        id: c.categoryId,
        name: c.categoryName,
      })),
    ]
  } catch (e) {
    console.error('카테고리 조회 실패', e)
  }
}

/* =========================================================
   3. 방 목록 + 백엔드 페이지네이션
========================================================= */
const rooms = ref([])
const page = ref(1)
const pageSize = 12
const totalPages = ref(1)
const keyword = ref('')

const loadQuizRooms = async () => {
  try {
    // ✅ page, keyword, categoryId 모두 백엔드로 전달
    const result = await fetchQuizRooms({
      page: page.value,
      size: pageSize,
      keyword: keyword.value || null,
      categoryId: selectedCategory.value,
    })

    const content = result.content || []


    rooms.value = content.map(r => ({
      id: r.quizRoomId,
      title: r.roomTitle,
      memberCount: r.joinedCount,
      maxMemberCount: r.roomCapacity,
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      isPrivate: r.isPrivate,
    }))

    // ✅ totalPages 는 PageResponse 의 값 활용
    totalPages.value = result.totalPages ?? 1
  } catch (e) {
    console.error('퀴즈방 조회 실패:', e)
    alert('방 목록을 불러오지 못했습니다.')
  }
}

/* ✅ 페이지가 바뀔 때마다 해당 page 로 다시 조회 */
watch(page, () => {
  loadQuizRooms()
})

/* ✅ 카테고리가 바뀌면 1페이지로 리셋 후 다시 조회 */
watch(selectedCategory, () => {
  page.value = 1
  loadQuizRooms()
})

/* 검색 엔터 → 1페이지에서 다시 조회 */
const handleSearch = () => {
  page.value = 1
  loadQuizRooms()
}

/* =========================================================
   4. 방 입장 / 빠른 시작
========================================================= */

/* 방 카드 클릭 → 먼저 join API, 그 다음 대기실로 이동 */
const handleRoomClick = async (room) => {
  try {
    await joinQuizRoom(room.id)

    router.push({
      name: 'QuizRoomWaiting',
      params: { quizRoomId: room.id },
    })
  } catch (e) {
    console.error('방 입장 실패', e)
    alert('방 입장에 실패했습니다.')
  }
}

/* 빠른 시작 → 백엔드에서 적절한 방 선택 후 그 방으로 이동 */
const handleQuickStart = async () => {
  try {
    const room = await quickStart()

    router.push({
      name: 'QuizRoomWaiting',
      params: { quizRoomId: room.id },
    })
  } catch (e) {
    alert('참여 가능한 방이 없습니다.')
  }
}

/* 초기 진입 시: 목록 + 카테고리 조회 */
onMounted(() => {
  loadQuizRooms()
  loadCategories()
})
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

/* === 퀴즈방 페이지에서만 BaseModal 크기 조절 === */
:deep(.modal-content) {
  width: 720px;       /* 기본 400px → 넓게 */
  max-width: 90vw;
  max-height: 80vh;
}

:deep(.modal-body) {
  padding: 20px 32px 16px;  /* 안쪽 여백 조금 넉넉하게 */
  max-height: 70vh;
  overflow-y: auto;         /* 내용 많으면 body만 스크롤 */
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

/* ====== 모달 내부 스타일 ====== */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.modal-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.modal-label {
  font-size: 14px;
  font-weight: 600;
  color: #1c3757;
}

/* 정원 컨트롤 */
.capacity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.capacity-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
}

.capacity-text {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}
.modal-select {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d0d7e2;
  padding: 0 10px;
  font-size: 14px;
  background-color: #ffffff;
  box-sizing: border-box;
}


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