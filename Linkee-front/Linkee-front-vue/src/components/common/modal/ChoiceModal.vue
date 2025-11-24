<template>
  <div
      v-if="show"
      class="modal-overlay"
      @click.self="close"
  >
    <div
        class="modal-box"
        :style="{ left: adjustedX + 'px', top: adjustedY + 'px' }"
    >
      <!-- 친구일 때 -->
      <template v-if="type === 'friend'">
        <button class="modal-item" @click="select('chat')">
          💬 대화하기
        </button>

        <button class="modal-item danger" @click="select('report')">
          🚨 신고하기
        </button>
      </template>

      <!-- 방일 때 -->
      <template v-else-if="type === 'room'">
        <button class="modal-item" @click="select('enter')">
          🚪 방 입장하기
        </button>

        <button class="modal-item" @click="select('invite')">
          👥 초대하기
        </button>

        <button class="modal-item" @click="select('out')">
          🏃🏻 나가기
        </button>

        <button class="modal-item danger" @click="select('report')">
          🚨 신고하기
        </button>
      </template>
    </div>
  </div>

</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  x: Number,
  y: Number,
  type: String, // friend | room
  data: Object,
});

const emits = defineEmits(["close", "action"]);

const close = () => emits("close");
const select = (type) => emits("action", type);

// 모달 크기
const modalWidth = 170;
const modalHeight = 160;

const adjustedX = computed(() => {
  const maxX = window.innerWidth - modalWidth - 10;
  return Math.min(props.x, maxX);
});

const adjustedY = computed(() => {
  const maxY = window.innerHeight - modalHeight - 10;
  return Math.min(props.y, maxY);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  animation: fadeIn 0.15s ease-out;
}

/* 네오모픽 + 글래스 */
.modal-box {
  position: absolute;
  width: 170px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: 12px 0;
  box-shadow:
      3px 3px 15px rgba(0, 0, 0, 0.15),
      -3px -3px 15px rgba(255, 255, 255, 0.4);
  animation: pop 0.17s ease-out;
}

.modal-item {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  border-radius: 10px;
}

.modal-item:hover {
  background: #eef6ff;
  transform: translateX(3px);
}

.modal-item.danger:hover {
  background: #ffe5e5;
  color: #ff3b3b;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.02);
  }
}
</style>
