<template>
  <div class="game-room">

    <!-- 🔵 중앙 래퍼(전체 UI 박스) -->
    <div class="chat-wrapper">

      <!-- 타이틀 영역 -->
      <header class="game-header">
        <div class="header-inner">
          <div class="header-left">
            <span class="room-number">{{ roomId }}번방</span>
            <span class="colon">:</span>
            <span class="room-title">{{ roomTitle }}</span>
          </div>

          <div class="header-right">
            👥 {{ users.length }} / {{ maxUsers }}
          </div>
        </div>
      </header>

      <!-- 전체 레이아웃 -->
      <div class="game-layout">

        <!-- 왼쪽 유저 리스트 -->
        <aside class="user-list">
          <div
              v-for="user in displayUsers"
              :key="user.slot"
              class="user-item"
          >
            <img
                :src="user.avatar"
                class="user-avatar"
                alt="게임 캐릭터"
                :style="user.isEmpty ? 'filter: grayscale(100%) brightness(70%); opacity: 0.5;' : ''"
            />

            <p class="user-name" :class="{ empty: user.isEmpty }">
              {{ user.name }}
            </p>
          </div>
        </aside>

        <!-- 중앙 채팅 영역 -->
        <main class="chat-area">

          <!-- 채팅 박스 -->
          <div class="chat-box">
            <div v-for="msg in messages" :key="msg.id" class="chat-message">
              <strong>{{ msg.user }} :</strong> {{ msg.text }}
            </div>
          </div>

          <!-- 입력창 -->
          <div class="chat-input">
            <BaseInput v-model="message" placeholder="메시지를 입력하세요" class="chat-input-box" />
            <BaseButton color="white" size="small" @click="sendMessage">입력</BaseButton>
          </div>

          <!-- 게임 버튼 -->
          <div class="game-actions">
            <BaseButton color="blue" size="small">문제 출제</BaseButton>
            <BaseButton color="orange" size="small">정답 공개</BaseButton>
          </div>

        </main>

        <!-- 오른쪽 문제 목록 -->
        <aside class="problem-list">
          <h4>문제 목록</h4>

          <div
              v-for="p in problems"
              :key="p.id"
              class="problem-card"
          >
            <div class="problem-title">{{ p.id }}. {{ p.title }}</div>
            <div class="problem-desc">{{ p.desc }}</div>
            <div class="problem-user">{{ p.user }}</div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import BaseInput from "@/components/base/input/BaseInput.vue";
import BaseButton from "@/components/base/button/BaseButton.vue";

const route = useRoute();

// 방 정보
const roomId = route.params.roomId;
const roomTitle = route.query.title;

// 고정 캐릭터 이미지
const avatarImg = "/src/assets/퀴즈방 캐릭터.svg";

// 최대 유저 수 (5칸 고정)
const maxUsers = 5;

// 접속 유저
const users = ref([
  { id: 1, name: "김진", avatar: avatarImg },
  { id: 2, name: "김이김", avatar: avatarImg },
  { id: 3, name: "김비김", avatar: avatarImg }
]);

// 유저 슬롯 5개 고정
const displayUsers = computed(() => {
  const arr = users.value.map((u, index) => ({
    ...u,
    slot: index,
    isEmpty: false
  }));

  while (arr.length < maxUsers) {
    arr.push({
      slot: arr.length,
      id: null,
      name: "",
      avatar: avatarImg,
      isEmpty: true
    });
  }

  return arr;
});

// 채팅 관련
const messages = ref([
  { id: 1, user: "System", text: "입장하셨습니다." },
  { id: 2, user: "김진", text: "어서오세요" }
]);

const message = ref("");

const sendMessage = () => {
  if (!message.value.trim()) return;

  messages.value.push({
    id: Date.now(),
    user: "나",
    text: message.value
  });

  message.value = "";
};

// 문제 리스트
const problems = ref([
  { id: 1, title: "Stack이란?", desc: "LIFO 구조", user: "김진" },
  { id: 2, title: "싱글톤이란?", desc: "하나의 인스턴스", user: "김비김" }
]);
</script>

<style scoped>

/* =========================================================
   배  경
=========================================================*/

.game-room {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/game-room-background.svg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* =========================================================
   중앙 박스
=========================================================*/
.chat-wrapper {
  width: 88%;
  height: 90%;
  background: white;
  border-radius: 22px;
  border: 4px solid #9cd0ff;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* =========================================================
   상단 헤더
=========================================================*/
.game-header {
  background: #D3ECFF;
  padding: 16px 24px;
  border-bottom: 2px solid #A6D1F5;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.room-number { font-size: 28px; font-weight: 800; color: #0B7EE3; }
.colon { font-size: 28px; font-weight: 800; color: #244B73; }
.room-title { font-size: 28px; font-weight: 800; color: #244B73; }

.header-right {
  font-size: 20px;
  font-weight: 700;
  color: #0B7EE3;
}

/* =========================================================
   메인 레이아웃
=========================================================*/
.game-layout {
  display: grid;
  grid-template-columns: 240px 1fr 340px;
  height: 100%;
}

/* =========================================================
   유저 리스트 (왼쪽)
=========================================================*/
.user-list {
  background: transparent;
  padding: 20px 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.user-item {
  text-align: center;
}

.user-avatar {
  width: 70px;
  height: 70px;
}

.user-name {
  margin-top: 6px;
  height: 20px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.user-name.empty {
  color: transparent;
}

/* =========================================================
   중앙 채팅
=========================================================*/
.chat-area {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 2px solid #b2dfff;
  border-right: 2px solid #b2dfff;
  padding-bottom: 15px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
}

.chat-input input {
  flex: 1;
}

/* =========================================================
   문제 리스트 (오른쪽)
=========================================================*/
.problem-list {
  background: #f7fbff;
  padding: 18px;
  overflow-y: auto;
}

.problem-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.problem-title {
  font-weight: 700;
  margin-bottom: 4px;
}

/* =========================================================
   버튼
=========================================================*/
.game-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
}
</style>
