<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <BaseButton color="gray" size="medium" @click="cancel">{{ cancelText }}</BaseButton>
        <BaseButton color="red" size="medium" @click="confirm">{{ confirmText }}</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/base/button/BaseButton.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '확인',
  },
  message: {
    type: String,
    default: '작업을 진행하시겠습니까?',
  },
  confirmText: {
    type: String,
    default: '확인',
  },
  cancelText: {
    type: String,
    default: '취소',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-header h3 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
}

.modal-body p {
  margin: 20px 0;
  color: #555;
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}
</style>
