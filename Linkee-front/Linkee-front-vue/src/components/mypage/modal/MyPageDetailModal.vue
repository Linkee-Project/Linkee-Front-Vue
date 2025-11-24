<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">&times;</button>
      </header>
      <section class="modal-body">
        <slot /> <!-- 모달 내용 -->
      </section>
      <footer class="modal-footer">
        <slot name="footer" /> <!-- 버튼 등 커스텀 footer -->
      </footer>
    </div>
  </div>

</template>

<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const props = defineProps({
  title: { type: String, default: 'Modal Title' },
  modelValue: { type: Boolean, default: false } // v-model 사용
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const close = () => {
  visible.value = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  width: 700px; /* 가로 길이 증가 */
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex; /* Add flex display */
  flex-direction: column; /* Stack children vertically */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  color: white;
  align-items: center;
  background: linear-gradient(90deg, #0094F6, #4FC3FC);
  padding: 0 15px; /* 좌우만 조금 넣고, 상하 패딩 제거 */
  height: 50px;    /* 원하는 높이 설정 가능 */
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-sizing: border-box;
  flex-shrink: 0; /* Prevent header from shrinking */
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: rgba(255, 255, 255);
  text-shadow: 1px 1px 2px rgba(242, 242, 242, 0.3);
  cursor: pointer;
}
.close-btn:hover{
  color: #f4f4f4;
  text-shadow: 1px 1px 2px rgba(242, 242, 242, 0.5);
}

.modal-body {
  margin-top: 10px;
  padding: 0 15px;
  flex-grow: 1; /* Allow body to take available space */
  max-height: 70vh; /* Set a max height for scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
}

.modal-footer {
  margin-top: 15px;
  text-align: center;
  padding: 8px;
  flex-shrink: 0; /* Prevent footer from shrinking */
}
</style>