<template>
  <div class="game-room">

    <!-- 방 정보 -->
    <header class="room-header">
      <div class="left">
        <span class="room-number">{{ roomId }}번방 :</span>
        <span class="room-title">{{ roomTitle }}</span>
      </div>

      <div class="right">
        <span class="user-count">{{ users.length }} / {{ maxUsers }}</span>
      </div>
    </header>

    <!-- 2단 구조 (왼쪽 유저 + 중앙 채팅판넬) -->
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
              :style="user.isEmpty ? 'filter: grayscale(100%) brightness(70%); opacity: 0.5;' : ''"
          />
          <p class="user-name" :class="{ empty: user.isEmpty }">{{ user.name }}</p>
        </div>
      </aside>

      <!-- 중앙 채팅 + 문제 리스트 포함 테두리 -->
      <main class="chat-panel">
        <div class="chat-panel-logo">
          <img src="/src/assets/linkee_character.svg" alt="logo">
        </div>
        <div class="chat-content">

          <!-- 채팅 영역 -->
          <div class="chat-area">
            <div class="chat-box">
              <div v-for="msg in messages" :key="msg.id" class="chat-message">
                <strong>{{ msg.user }} :</strong> {{ msg.text }}
              </div>
            </div>

            <!-- 게임 버튼 -->
            <div class="game-actions">
              <BaseButton color="blue" size="small" @click="showProblemModal = true">
                문제 출제
              </BaseButton>
              <BaseButton color="orange" size="small" @click="revealAnswer">
                정답 공개
              </BaseButton>
            </div>

            <!-- 입력창 -->
            <div class="chat-input">
              <BaseInput v-model="message" placeholder="메시지를 입력하세요"/>
              <BaseButton color="white" size="small" @click="sendMessage">입력</BaseButton>
            </div>

            <!-- 문제 출제 -->
            <BaseModal v-model="showProblemModal" title="문제 출제">

              <div class="problem-modal-body">

                <!-- 문제 영역 -->
                <div class="modal-section">
                  <div class="modal-label">문제</div>
                  <textarea
                      v-model="newProblem.title"
                      class="modal-textarea"
                      placeholder="문제를 입력하세요"
                  ></textarea>
                </div>

                <!-- 정답 영역 -->
                <div class="modal-section">
                  <div class="modal-label">정답</div>
                  <textarea
                      v-model="newProblem.answer"
                      class="modal-textarea"
                      placeholder="정답을 입력하세요"
                  ></textarea>
                </div>

              </div>

              <template #footer>
                <BaseButton color="orange" @click="addProblem">제출</BaseButton>
              </template>

            </BaseModal>

          </div>

          <!-- 문제 목록 (오른쪽 패널) -->
          <aside class="problem-list">
            <h4 class="problem-title-header">문제 목록</h4>
            <div class="problem-card-list">
              <div
                  v-for="p in problems"
                  :key="p.id"
                  class="problem-card"
              >
                <div class="problem-title">{{ p.id }}. {{ p.title }}</div>
                <div class="problem-desc">{{ p.desc }}</div>

                <!-- 정답 공개된 문제만 -->
                <div v-if="p.revealed" class="problem-answer">
                  정답: {{ p.answer }}
                </div>

                <div class="problem-user">출제자: {{ p.user }}</div>
              </div>
            </div>
          </aside>

        </div>
      </main>

    </div>

  </div>
</template>

<script setup>
import {ref, computed} from "vue";
import {useRoute} from "vue-router";

import BaseInput from "@/components/base/input/BaseInput.vue";
import BaseButton from "@/components/base/button/BaseButton.vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";

const route = useRoute();

// 방 정보
const roomId = route.params.roomId;
const roomTitle = route.query.title;

// 고정 캐릭터 이미지
const avatarImg = "/src/assets/퀴즈방 캐릭터.svg";
const maxUsers = 5;

// 접속 유저
const users = ref([
  {id: 1, name: "김진", avatar: avatarImg},
  {id: 2, name: "김이김", avatar: avatarImg},
  {id: 3, name: "김비김", avatar: avatarImg}
]);

// 유저 슬롯 유지
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

// 채팅 메시지
const messages = ref([
  {id: 1, user: "SYSTEM", text: "입장하셨습니다."},
  {id: 2, user: "김진", text: "어서오세요"}
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

// 문제 리스트 (문제별로 revealed 추가)
const problems = ref([
  {id: 1, title: "Stack이란?", desc: "LIFO 구조", answer: "LIFO", user: "김진", revealed: false},
  {id: 2, title: "싱글톤이란?", desc: "하나의 인스턴스", answer: "유일 객체", user: "김비김", revealed: false}
]);

// 문제 출제 모달
const showProblemModal = ref(false);

// 새 문제 입력폼
const newProblem = ref({
  title: "",
  desc: "",
  answer: ""
});

// 문제 출제
const addProblem = () => {
  if (!newProblem.value.title.trim()) return;

  const newId = problems.value.length + 1;

  problems.value.push({
    id: newId,
    title: newProblem.value.title,
    desc: newProblem.value.desc,
    answer: newProblem.value.answer,
    user: "나",
    revealed: false
  });

  messages.value.push({
    id: Date.now(),
    user: "SYSTEM",
    text: `'나'님이 ${newId}번 문제를 출제했습니다.`
  });

  newProblem.value = {title: "", desc: "", answer: ""};
  showProblemModal.value = false;
};

// 정답 공개: 마지막 문제만 공개
const revealAnswer = () => {
  const last = problems.value[problems.value.length - 1];
  if (!last) return;

  last.revealed = true;

  messages.value.push({
    id: Date.now(),
    user: "SYSTEM",
    text: `${last.id}번 문제의 정답이 공개되었습니다.`
  });
};
</script>

<style scoped>
/* (기존 스타일 그대로 유지 - 생략하지 않음) */
.game-room {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/game-room-background.svg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 30px;
  background: rgb(255, 255, 255);
}

.room-number, .room-title {
  font-size: 20px;
  font-weight: 900;
  color: #505050;
}

.user-count {
  font-size: 20px;
  font-weight: 900;
  color: #505050;
}

.game-layout {
  display: grid;
  grid-template-columns: 150px 1fr;
  height: calc(100vh - 110px);
  padding: 25px 40px;
  gap: 20px;
}

.user-list {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.24);
  border-radius: 10px;
  border: 1px solid #d2e9f3;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  width: 75px;
  height: 75px;
}

.user-name {
  margin: 0;
  width: 70px;
  height: 22px;
  background: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #333;
  line-height: 22px;
  overflow: hidden;
}

.user-name.empty {
  background: #e5e5e5;
  color: transparent;
}

.chat-panel {
  position: relative;
  background: white;
  border: 4px solid #92ccfd;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-panel-logo {
  position: absolute;
  top: -6%;
  left: 43.5%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.chat-panel-logo img {
  width: 38px;
  height: 38px;
  display: block;
  z-index: 9999;
  pointer-events: none;
  animation: floatUpDown 2s ease-in-out infinite;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}

.chat-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  height: 100%;
}

.chat-area {
  display: flex;
  flex-direction: column;
  border-right: 2px solid #b2dfff;
  height: 100%;
  overflow: hidden;
}

.chat-box {
  flex: 1; /* 남은 공간 채움 */
  padding: 16px;
  overflow-y: auto; /* ⭐ 스크롤 */
  min-height: 0;    /* ⭐ flex 내부 스크롤 필수 */
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
}

.game-actions {
  display: flex;
  justify-content: flex-end;
  padding: 5px 18px;
  gap: 15px;
  flex-direction: row;
}

.problem-list {
  background: #f7fbff;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 17px;
}

.problem-title-header {
  background: #DFF2FF;
  font-size: 20px;
  font-weight: 700;
  color: #2a6c9e;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px 0 14px;
  margin: 0;
}

.problem-card-list {
  flex: 1;
  overflow-y: auto;  /* ⭐ 스크롤 */
  min-height: 0;     /* ⭐ flex 스크롤 필수 */
  padding: 10px;
}

.problem-card {
  background: white;
  padding: 14px;
  border-radius: 12px;
  margin-top: 7px;
  margin-bottom: 7px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.problem-title {
  font-weight: 700;
  margin-bottom: 4px;
}

.problem-desc {
  font-size: 13px;
  margin-bottom: 4px;
}

.problem-user {
  font-size: 12px;
  color: #666;
}

.problem-modal-body {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 10px 5px;
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-label {
  width: 100%;
  text-align: center;
  background: #e9f5ff;
  padding: 6px 0;
  border-radius: 8px;
  font-weight: 700;
  color: #3b75a5;
  font-size: 14px;
}

.modal-textarea {
  width: 94%;
  height: 120px;
  border: 1px solid #c8dff5;
  border-radius: 10px;
  padding: 10px;
  resize: none;
  font-size: 14px;
  font-family: inherit;
  background: white;
  transition: border-color 0.2s ease; /* 부드럽게 */
}

.modal-textarea:focus {
  border-color: #71beff; /* 연한 하늘색 */
  outline: none; /* 기본 파란 외곽선 제거 */
}
</style>
