<script setup>
//버튼 컴포넌트 가져오기
import BlueButton from "@/components/base/button/BaseButton.vue";
import "./UserSidebar.css";
import api from "@/api/axios";
import profileImg from "@/assets/profile_img.svg";
import onlineIcon from "@/assets/online.svg";
import offlineIcon from "@/assets/offline.svg";
import ChoiceModal from "/src/components/common/modal/ChoiceModal.vue";
import ReportModal from "@/components/home/modal/ReportModal.vue";
import {ref, onMounted, computed, inject} from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { fetchMyRelations } from "@/api/relationApi.js";
import {createChatRoom, fetchMyChatRooms} from "@/api/chatApi.js";
import { inviteToChatRoom } from "@/api/chatApi.js";
import { fetchRoomMembers } from "@/api/chatApi.js";

const toast = inject("toast");


//채팅방 여러개 만들기
const rooms = ref([]);

//회원 정보
const authStore = useAuthStore();
//친구
const friends = ref([]);

//친구조회
const loadFriends = async () => {
  try {
    const res = await fetchMyRelations();
    const rows = res.data.content;

    const myId = authStore.user.userId;

    friends.value = rows.map(r => {
      const isRequester = r.requesterId === myId;

      return {
        id: isRequester ? r.receiverId : r.requesterId,
        name: isRequester ? r.receiverNickname : r.requesterNickname,
        online: true,
        status: "접속중",
        avatar: profileImg
      };
    });

  } catch (err) {
    console.error("친구 목록 조회 실패:", err);
  }
};
const totalCount = computed(() => friends.value.length);
const onlineCount = computed(() => friends.value.length);


//빙조회
const loadMyRooms = async () => {
  try {
    const res = await fetchMyChatRooms({ page: 0, size: 30 });

    const rows = res.content;

    rooms.value = rows.map(r => ({
      id: r.chatRoomId,
      title: r.chatRoomName,
      members: [],
    }));

  } catch (e) {
    console.error("내 채팅방 조회 실패: ", e);
  }
};
onMounted(() => {
  loadFriends();
  loadMyRooms();
});

// 모달 관련 상태
const isModalOpen = ref(false);
const modalX = ref(0);
const modalY = ref(0);
const selectedFriend = ref(null);
const modalType = ref("friend");
const isReportModal = ref(false);   // 신고 모달 ON/OFF
const reportTarget = ref(null);     // 신고 대상


// 친구 클릭 -> 모달 열기
const openFriendModal = (event, friend) => {
  modalType.value = "friend";
  selectedFriend.value = friend;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  // 모달 위치는 "카드 왼쪽 중앙"
  modalX.value = rect.left - 160; // 모달 width + 여백
  modalY.value = rect.top + rect.height / 2 - 70; // 모달 height 절반만큼 조정

  isModalOpen.value = true;
};


const openRoomModal = (event, room) => {
  modalType.value = "room";
  selectedFriend.value = room;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  modalX.value = rect.left - 160;
  modalY.value = rect.top + rect.height / 2 - 70;

  isModalOpen.value = true;
};

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

//----------------------------------------------------------------------
//새 채팅방 만들기
import CreateChatRoomModal from "@/components/home/modal/CreateChatRoomModal.vue";
import InviteChatRoomModal from "@/components/home/modal/InviteChatRoomModal.vue";
//새 채팅방 만들기 상태 on/off
const isCreateRoomModal = ref(false);
const addNewRoom = async (roomData) => {
  try {
    const invitedIds = roomData.invited.map(u => u.id);

    const request = {
      chatRoomName: roomData.roomName,
      chatRoomType: "CHAT",
      isPrivate: "N",
      invitedUserIds: invitedIds
    };

    const res = await createChatRoom(request);

    // 성공했으면 다시 목록 조회
    await loadMyRooms();

  } catch (err) {
    console.error("방 생성 실패: ", err);
  }
};

//------------------------------------------------------------------------------
//친구 초대
console.log("token:", authStore.accessToken);

const isInviteModal = ref(false);
const selectedRoom = ref(null);
const handleInvite = async ({ roomId, invited }) => {
  try {
    await inviteToChatRoom(roomId, invited);

    // 초대 성공 → 최신 멤버 다시 불러오기
    const res = await fetchRoomMembers(roomId);

    const updatedMembers = res.data.map(m => ({
      id: m.userId,
      name: m.userNickname,
      joinedAt: m.joinedAt,
      avatar: "/src/assets/profile_img.svg"
    }));

    const room = rooms.value.find(r => r.id === roomId);
    if (room) {
      room.members = updatedMembers;
    }

    toast?.show("친구가 성공적으로 초대되었습니다!");

  } catch (err) {
    console.error("초대 실패:", err);
    toast?.show("초대 중 오류가 발생했습니다.");
  }
};

//=================================================================================
// 채팅 모달

import ChattingModal from "@/components/home/modal/ChattingModal.vue";

// 채팅 모달 상태
const isChatModal = ref(false);

// 현재 선택된 채팅방 정보 (방 입장 또는 친구랑 새 채팅방)
const currentRoom = ref(null);

// 채팅 메시지 배열
const roomMessages = ref([]);

// 내 유저 정보 (임시)
const me = { id: 999, name: "나", profile: profileImg };

const sendMessage = (msg) => {
  roomMessages.value.push({
    text: msg,
    me: true
  });

  //방의 messages도 업데이트
  const room = rooms.value.find(r => r.id === currentRoom.value.id);
  if (room) {
    if (!room.messages) room.messages = [];
    room.messages.push({
      text: msg,
      me: true
    });
  }
};

//=================================================================================
// 모달에서 선택한 버튼 실행
const handleAction = async (type) => {
  console.log("선택한 기능:", type, selectedFriend.value?.name ?? selectedFriend.value?.title);
  isModalOpen.value = false;

  //신고
  if (type === "report") {
    // 신고 대상 저장
    reportTarget.value = selectedFriend.value;

    // 신고 모달 열기
    isReportModal.value = true;
  }

  //방 나가기
  if (type === "out") {
    rooms.value = rooms.value.filter(room => room.id !== selectedFriend.value.id);
  }

  //친구 초대
  if (type === "invite") {
    selectedRoom.value = selectedFriend.value; // 클릭한 방 객체
    isInviteModal.value = true;
  }

  //채팅방 입장
  if (type === "enter") {
    const room = selectedFriend.value;

    // 채팅 모달 열기 전 멤버 먼저 불러오기!!
    try {
      const res = await fetchRoomMembers(room.id);

      const members = res.data.map(m => ({
        id: m.userId,
        name: m.userNickname,
        joinedAt: m.joinedAt,
        avatar: "/src/assets/profile_img.svg" // 기본 프로필
      }));

      room.members = members;  // 반응형으로 저장
    } catch (e) {
      console.error("멤버 조회 실패:", e);
      room.members = [];
    }

    // 채팅 모달 오픈 로직
    currentRoom.value = { ...room };
    roomMessages.value = room.messages || [];
    isChatModal.value = true;
  }

  //1:1채팅
  // 1:1 채팅 (친구 대화하기)
  if (type === "chat") {
    const friend = selectedFriend.value;

    const myName = authStore.user.userNickname;
    const friendName = friend.name;

    try {
      const request = {
        chatRoomName: `${myName} · ${friendName}`,
        chatRoomType: "CHAT",
        isPrivate: "N",
        invitedUserIds: [friend.id]
      };

      const res = await createChatRoom(request);

      console.log("createChatRoom response:", res);


      const roomId = res.data.chatRoomId;

      if (!roomId) {
        console.error("❌ chatRoomId undefined!", res);
        return;
      }

      const memberRes = await api.get(`/chat/rooms/${roomId}/members`, {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });

      const members = memberRes.data.map(m => ({
        id: m.userId,
        name: m.nickname
      }));

      const newRoom = {
        id: roomId,
        title: request.chatRoomName,
        members,
        messages: []
      };

      rooms.value.push(newRoom);

      currentRoom.value = newRoom;
      roomMessages.value = [];
      isChatModal.value = true;

    } catch (err) {
      console.error("1:1 채팅방 생성 실패:", err);
    }
  }
};

  const handleReportSubmit = (data) => {
    console.log("신고 접수됨:", data);
  };


</script>

<template>
  <aside class="sidebar-container">
    <div class="content">

      <!-- 친구 목록 -->
      <div class="section-block">
        <div class="section-header">
          <span class="title">👥 친구 목록</span>
          <span class="count">접속 중: {{ onlineCount }} / {{ totalCount }}</span>
        </div>

        <!-- 🔥 CSS와 동일하게 scroll-area 사용 -->
        <div class="scroll-area">
          <div class="friend-list">
            <button
                class="friend-card"
                :class="{ online: friend.online }"
                v-for="friend in friends"
                :key="friend.id"
                @click="event => openFriendModal(event, friend)"
            >
              <img class="avatar" :src="friend.avatar" />

              <div class="info">
                <p class="name">{{ friend.name }}</p>

                <div class="status-row">
                  <img class="status-color"
                       :src="friend.online ? onlineIcon : offlineIcon" />
                  <span class="status">{{ friend.status }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>


      <!-- 새 채팅 만들기 -->
      <div class="button-area">
        <BlueButton
            color="blue"
            size="medium"
            label="💬 새 채팅 만들기"
            @click="isCreateRoomModal = true"
        />
      </div>


      <!-- 내 채팅방 -->
      <div class="section-block">
        <div class="section-header">
          <span class="title">🤝 내 채팅방</span>
        </div>

        <!-- 🔥 scroll-area로 통일 -->
        <div class="scroll-area">
          <div class="room-list">
            <button class="room-card"
                    v-for="room in rooms"
                    :key="room.id"
                    @click="event => openRoomModal(event, room)"
            >
              <img class="room-icon" src="@/assets/chat_room_img.svg" />
              <p class="room-text">{{ room.title }}</p>
            </button>
          </div>
        </div>
      </div>

    </div>
  </aside>


  <!-- 공통 모달들 -->
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

  <CreateChatRoomModal
      v-model="isCreateRoomModal"
      :friends="friends"
      @create="addNewRoom"
  />

  <InviteChatRoomModal
      v-model="isInviteModal"
      :friends="friends"
      :room="selectedRoom"
      @invite="handleInvite"
  />

  <ChattingModal
      v-model="isChatModal"
      :room="currentRoom"
      :roomName="currentRoom?.title"
      :members="currentRoom?.members"
      :messages="roomMessages"
      :friends="friends"
      @sendMessage="sendMessage"
      @invite="handleInvite"
  />

</template>

