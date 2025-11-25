<script setup>
import { ref } from 'vue';
import AdminButton from '@/components/base/button/AdminButton.vue';
import NotificationTemplateModal from '@/components/common/modal/NotificationTemplateModal.vue';

const templates = ref(
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      content: `템플릿 내용 ${i + 1}번임`,
      createdAt: '2025/11/10',
      updatedAt: '2025/11/10',
    }))
);

const isModalVisible = ref(false);
const selectedTemplate = ref(null);

const openEditModal = (template) => {
  selectedTemplate.value = template;
  isModalVisible.value = true;
};

const openRegisterModal = () => {
  selectedTemplate.value = { id: null, content: '', createdAt: '', updatedAt: '' }; // New template
  isModalVisible.value = true;
};


const handleSave = (updatedTemplate) => {
  if (updatedTemplate.id) {
    // Existing template
    const index = templates.value.findIndex(t => t.id === updatedTemplate.id);
    if (index !== -1) {
      templates.value[index] = { ...templates.value[index], ...updatedTemplate, updatedAt: '2025/11/11' }; // Mock date update
    }
  } else {
    // New template - do nothing for now as per user's request
    console.log('New template creation is currently disabled.');
    // const newId = templates.value.length > 0 ? Math.max(...templates.value.map(t => t.id)) + 1 : 1;
    // templates.value.push({
    //   id: newId,
    //   content: updatedTemplate.content,
    //   createdAt: '2025/11/11', // Mock date
    //   updatedAt: '2025/11/11', // Mock date
    // });
  }
  isModalVisible.value = false;
};

const handleDelete = (templateId) => {
  templates.value = templates.value.filter(t => t.id !== templateId);
  console.log(`Deleted template with id: ${templateId}`);
};
</script>

<template>
  <div class="notification-template-container">
    <h2 class="page-title">알림템플릿관리</h2>
    <div class="register-button-container">
      <AdminButton label="템플릿등록" size="medium" @click="openRegisterModal" />
    </div>

    <div class="table-wrapper">
      <table class="template-table">
        <thead>
        <tr>
          <th>템플릿번호</th>
          <th>내용</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="template in templates" :key="template.id">
          <td>{{ template.id }}</td>
          <td class="content-cell">{{ template.content }}</td>
          <td>{{ template.createdAt }}</td>
          <td>{{ template.updatedAt }}</td>
          <td>
            <div class="action-buttons">
              <AdminButton label="수정" size="small" @click="openEditModal(template)" />
              <AdminButton label="삭제" size="small" @click="handleDelete(template.id)" />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <NotificationTemplateModal
        :visible="isModalVisible"
        :template-data="selectedTemplate"
        @update:visible="isModalVisible = $event"
        @save="handleSave"
    />
  </div>
</template>

<style scoped>
.notification-template-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px; /* Add margin below the title */
  font-size: 22px;
  font-weight: 600;
}

.register-button-container {
  display: flex;
  justify-content: flex-end; /* Align to the right */
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
}

.template-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: center;
}

.template-table th {
  background: #f0f7ff;
  padding: 12px;
  font-weight: 600;
}

.template-table td {
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  vertical-align: middle;
}

.content-cell {
  max-width: 400px;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
