<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  notifications: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue", "action"]);

const close = () => emit("update:modelValue", false);

const handleAction = (item) => {
  emit("action", item);
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
            <!-- 동적으로 바뀌는 파란 부분 -->
            <span class="highlight">{{ n.user }}</span>

            <!-- 고정 문구 -->
            <span class="fixed">{{ n.message }}</span>

            <!-- 문제/문의 등 제목도 파란색 -->
            <span v-if="n.title" class="highlight">“{{ n.title }}”</span>
          </div>

          <!-- 우측 버튼 -->
          <button class="noti-btn" @click="handleAction(n)">
            {{ n.button }}
          </button>
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
  padding: 18px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: 0.2s;
}

.noti-item:hover {
  background: #ebf3ff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
  transform: translateX(4px);
}

/* 🔵 텍스트 영역 */
.noti-text {
  font-size: 14px;
  line-height: 1.45;
  display: flex;
  flex-direction: column;
}

.highlight {
  color: #1b4bb7;
  font-weight: 600;
}

.fixed {
  color: #2c2c2c;
  margin-left: 4px;
}

/* 🔵 우측 버튼 */
.noti-btn {
  min-width: 80px;
  background: linear-gradient(135deg, #478aff, #61b1ff);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
  white-space: nowrap;
}

.noti-btn:hover {
  background: #1e72ff;
  transform: translateY(-1px);
}
</style>
