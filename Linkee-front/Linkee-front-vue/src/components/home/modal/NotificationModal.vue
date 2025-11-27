<script setup>
import { defineProps, defineEmits, inject } from "vue";
import { checkAlarmBox, deleteAlarmBox } from "@/api/alarmApi.js"; // Import API functions

const props = defineProps({
  modelValue: Boolean,
  notifications: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue", "action", "refreshNotifications"]); // Add refreshNotifications event

const toast = inject("toast");

const close = () => emit("update:modelValue", false);

const handleCheck = async (alarmBoxId) => {
  try {
    await checkAlarmBox(alarmBoxId);
    toast.show("알림을 읽음 처리했습니다.");
    emit("refreshNotifications"); // 알림 목록 새로고침 요청
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    toast.show("알림 읽음 처리 실패 😢");
  }
};

const handleDelete = async (alarmBoxId) => {
  try {
    await deleteAlarmBox(alarmBoxId);
    toast.show("알림을 삭제했습니다.");
    emit("refreshNotifications"); // 알림 목록 새로고침 요청
  } catch (error) {
    console.error("Failed to delete notification:", error);
    toast.show("알림 삭제 실패 😢");
  }
};
</script>

<template>
  <div v-if="props.modelValue" class="noti-overlay" @click.self="close">

    <div class="noti-panel">
      <div class="noti-header">
        <span>알림함</span>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="noti-list">
        <div v-for="(n, i) in props.notifications" :key="i" class="noti-item">

          <div class="noti-text">
            <span :class="['message', n.isChecked ? 'read' : 'unread']">{{ n.message }}</span>
            <span class="time">{{ n.time }}</span>
          </div>
          <div class="noti-actions">
            <button v-if="!n.isChecked" class="action-btn check-btn" @click="handleCheck(n.id)">✔</button>
            <button class="action-btn delete-btn" @click="handleDelete(n.id)">✖</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 🔵 전체 오버레이 */
.noti-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-end;
  z-index: 5000;
}

/* 🔵 사이드 패널 */
.noti-panel {
  width: 360px;
  height: 100vh;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  box-shadow: -10px 0 30px rgba(0,0,0,0.2);
  padding: 24px;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.35s cubic-bezier(.25, 1, .5, 1);
}

@keyframes slideIn {
  from { transform: translateX(100px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* 🔵 상단 헤더 */
.noti-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #1b4bb7;
  margin-bottom: 20px;
}

.close-btn {
  font-size: 26px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #5b6b8d;
  transition: 0.15s;
}

.close-btn:hover {
  color: #1b4bb7;
  transform: scale(1.15);
}

/* 🔵 알림 리스트 */
.noti-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-right: 6px;
}

/* 🔵 개별 알림 박스 */
.noti-item {
  background: #f7faff;
  border: 1px solid #d9e6ff;
  border-radius: 14px;
  padding: 10px 16px; /* 패딩 조정 */
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 12px;
  transition: 0.2s;
}

.noti-item:hover {
  background: #ebf3ff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
  transform: translateX(4px);
}

/* 알림 액션 버튼 컨테이너 */
.noti-actions {
  display: flex;
  gap: 5px; /* 버튼 사이 간격 */
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.check-btn {
  background-color: #5cb85c; /* 초록색 */
  color: white;
}

.check-btn:hover {
  background-color: #4cae4c;
}

.delete-btn {
  background-color: #f0ad4e; /* 주황색 */
  color: white;
}

.delete-btn:hover {
  background-color: #ec971f;
}

/* 🔵 텍스트 영역 */
.noti-text {
  font-size: 14px;
  line-height: 1.45;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 메시지가 공간을 채우도록 */
}

.message {
  font-weight: 500;
  margin-bottom: 4px; /* 메시지와 시간 사이 간격 */
}

.message.unread {
  color: #0094F6; /* 파란색 */
}

.message.read {
  color: #2c2c2c; /* 검정색 */
}

.time {
  color: #888;
  font-size: 12px;
}
</style>
