<template>
  <div class="game-room">

    <!-- 방 정보 -->
    <header class="room-header">
      <div class="left">
        <span class="room-number">{{ roomId }}번방 :</span>
        <span class="room-title">{{ roomTitle }}</span>
        <img src="/src/assets/icon/people.png" alt="인원 아이콘" class="icon"/>
        <span class="user-count">{{ members.length }} / {{ maxUsers }}</span>
      </div>

      <!-- 초대 / 나가기 -->
      <div class="right header-actions">
        <BaseButton color="blue" size="small" @click="showInviteModal = true"
                    style="min-width: 25px; height: 35px; border-radius: 15px">
          <img src="/src/assets/icon/invite.png" alt="초대 아이콘"
               style="width: 20px; height: 22px; padding-bottom: 4px;" />
        </BaseButton>

        <BaseButton color="white" size="small" @click="leaveRoom"
                    style="min-width: 25px; height: 35px; border-radius: 15px;
                    background: linear-gradient(90deg, rgb(0,191,24), #56f14b);">
          <img src="/src/assets/icon/leave.png" alt="나가기" style="width: 20px; height: 19px" />
        </BaseButton>
      </div>
    </header>

    <!-- 2단 구조 -->
    <div class="game-layout">

      <!-- 왼쪽 유저 리스트 -->
      <aside class="user-list">
        <div
            v-for="m in displayUsers"
            :key="m.slot"
            class="user-item"
            style="cursor: pointer"
            @click="!m.isEmpty && openUserModal($event, m)"
        >
          <img
              :src="m.avatar"
              class="user-avatar"
              :style="m.isEmpty ? 'filter: grayscale(100%) brightness(70%); opacity: 0.5;' : ''"
          />
          <p class="user-name" :class="{ empty: m.isEmpty }">{{ m.name }}</p>
        </div>
      </aside>

      <!-- 중앙 채팅 + 문제 -->
      <main class="chat-panel">
        <div class="chat-panel-logo">
          <img src="/src/assets/linkee_character.svg" alt="logo">
        </div>

        <div class="chat-content">

          <!-- 채팅 영역 -->
          <div class="chat-area">

            <div class="chat-box">
              <div
                  v-for="msg in messages"
                  :key="msg.id"
                  class="chat-message"
                  :class="{ system: msg.user === 'SYSTEM' }"
              >
                <strong>{{ msg.user }} :</strong> {{ msg.text }}
              </div>
            </div>

            <!-- 게임 버튼 -->
            <div class="game-actions">
              <BaseButton color="blue" size="small" @click="showProblemModal = true">문제 출제</BaseButton>
              <BaseButton color="orange" size="small" @click="revealAnswer">정답 공개</BaseButton>
            </div>

            <!-- 입력창 -->
            <div class="chat-input">
              <BaseInput
                  v-model="inputMessage"
                  placeholder="메시지를 입력하세요"
                  @keydown.enter="sendMessage"
              />
              <BaseButton color="white" size="small" @click="sendMessage">입력</BaseButton>
            </div>

            <!-- 문제 출제 모달 -->
            <BaseModal v-model="showProblemModal" title="문제 출제">
              <div class="problem-modal-body">

                <div class="modal-section">
                  <div class="modal-label">문제</div>
                  <textarea v-model="newProblem.title" class="modal-textarea" placeholder="문제를 입력하세요"></textarea>
                </div>

                <div class="modal-section">
                  <div class="modal-label">정답</div>
                  <textarea v-model="newProblem.answer" class="modal-textarea" placeholder="정답을 입력하세요"></textarea>
                </div>

              </div>

              <template #footer>
                <BaseButton color="orange" @click="addProblem">제출</BaseButton>
              </template>
            </BaseModal>

          </div>

          <!-- 문제 목록 -->
          <aside class="problem-list">
            <h4 class="problem-title-header">문제 목록</h4>
            <div class="problem-card-list">

              <div v-for="p in problems" :key="p.id" class="problem-card">
                <div class="problem-title">{{ p.id }}. {{ p.title }}</div>
                <div class="problem-desc">{{ p.desc }}</div>
                <div class="problem-user">출제자: {{ p.user }}</div>

                <div v-if="p.revealed" class="problem-answer">
                  정답: {{ p.answer }}
                </div>
              </div>

            </div>
          </aside>
        </div>

        <!-- 친구 초대 모달 -->
        <BaseModal v-model="showInviteModal" title="친구 초대">
          <div class="invite-content">
            <p>초대할 친구를 선택하세요.</p>
            <div v-for="friend in friends" :key="friend.id" class="invite-item">
              <span>{{ friend.name }}</span>
              <BaseButton size="small" color="blue" @click="invite(friend)">초대하기</BaseButton>
            </div>
          </div>
        </BaseModal>

        <!-- 유저 옵션 작은 모달 -->
        <ChoiceModal
            :type="modalType"
            :data="selectedFriend"
            :show="isModalOpen"
            :x="modalX"
            :y="modalY"
            @close="closeModal"
            @action="handleAction"
        />

        <ReportModal
            v-model="isReportModal"
            :target="reportTarget"
            @submit="handleReportSubmit"
        />

        <ChattingModal
            v-model="isChatModal"
            :room="currentRoom"
            :members="currentRoom?.members"
            :messages="roomMessages"
        />

      </main>
    </div>
  </div>
</template>

<script setup>
/* ---------------------------------------------------
   IMPORTS
--------------------------------------------------- */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";



/* UI 컴포넌트 */
import BaseInput from "@/components/base/input/BaseInput.vue";
import BaseButton from "@/components/base/button/BaseButton.vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";
import ChoiceModal from "@/components/common/modal/ChoiceModal.vue";
import ReportModal from "@/components/home/modal/ReportModal.vue";
import ChattingModal from "@/components/home/modal/ChattingModal.vue";
import {useChatGameStore} from "@/stores/chatgameStore.js";
import {useAuthStore} from "@/stores/authStore.js";

const route = useRoute();
const router = useRouter();

/* ---------------------------------------------------
   STORE 연결
--------------------------------------------------- */
const chat = useChatGameStore();
const auth = useAuthStore();

const roomId = route.params.roomId;
const roomTitle = route.query.title;

const roomCode = route.query.roomCode
    ? Number(route.query.roomCode)
    : null;

chat.init(auth.accessToken, roomId);

/* ---------------------------------------------------
   STATE (UI)
--------------------------------------------------- */
const maxUsers = 5;

const inputMessage = ref("");

/* 문제 모달 */
const showProblemModal = ref(false);
const newProblem = ref({ title: "", answer: "" });

/* 친구 초대 */
const showInviteModal = ref(false);
const friends = ref([
  { id: 101, name: "김비김비김" },
  { id: 102, name: "김명지니" },
  { id: 103, name: "진진돌이" }
]);

/* 유저 모달 */
const isModalOpen = ref(false);
const modalX = ref(0);
const modalY = ref(0);
const selectedFriend = ref(null);
const modalType = ref("friend");

/* 신고, 1:1채팅 */
const isReportModal = ref(false);
const reportTarget = ref(null);

const isChatModal = ref(false);
const currentRoom = ref(null);
const roomMessages = ref([]);

const me = { id: 999, name: "나" };

/* ---------------------------------------------------
   COMPUTED (store 데이터 불러오기)
--------------------------------------------------- */
const messages = computed(() => chat.messages);
const problems = computed(() => chat.problems);
const members = computed(() => chat.members);

const displayUsers = computed(() => {
  const arr = members.value.map((m, i) => ({
    ...m,
    name: m.userNickname,
    avatar: "/src/assets/퀴즈방 캐릭터.svg",
    slot: i,
    isEmpty: false
  }));

  while (arr.length < maxUsers) {
    arr.push({
      slot: arr.length,
      name: "",
      avatar: "/src/assets/퀴즈방 캐릭터.svg",
      isEmpty: true
    });
  }

  return arr;
});

/* ---------------------------------------------------
   LIFECYCLE
--------------------------------------------------- */
onMounted(async () => {

  console.log("🔥 ChatGameRoom 초기화");
  console.log("roomId:", roomId, "roomCode:", roomCode);

  // 🔥 1) 스토어 토큰 초기화 (새로고침 대비)
  if (!auth.accessToken) {
    console.log("⚠ accessToken 없음 → localStorage에서 복구");
    await auth.loadFromStorage();
  }

  if (!auth.accessToken) {
    alert("로그인이 필요합니다.");
    return router.replace("/login");
  }

  // 🔥 2) 채팅 스토어 초기화
  chat.init(auth.accessToken, roomId);

  try {
    // 🔥 3) 방 입장 (비밀번호는 리스트에서 전달된 roomCode 사용)
    console.log("REST Join Call 시작");

    const joinRes = await fetch(
        `http://localhost:8080/api/v1/chat/rooms/${roomId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomCode }),
        }
    );

    if (!joinRes.ok) {
      const msg = await joinRes.text();
      alert("입장 실패: " + msg);
      return router.replace("/chat/game/rooms");
    }

    // 🔥 4) WebSocket 연결
    console.log("WebSocket Connect 시작");
    await chat.connectSocket();

    // 🔥 5) 기존 메시지 로드
    console.log("Messages Load");
    await chat.loadMessages();

    // 🔥 6) 참여자 목록 로드
    console.log("Members Load");
    await chat.loadMembers();

  } catch (err) {
    console.error("방 진입 중 오류:", err);
    alert("방 입장 중 문제가 발생했습니다.");
    router.replace("/chat/game/rooms");
  }
});

onBeforeUnmount(() => {
  chat.leaveRoom();
});

/* ---------------------------------------------------
   ACTIONS
--------------------------------------------------- */
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  chat.sendMessage(inputMessage.value);
  inputMessage.value = "";
};

const addProblem = () => {
  if (!newProblem.value.title.trim() || !newProblem.value.answer.trim()) return;

  chat.submitProblem(newProblem.value.title, newProblem.value.answer);

  newProblem.value = { title: "", answer: "" };
  showProblemModal.value = false;
};

const revealAnswer = () => {
  chat.revealAnswer();
};

const invite = (friend) => {
  alert(`${friend.name} 님을 초대했습니다.`);
  showInviteModal.value = false;
};

const leaveRoom = async () => {
  try {
    // 1) REST 퇴장
    await fetch(`http://localhost:8080/api/v1/chat/rooms/${roomId}/leave`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + auth.accessToken,
        "Content-Type": "application/json"
      }
    });

  } catch(e) {
    console.warn("REST 퇴장 실패 (소켓으로만 처리됨)");
  }

  // 2) WebSocket 퇴장
  chat.leaveRoom();

  // 3) 방 목록 화면으로 이동
  router.replace("/chat/game/rooms");
};

/* ---------------------------------------------------
   유저 옵션 모달
--------------------------------------------------- */
const openUserModal = (event, user) => {
  selectedFriend.value = user;
  modalType.value = "friend";

  const rect = event.currentTarget.getBoundingClientRect();
  modalX.value = rect.right + 10;
  modalY.value = rect.top + rect.height / 2 - 70;

  isModalOpen.value = true;
};

const closeModal = () => (isModalOpen.value = false);

const handleReportSubmit = (data) => {
  console.log("신고 접수:", data);
};

const handleAction = (type) => {
  isModalOpen.value = false;

  if (type === "report") {
    reportTarget.value = selectedFriend.value;
    isReportModal.value = true;
    return;
  }

  if (type === "chat") {
    const friend = selectedFriend.value;
    currentRoom.value = {
      id: Date.now(),
      title: `${friend.name}님과 대화`,
      members: [me, friend],
      messages: []
    };
    roomMessages.value = [];
    isChatModal.value = true;
  }
};
</script>



<style scoped>
.icon {
  width: 20px;
  height: 20px;
  vertical-align: middle; /* ⭐ 글자 중앙 정렬 */
  padding-left: 15px;
}
/* 인원 아이콘 */
.icon {
  width: 21px;
  height: 21px;
  opacity: 0.8;
}

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

  padding: 15px 36px;
  height: 50px;

  background: linear-gradient(
      to bottom,
      #ffffff 0%,
      #f8fbff 45%,
      #edf5ff 100%
  );

  box-shadow: 0 3px 14px rgba(0, 60, 120, 0.08);

  /* 테두리 대신 부드러운 라인 */
  border-bottom: 1px solid rgba(200, 220, 255, 0.5);

  border-radius: 0 0 14px 14px;
}

.left {
  display: flex;
  align-items: center;
  gap: 14px;
}


/* 방 번호 */
.room-number {
  font-size: 19px;
  font-weight: 800;
  color: #3b5f88;
}

/* 방 제목 */
.room-title {
  font-size: 20px;
  font-weight: 900;
  color: #2b2b2b;
}

/* 인원 수 배지 느낌으로 */
.user-count {
  background: #e8f3ff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #3568a3;
  box-shadow: inset 0 0 4px rgba(0, 80, 180, 0.09);
}


/* 오른쪽 버튼 영역 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 버튼 안 아이콘 정돈 */
.header-actions img {
  margin-top: 1px;
}


.game-layout {
  position: relative;
  display: grid;
  grid-template-columns: 150px 1fr;
  height: calc(100vh - 110px);
  padding: 25px 40px;
  gap: 20px;
}

.user-list {
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
  background: white;

  /* ✨ 그라데이션 보더 */
  border: 3px solid transparent;
  border-radius: 20px;
  background-clip: padding-box, border-box;
  background-origin: border-box;
  background-image:
      linear-gradient(white, white),
      linear-gradient(135deg, #aadaff, #70b6ff, #90ccff);

  /* 자연스러운 입체감 */
  box-shadow: 0 4px 12px rgba(0, 70, 140, 0.12);

  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-panel-logo {
  position: absolute;
  top: -2%;
  left: 50.3%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
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
  height: 100%;
  overflow: hidden;

}

.chat-box {
  flex: 1; /* 남은 공간 채움 */
  padding: 16px;
  overflow-y: auto; /* ⭐ 스크롤 */
  min-height: 0; /* ⭐ flex 내부 스크롤 필수 */
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
}

.chat-message.system {
  color: #e4ce8c;          /* SYSTEM 메시지 글자색 */
  font-weight: 500;

}

.chat-message.system strong {
  color: #e88d54;          /* SYSTEM : 부분 */
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
  border: 1px solid #b5e0ff;
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
  overflow-y: auto; /* ⭐ 스크롤 */
  min-height: 0; /* ⭐ flex 스크롤 필수 */
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
.problem-answer{
  font-size: 12px;
  color: rgba(2, 145, 69, 0.88);
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



.header-actions {
  display: flex;
  align-items: center;
  padding-right: 12px;
  gap: 10px;
}

.invite-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 10px;
}

.invite-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f3faff;
  border-radius: 8px;
}
</style>
