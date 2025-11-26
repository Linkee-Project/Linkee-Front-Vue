<script setup>
import { defineProps, defineEmits } from "vue";
import router from "@/router/index.js";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const props = defineProps({
  modelValue: Boolean,
  user: {
    type: Object,
    default: () => ({
      name: "김명지니어스",
      profile: "/src/assets/profile_img.svg"
    })
  }
});

const emit = defineEmits(["update:modelValue", "select"]);

const close = () => emit("update:modelValue", false);

const onSelect = async (menu) => {
  if (menu === 'logout') {
    await authStore.logout();
    return;
  }
  emit("select", menu);
  close();
};

</script>

<template>
  <div v-if="props.modelValue" class="overlay" @click.self="close">
    <div class="side-modal">

      <div class="profile-header">
        <img :src="props.user.profile" class="avatar" />
        <div class="info">
          <div class="name">{{ props.user.name }}</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="menu-list">
        <button class="menu-item" @click="onSelect('account')">계정 관리</button>
        <button class="menu-item" @click="onSelect('my-problem')">나의 문제 조회</button>
        <button class="menu-item" @click="onSelect('my-question')">나의 문의 조회</button>
        <button class="menu-item" @click="onSelect('my-bookmark')">나의 북마크 조회</button>
        <button class="menu-item" @click="onSelect('my-record')">나의 플레이 기록</button>
      </div>


      <div class="footer-menu">
        <div class="footer-divider"></div>
        <button class="footer-item logout" @click="onSelect('logout')">
          <span class="icon brown">🚪</span> 로그 아웃
        </button>

        <button class="footer-item inquiry" @click="onSelect('inquiry')">
          <span class="icon red">❓</span> 문의하기
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  z-index: 2000;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.side-modal {
  position: absolute;
  top: 0;
  right: 0;
  width: 310px;
  height: 100vh;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(18px);
  border-left: 1px solid rgba(255,255,255,0.5);
  box-shadow: -8px 0 30px rgba(0,0,0,0.2);
  padding: 32px 26px;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

@keyframes slideIn {
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.avatar {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #1b3c8c;
}

.divider {
  border-bottom: 1px solid #e5e8ef;
  margin-bottom: 20px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item {
  padding: 12px 10px;
  background: rgba(245, 248, 255, 0.6);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  color: #2d2d2d;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.menu-item:hover {
  background: #e8f1ff;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.footer-divider {
  border-bottom: 1px solid #e4e6ec;
  margin: 24px 0 16px 0;
}

.footer-menu {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: calc(100vh - 600px);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  padding: 10px 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.2s;
}

.footer-item:hover {
  background: #f3f6ff;
  transform: translateX(4px);
}

.icon.brown {
  color: #a9743a;
  font-size: 16px;
}

.icon.red {
  color: #d64545;
  font-size: 16px;
}
</style>
