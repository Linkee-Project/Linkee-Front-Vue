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
      <!-- 친구 -->
      <template v-if="type === 'friend'">
        <button class="modal-item" @click="select('chat')">
          <span class="icon">💬</span> 대화하기
        </button>

        <button class="modal-item danger" @click="select('report')">
          <span class="icon">🚨</span> 신고하기
        </button>
      </template>

      <!-- 방 -->
      <template v-else-if="type === 'room'">
        <button class="modal-item" @click="select('enter')">
          <span class="icon">🚪</span> 방 입장하기
        </button>

        <button class="modal-item" @click="select('invite')">
          <span class="icon">👥</span> 초대하기
        </button>

        <button class="modal-item" @click="select('out')">
          <span class="icon">🏃🏻</span> 나가기
        </button>

        <button class="modal-item danger" @click="select('report')">
          <span class="icon">🚨</span> 신고하기
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
  type: String,
  data: Object,
});

const emits = defineEmits(["close", "action"]);

const close = () => emits("close");
const select = (type) => emits("action", type);

const modalWidth = 175;
const modalHeight = 175;

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
  z-index: 2000;
  animation: fadeIn 0.15s ease-out;
}

/* ✨ 글래스 + 라운드 + 그림자 */
.modal-box {
  position: absolute;
  width: 175px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 14px;
  padding: 10px 0;

  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
      0 8px 25px rgba(0,0,0,0.12),
      inset 0 0 10px rgba(255,255,255,0.4);

  animation: pop 0.18s ease-out;
}

/* ✨ 아이콘 따로 스타일 */
.icon {
  font-size: 16px;
  width: 24px;
  display: inline-block;
  text-align: center;
}

/* ✨ 모달 아이템 버튼 */
.modal-item {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;

  font-size: 14px;
  color: #1e1e1e;
  font-weight: 500;

  display: flex;
  align-items: center;
  gap: 6px;

  border-radius: 8px;
  transition: 0.18s ease;
}

/* hover 효과 */
.modal-item:hover {
  background: rgba(233, 243, 255, 0.9);
  transform: translateX(3px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

/* danger 버튼 */
.modal-item.danger:hover {
  background: rgba(255, 226, 226, 0.9);
  color: #ff3b3b;
  box-shadow: 0 2px 6px rgba(255,0,0,0.15);
}

/* 팝업 애니메이션 */
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
  from { background: rgba(0, 0, 0, 0); }
  to { background: rgba(0, 0, 0, 0.02); }
}
</style>
