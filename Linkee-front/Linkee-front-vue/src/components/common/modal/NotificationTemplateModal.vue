<template>
  <BaseModal :title="modalTitle" :modelValue="visible" @update:modelValue="closeModal">
    <div v-if="editableTemplate" class="form-container">
      <div class="form-group">
        <label for="template-content">템플릿 내용</label>
        <textarea
            id="template-content"
            v-model="editableTemplate.content"
            class="form-textarea"
            rows="6"
        ></textarea>
      </div>
    </div>
    <template #footer>
      <div class="footer-buttons">
        <AdminButton @click="saveChanges" label="저장" size="medium"/>
        <AdminButton @click="closeModal" label="취소" size="medium"/>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/base/modal/BaseModal.vue';
import AdminButton from '@/components/base/button/AdminButton.vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  templateData: { type: Object, default: () => null },
});

const emit = defineEmits(['update:visible', 'save']);

const editableTemplate = ref(null);

const modalTitle = computed(() => {
  return props.templateData && props.templateData.id ? '알림 템플릿 수정' : '알림 템플릿 등록';
});

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    // Modal is being opened, create a fresh copy of the data
    editableTemplate.value = { ...props.templateData };
  } else {
    // Modal is being closed, clear the data
    editableTemplate.value = null;
  }
}, { immediate: true });

const closeModal = () => {
  emit('update:visible', false);
};

const saveChanges = () => {
  if (editableTemplate.value) {
    emit('save', editableTemplate.value);
  }
  closeModal();
};
</script>

<style scoped>
.form-container {
  padding: 20px 10px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f9f9f9;
  resize: vertical;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
