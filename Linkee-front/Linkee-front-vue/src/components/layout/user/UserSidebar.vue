<script setup>
//버튼 컴포넌트 가져오기
import BlueButton from "@/components/base/button/BaseButton.vue";
import "./UserSidebar.css";

//채팅방 여러개 만들기
const rooms = [
  { id: 1, title: "코딩 전채틀, 알고리즘 스터디" },
  { id: 2, title: "코딩 전채틀, 알고리즘 스터디" },
  { id: 3, title: "코딩 전채틀, 알고리즘 스터디" }
];
</script>

<template>
  <aside class="sidebar-container">
    <div class="content">
      <!-- 상단: 친구 목록 타이틀 -->
      <div class="section-header">
        <span class="title">👥 친구 목록</span>
        <!-- 나중에 수정 -->
        <span class="count">접속 중인 친구 1/2</span>
      </div>

      <!-- 친구 카드 리스트 영역 -->
      <div class="friend-list">
        <!-- 나중에 수정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  -->
        <button class="friend-card online">
          <img class="avatar" src="@/assets/profile_img.svg" alt="friend avatar" />

          <div class="info">
            <p class="name">김폭주기관차</p>
            <div class="status-row">
              <img class="status-color" src="@/assets/online.svg" alt="online"/>
              <span class="status">접속중</span>
            </div>
          </div>
        </button>

        <!-- 오프라인 -->
        <button class="friend-card">
          <img class="avatar" src="@/assets/profile_img.svg" alt="friend avatar" />
          <div class="info">
            <p class="name">김 이길까 말까</p>
            <div class="status-row">
              <img class="status-color" src="@/assets/offline.svg" alt="online"/>
              <span class="status">20분전 마지막 접속</span>
            </div>
          </div>
        </button>
      </div>

      <!-- 새 채팅방 만들기 버튼 -->
      <div class="button-area">
        <BlueButton color="blue" size="medium" label="💬 새 채팅 만들기" />
      </div>

      <!-- 내 채팅방 -->
      <div class="myroom-wrapper mt-20">

        <div class="myroom-header">
          <span class="myroom-title">🤝 내 채팅방</span>
        </div>

        <div class="room-list">
          <button class="room-card" v-for="room in rooms" :key="room.id">
            <img class="room-icon" src="@/assets/chat_room_img.svg" alt="room icon" />
            <p class="room-text">{{ room.title }}</p>
          </button>
        </div>

      </div>
    </div>
  </aside>
</template>

