<script setup>
import { ref, onMounted } from 'vue'; // onMounted import
import AdminButton from '@/components/base/button/AdminButton.vue';
import NotificationTemplateModal from '@/components/common/modal/NotificationTemplateModal.vue';
import api from '@/api/axios.js'; // api import
import { debounce } from '@/utils/debounce.js'; // debounce import

const templates = ref([]); // API에서 가져온 템플릿 목록

const isModalVisible = ref(false);
const selectedTemplate = ref(null);

// 날짜 형식 변환 함수
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 알림 템플릿 목록을 API에서 가져오는 함수
const fetchTemplates = async () => {
  try {
    const response = await api.get('/alarm/templates', {
      params: {
        page: 0, // 기본 페이지 0
        size: 10, // 기본 사이즈 10
      },
    });
    const data = response.data;
    if (data && data.content) {
      templates.value = data.content.sort((a, b) => a.templateId - b.templateId); // templateId 오름차순 정렬
    }
  } catch (error) {
    console.error('알림 템플릿 목록을 불러오는데 실패했습니다:', error);
    templates.value = [];
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchTemplates();
});

const openEditModal = (template) => {
  selectedTemplate.value = template;
  isModalVisible.value = true;
};

const openRegisterModal = () => {
  selectedTemplate.value = { templateId: null, templateContent: '', templateCode: '' }; // New template, initialize templateCode
  isModalVisible.value = true;
};

// 원본 handleSave 함수
const _handleSave = async (updatedTemplate) => {
  isModalVisible.value = false; // 모달 닫기
  try {
    const payload = {
      templateContent: updatedTemplate.templateContent,
      templateCode: updatedTemplate.templateCode,
    };

    if (updatedTemplate.templateId) {
      // Existing template: PATCH call for update
      await api.patch(`/admin/alarm/templates/modify/${updatedTemplate.templateId}`, payload);
      alert('템플릿이 성공적으로 수정되었습니다.');
    } else {
      // New template: POST call for creation
      await api.post('/admin/alarm/templates', payload);
      alert('템플릿이 성공적으로 등록되었습니다.');
    }
    await fetchTemplates(); // 목록 새로고침
  } catch (error) {
    console.error('템플릿 저장 실패:', error);
    alert(`템플릿 저장에 실패했습니다: ${error.response?.data?.message || '알 수 없는 오류'}`);
  }
};
const handleSave = debounce(_handleSave, 300); // debounce 적용

// 원본 handleDelete 함수
const _handleDelete = async (templateId) => {
  if (!window.confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
    return;
  }
  try {
    await api.delete(`/admin/alarm/templates/${templateId}`);
    alert('템플릿이 성공적으로 삭제되었습니다.');
    await fetchTemplates(); // 목록 새로고침
  } catch (error) {
    console.error('템플릿 삭제 실패:', error);
    alert('템플릿 삭제에 실패했습니다. 다시 시도해주세요.');
  }
};
const handleDelete = debounce(_handleDelete, 300); // debounce 적용
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
          <th>템플릿 코드</th>
          <th>내용</th>
          <th>등록일시</th>
          <th>수정일시</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="template in templates" :key="template.templateId">
          <td>{{ template.templateId }}</td>
          <td>{{ template.templateCode }}</td>
          <td class="content-cell">{{ template.templateContent }}</td>
          <td>{{ formatDateTime(template.createdAt) }}</td>
          <td>{{ formatDateTime(template.updatedAt) }}</td>
          <td>
            <div class="action-buttons">
              <AdminButton label="수정" size="small" @click="openEditModal(template)" />
              <AdminButton label="삭제" size="small" @click="handleDelete(template.templateId)" />
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
