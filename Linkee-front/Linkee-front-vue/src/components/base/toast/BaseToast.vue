<script setup>
import { ref } from "vue";

const message = ref("");
const isShow = ref(false);
let timer = null;

// 외부에서 호출할 수 있게 export
const showToast = (msg, duration = 2000) => {
  message.value = msg;
  isShow.value = true;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    isShow.value = false;
  }, duration);
};

defineExpose({ showToast });
</script>

<template>
  <transition name="toast-fade">
    <div v-if="isShow" class="toast-box">
      {{ message }}
    </div>
  </transition>
</template>

<style scoped>
.toast-box {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);

  background: rgba(0, 0, 0, 0.82);
  color: white;
  padding: 14px 22px;
  border-radius: 12px;

  font-size: 15px;
  font-weight: 500;
  z-index: 9999;

  backdrop-filter: blur(4px);
  animation: pop 0.25s ease-out;
}

@keyframes pop {
  from {
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
