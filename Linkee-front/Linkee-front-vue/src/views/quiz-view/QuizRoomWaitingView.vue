<template>
  <div class="waiting-room">

    <!-- 🔹 상단 제목 + 태그 -->
    <div class="top-header">
      <p class="title">{{ roomInfo.title }}</p>
      <div class="tag-area">
        <span class="tag">{{ roomInfo.category }}</span>
        <span class="tag">{{ roomInfo.problemCount }}문제</span>
        <span class="tag">{{ roomInfo.current }}/{{ roomInfo.max }}</span>
      </div>
    </div>

    <!-- 🔹 버튼 영역 -->
    <div class="button-area">
      <BaseButton color="white" size="medium" @click="leaveRoom">나가기</BaseButton>

      <BaseButton
          v-if="myInfo.isLeader"
          color="orange"
          size="medium"
          :disabled="!allReady"
          @click="startGame">
        게임시작
      </BaseButton>

      <BaseButton
          v-else
          color="orange"
          size="medium"
          @click="toggleReady">
        {{ myInfo.isReady ? '준비완료' : '준비' }}
      </BaseButton>

      <BaseButton color="blue" size="medium" @click="openInviteModal">초대</BaseButton>
    </div>

    <!-- 🔹 유저 및 빈 슬롯 카드 -->
    <div class="card-container">
      <!-- 1줄 3칸 -->
      <div class="row">
        <div
            v-for="slot in 3"
            :key="'row1-' + slot"
            class="card-wrapper">
          <QuizWaitingRoomUserCard
              v-if="users[slot - 1]"
              :user="users[slot - 1]" />
          <img v-else src="@/assets/대기실 X.svg" alt="empty" class="slot-card" />
        </div>
      </div>

      <!-- 2줄 2칸 -->
      <div class="row">
        <div
            v-for="slot in 2"
            :key="'row2-' + slot"
            class="card-wrapper">
          <QuizWaitingRoomUserCard
              v-if="users[slot + 2]"
              :user="users[slot + 2]" />
          <img v-else src="@/assets/대기실 X.svg" alt="empty" class="slot-card" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import QuizWaitingRoomUserCard from '@/components/quiz/QuizWaitingRoomUserCard.vue'

/* 예시 데이터 */
const roomInfo = ref({
  title: '나를 죽이지 못하는 고통은 나를 더 강하게 만든다.',
  category: 'DB',
  problemCount: 5,
  current: 2,
  max: 5
})

/* 최소한의 상태만 유지 */
const myInfo = ref({
  id: 2,
  isReady: false,
  isLeader: false
})

const users = ref([
  { id: 1, nickname: '김이진123', grade: 'BRONZE', status: 'WAIT', isLeader: true },
  { id: 2, nickname: '명지니어스33', grade: 'SILVER', status: 'WAIT', isLeader: false }
])

const allReady = computed(() => users.value.every(u => u.status === 'READY'))

function toggleReady() {
  myInfo.value.isReady = !myInfo.value.isReady
  const user = users.value.find(u => u.id === myInfo.value.id)
  if (user) user.status = myInfo.value.isReady ? 'READY' : 'WAIT'
}

function startGame() { console.log('게임 시작') }
function leaveRoom() { console.log('나가기') }
function openInviteModal() { console.log('초대') }
</script>

<style scoped>
/* 🔹 전체 레이아웃 */
.waiting-room {
  background: #D9EBF5;
  padding: 5px 0 30px 0;
  text-align: center;
  min-height: calc(100vh - 90px); /* 상단 네비 높이 고려 */
}

/* 🔹 상단 제목 + 태그 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #79B9FD;
  height: 55px;
  padding: 10px 30px;
  border-radius: 10px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.tag-area {
  display: flex;
  gap: 6px;
}

.tag {
  border: 2px solid #0094FF;
  padding: 3px 10px;
  border-radius: 10px;
  background: white;
  font-size: 13px;
}

/* 🔹 버튼 영역 */
.button-area {
  margin: 10px 0 20px 0;
}

/* 🔹 카드 컨테이너 */
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px; /* 줄 사이 간격 */
  margin-top: 12px;
}

.row {
  display: flex;
  justify-content: center;
  gap: 18px;
}

.card-wrapper {
  width: 220px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-card {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.35;
}
</style>
