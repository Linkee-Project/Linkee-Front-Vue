<script setup>
//버튼 컴포넌트 가져오기
import BlueButton from "@/components/base/button/BaseButton.vue";
import "./UserSidebar.css";
import profileImg from "@/assets/profile_img.svg";
import onlineIcon from "@/assets/online.svg";
import offlineIcon from "@/assets/offline.svg";
import ChoiceModal from "/src/components/common/modal/ChoiceModal.vue";
import ReportModal from "@/components/home/modal/ReportModal.vue";
import { ref } from "vue";


//채팅방 여러개 만들기
const rooms = ref([
  { id: 1, title: "코딩 천재들, 알고리즘 스터디" },
  { id: 2, title: "코딩 천재들, 알고리즘 스터디" },
  { id: 3, title: "코딩 천재들, 알고리즘 스터디" },
  { id: 4, title: "코딩 천재들, 알고리즘 스터디" }
]);

//친구 여러개 만들기
// ✔ 친구 4명 데이터
const friends = ref([
  {
    id: 1,
    name: "김폭주기관차",
    status: "접속중",
    online: true,
    avatar: profileImg
  },
  {
    id: 2,
    name: "김 이길까 말까",
    status: "20분전 마지막 접속",
    online: false,
    avatar: profileImg
  },
  {
    id: 3,
    name: "코딩하는 햄찌",
    status: "5시간 전 마지막 접속",
    online: false,
    avatar: profileImg
  },
  {
    id: 4,
    name: "주말만 기다리는 중",
    status: "접속중",
    online: true,
    avatar: profileImg
  }
]);


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
const addNewRoom = (roomData) => {
  rooms.value.push({
    id: rooms.value.length + 1,
    title: roomData.roomName,
    members: roomData.invited
  });
};

//------------------------------------------------------------------------------
//친구 초대
const isInviteModal = ref(false);
const selectedRoom = ref(null);
const handleInvite = ({ roomId, invited }) => {
  const room = rooms.value.find(r => r.id === roomId);
  if (!room.members) room.members = [];

  invited.forEach(user => {
    if (!room.members.some(m => m.id === user.id)) {
      room.members.push(user);
    }
  });

  console.log("초대 완료:", room);
};

//=================================================================================
// 모달에서 선택한 버튼 실행
const handleAction = (type) => {
  console.log("선택한 기능:", type, selectedFriend.value.name);
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
          <span class="count">접속 중: 1 / 2</span>
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
</template>

