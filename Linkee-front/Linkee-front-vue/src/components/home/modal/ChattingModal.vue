<script setup>
import { ref } from "vue";
import ChatActionButton from "@/components/base/button/ChatActionButton.vue";
import InviteChatRoomModal from "@/components/home/modal/InviteChatRoomModal.vue";
import ChatRoomMembersModal from "@/components/home/modal/ChatRoomMembersModal.vue";

const props = defineProps({
  modelValue: Boolean,
  roomName: String,
  messages: Array,
  friends: Array,
  members: Array,
  room: Object
});

const emit = defineEmits(["update:modelValue", "sendMessage", "invite"]);

const text = ref("");

const showInvite = ref(false);
const showMembers = ref(false);

const close = () => emit("update:modelValue", false);

const onSend = () => {
  if (!text.value.trim()) return;
  emit("sendMessage", text.value);
  text.value = "";
};
</script>

<template>
  <div v-if="props.modelValue" class="overlay" @click.self="close">
    <div class="modal">

      <!-- HEADER -->
      <div class="header">
        <h3 class="room-title">{{ props.roomName }}</h3>

        <div class="header-right">
          <ChatActionButton size="38" @click="showMembers = true">
            <img src="@/assets/members_img.svg" width="20" />
          </ChatActionButton>

          <button class="close-btn" @click="close">×</button>
        </div>
      </div>

      <!-- CHAT AREA -->
      <div class="chat-area">
        <div
            v-for="(msg, idx) in props.messages"
            :key="idx"
            class="msg-row"
            :class="{ me: msg.me }"
        >
          <!-- 상대방 프로필 -->
          <img
              v-if="!msg.me"
              :src="msg.profile || '@/assets/default_profile.svg'"
              class="msg-profile"
          />

          <!-- 메시지 버블 -->
          <div class="bubble" :class="{ me: msg.me }">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- INPUT AREA -->
      <div class="input-area">
        <input
            v-model="text"
            placeholder="메시지를 입력하세요..."
            @keyup.enter="onSend"
        />

        <ChatActionButton size="42" @click="showInvite = true">
          <img src="@/assets/invite_friend.svg" width="22" />
        </ChatActionButton>

        <ChatActionButton size="42" @click="onSend">
          <img src="@/assets/message_send.svg" width="22" />
        </ChatActionButton>
      </div>

    </div>
  </div>

  <!-- 초대 모달 -->
  <InviteChatRoomModal
      v-model="showInvite"
      :friends="props.friends"
      :room="props.room"
      @invite="emit('invite', $event)"
  />

  <!-- 멤버 목록 -->
  <ChatRoomMembersModal
      v-model="showMembers"
      :members="props.members"
  />
</template>

<style scoped>

/* 🌙 전체 어둡게 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 900;
}

/* ☁️ 유리 같은 글래스 모달 */
.modal {
  width: 420px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0094F6, #6BC8FF);
  padding: 0 18px;
  height: 58px;
}

.room-title {
  flex: 1;
  color: #fff;
  font-size: 19px;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

/* CHAT AREA */
.chat-area {
  height: 380px;
  overflow-y: auto;
  padding: 16px;
  background: #f4f7fc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 전체 메시지 줄 */
.msg-row {
  display: flex;
  align-items: flex-end;
  margin: 10px 0;
  gap: 8px;
}

/* 내가 보낸 메시지 → 오른쪽 정렬 */
.msg-row.me {
  justify-content: flex-end;
}

/* 상대방 프로필 이미지 */
.msg-profile {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* 상대방 버블 */
.msg-row:not(.me) .bubble {
  background: #ffffff;
  color: #222;
  border-radius: 16px 16px 16px 4px;
}

/* 내 버블 */
.msg-row.me .bubble {
  background: #86c6ff;
  color: #fff;
  border-radius: 16px 16px 4px 16px;
}

/* 말풍선 */
.bubble {
  max-width: 68%;
  padding: 12px 14px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
}

/* 입력 영역 */
.input-area {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #e5ecf3;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  background: #f0f5ff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
}

.input-area input:focus {
  background: #e8f1ff;
  box-shadow: 0 0 0 2px #b9dcff;
}

</style>
