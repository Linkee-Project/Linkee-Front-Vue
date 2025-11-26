<template>
  <BaseModal :title="modalTitle" :modelValue="visible" @update:modelValue="closeModal">
    <div v-if="editableTemplate" class="form-container">
      <div class="form-group">
        <label for="template-id">템플릿 ID</label>
        <input
            id="template-id"
            v-model="editableTemplate.templateId"
            type="text"
            class="form-input"
            readonly
            disabled
        />
      </div>
      <div class="form-group">
        <label for="template-code">템플릿 코드</label>
        <input
            id="template-code"
            v-model="editableTemplate.templateCode"
            type="text"
            class="form-input"
        />
        <p v-if="validationErrors.templateCode" class="error-message">{{ validationErrors.templateCode }}</p>
      </div>
      <div class="form-group">
        <label for="template-content">템플릿 내용</label>
        <textarea
            id="template-content"
            v-model="editableTemplate.templateContent"
            class="form-textarea"
            rows="6"
        ></textarea>
        <p v-if="validationErrors.templateContent" class="error-message">{{ validationErrors.templateContent }}</p>
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
const validationErrors = ref({});

const modalTitle = computed(() => {
  return props.templateData && props.templateData.templateId ? '알림 템플릿 수정' : '알림 템플릿 등록';
});

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    // Modal is being opened, create a fresh copy of the data
    editableTemplate.value = {
      templateId: props.templateData?.templateId || null,
      templateContent: props.templateData?.templateContent || '',
      templateCode: props.templateData?.templateCode || '',
    };
    validationErrors.value = {}; // 모달 열릴 때 에러 초기화
  } else {
    // Modal is being closed, clear the data
    editableTemplate.value = null;
  }
}, { immediate: true });

const validateForm = () => {
  let isValid = true;
  validationErrors.value = {}; // 에러 메시지 초기화

  if (!editableTemplate.value.templateContent.trim()) {
    validationErrors.value.templateContent = '템플릿 내용을 입력해주세요.';
    isValid = false;
  }
  if (!editableTemplate.value.templateCode.trim()) {
    validationErrors.value.templateCode = '템플릿 코드를 입력해주세요.';
    isValid = false;
  }
  return isValid;
};

const closeModal = () => {
  emit('update:visible', false);
};

const saveChanges = () => {
  if (editableTemplate.value && validateForm()) {
    emit('save', editableTemplate.value);
  }
  // 모달은 validateForm()이 실패해도 닫지 않음. 사용자가 에러 수정 후 다시 시도하게 함.
  // closeModal();
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

.form-input, .form-textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f9f9f9;
}

.form-input[disabled] {
  background-color: #e9e9e9;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
}

.error-message {
  color: #ff4a4a;
  font-size: 12px;
  margin-top: 4px;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
