<script setup>
import BlueButton from "@/components/base/button/BaseButton.vue";
import "./UserSidebar.css";
import profileImg from "@/assets/profile_img.svg";
import onlineIcon from "@/assets/online.svg";
import offlineIcon from "@/assets/offline.svg";
import FriendModal from "@/components/common/modal/ChoiceModal.vue";

import { ref } from "vue";

// 친구 더미데이터
const friends = [
  { id: 1, name: "김폭주기관차", status: "접속중", online: true, avatar: profileImg },
  { id: 2, name: "김 이길까 말까", status: "20분전 마지막 접속", online: false, avatar: profileImg },
  { id: 3, name: "코딩하는 햄찌", status: "5시간 전 마지막 접속", online: false, avatar: profileImg },
  { id: 4, name: "주말만 기다리는 중", status: "접속중", online: true, avatar: profileImg }
];

// 채팅방 더미데이터
const rooms = [
  { id: 1, title: "코딩 전채틀, 알고리즘 스터디" },
  { id: 2, title: "자료구조 스터디" },
  { id: 3, title: "면접 대비방" },
  { id: 4, title: "프로그래밍 잡다운" }
];

// 모달 관련 상태
const isModalOpen = ref(false);
const modalX = ref(0);
const modalY = ref(0);
const selectedFriend = ref(null);
const modalType = ref("friend");

// 친구 모달 열기
const openFriendModal = (event, friend) => {
  openModal(event, friend, "friend");
};

const openRoomModal = (event, room) => {
  openModal(event, room, "room");
};

// 모달 공통 로직
const openModal = (event, data, type) => {
  selectedFriend.value = data;
  modalType.value = type;

  const rect = event.currentTarget.getBoundingClientRect();

  modalX.value = rect.left - 160;
  modalY.value = rect.top + rect.height / 2 - 70;

  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <aside class="sidebar-container">
    <div class="content">

      <!-- ========================= -->
      <!--   친구 목록 섹션          -->
      <!-- ========================= -->
      <div class="section-block">

        <div class="section-header">
          <span class="title">👥 친구 목록</span>
          <span class="count">접속 중: 1 / 2</span>
        </div>

        <div class="scroll-area">
          <div class="friend-list">
            <button
                class="friend-card"
                v-for="friend in friends"
                :key="friend.id"
                :class="{ online: friend.online }"
                @click="event => openFriendModal(event, friend)"
            >
              <img class="avatar" :src="friend.avatar" />

              <div class="info">
                <p class="name">{{ friend.name }}</p>

                <div class="status-row">
                  <img class="status-color" :src="friend.online ? onlineIcon : offlineIcon" />
                  <span class="status">{{ friend.status }}</span>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>


      <!-- 새 채팅 만들기 -->
      <div class="button-area">

          <BlueButton color="blue" size="medium" label="💬 새 채팅 만들기" />

      </div>


      <!-- ========================= -->
      <!--     내 채팅방 섹션        -->
      <!-- ========================= -->
      <div class="section-block">
        <div class="section-header">
          <span class="title">🤝 내 채팅방</span>
        </div>

        <div class="scroll-area" >
          <div class="room-list">
            <button
                class="room-card"
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

  <FriendModal
      :type="modalType"
      :data="selectedFriend"
      :show="isModalOpen"
      :x="modalX"
      :y="modalY"
      @close="closeModal"
  />
</template>

