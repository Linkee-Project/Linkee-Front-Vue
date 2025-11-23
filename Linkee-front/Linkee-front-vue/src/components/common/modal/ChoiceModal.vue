<!-- FriendModal.vue -->
<template>
  <div
      v-if="show"
      class="modal-overlay"
      @click.self="close"
  >
    <div class="modal-box">
      <button class="modal-item" @click="select('chat')">
        💬 대화하기
      </button>

      <button class="modal-item" @click="select('invite')">
        👥 초대하기
      </button>

      <button class="modal-item" @click="select('report')">
        🚨 신고하기
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  x: Number,
  y: Number,
  type: String, // <-- friend | room
  data: Object, // 친구/방 공통 데이터
});


const emits = defineEmits(["close", "action"]);

const close = () => emits("close");
const select = (type) => emits("action", type);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.modal-box {
  position: absolute;
  width: 150px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  padding: 10px 0;

  /* 부모에서 준 x, y 위치 적용 */
  left: v-bind(x + 'px');
  top: v-bind(y + 'px');
}

.modal-item {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  background: white;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: 0.15s;
}

.modal-item:hover {
  background: #f3f6ff;
}
</style>
