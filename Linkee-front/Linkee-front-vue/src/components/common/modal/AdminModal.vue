<template>
  <BaseModal title="회원 정보 수정" :modelValue="visible" @update:modelValue="closeModal">
    <div v-if="userData" class="form-container">
      <div class="form-group">
        <label for="role-select">역할</label>
        <select id="role-select" v-model="editableUser.userRole" class="form-select">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div class="form-group">
        <label for="status-select">활성화 여부</label>
        <select id="status-select" v-model="editableUser.userStatus" class="form-select">
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
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
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/base/modal/BaseModal.vue';
import AdminButton from '@/components/base/button/AdminButton.vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  userData: { type: Object, default: () => null },
});

const emit = defineEmits(['update:visible', 'save']);

const editableUser = ref(null);

watch(() => props.userData, (newUser) => {
  if (newUser) {
    editableUser.value = { ...newUser };
  } else {
    editableUser.value = null;
  }
}, { immediate: true });

const closeModal = () => {
  emit('update:visible', false);
};

const saveChanges = () => {
  if (editableUser.value) {
    emit('save', editableUser.value);
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

.form-select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f9f9f9;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
