<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminButton from '@/components/base/button/AdminButton.vue';
import AdminModal from '@/components/common/modal/AdminModal.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue';
import BaseButton from '@/components/base/button/BaseButton.vue';
import api from '@/api/axios.js';
import { debounce } from '@/utils/debounce.js';

const allUsers = ref([]); // 전체 사용자 목록을 저장할 ref
const activeFilter = ref('all'); // 현재 필터 상태 ('all', 'Y', 'N')

// API 호출하여 전체 사용자 목록 가져오기
const fetchUsers = async () => {
  try {
    const response = await api.get('/users/user');
    if (response.data && response.data.content) {
      allUsers.value = response.data.content;
      totalPages.value = response.data.totalPages;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

onMounted(() => {
  fetchUsers();
});

// 현재 필터에 따라 보여줄 사용자 목록을 계산하는 computed 속성
const filteredUsers = computed(() => {
  if (activeFilter.value === 'Y') {
    return allUsers.value.filter(user => user.userStatus === 'Y');
  }
  if (activeFilter.value === 'N') {
    return allUsers.value.filter(user => user.userStatus === 'N');
  }
  return allUsers.value; // 'all'일 경우 전체 목록 반환
});

const isModalVisible = ref(false);
const selectedUser = ref(null);

const openModal = (user) => {
  selectedUser.value = user;
  isModalVisible.value = true;
};

const _handleSave = async (updatedUser) => {
  const originalUser = JSON.parse(JSON.stringify(selectedUser.value));
  isModalVisible.value = false;

  try {
    const payload = {
      userId: updatedUser.userId,
    };

    if (originalUser.userRole !== updatedUser.userRole) {
      payload.newRole = updatedUser.userRole;
    }
    if (originalUser.userStatus !== updatedUser.userStatus) {
      payload.status = updatedUser.userStatus;
    }

    // Check if there are any changes to send to the API
    if (Object.keys(payload).length > 1) { // userId is always present, so > 1 means role or status changed
      await api.patch('/admin/users/user/role-status', payload);
      await fetchUsers();
    }
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error);
  }
};

const handleSave = debounce(_handleSave, 300);

// Pagination logic
const currentPage = ref(1);
const totalPages = ref(5);

const updateCurrentPage = (newPage) => {
  currentPage.value = newPage;
};

</script>

<template>
  <div class="user-management-container">
    <h2 class="page-title">회원관리</h2>

    <div class="filter-buttons-container">
      <BaseButton label="전체" :color="activeFilter === 'all' ? 'blue' : 'gray'" size="small" @click="activeFilter = 'all'" />
      <BaseButton label="활성화" :color="activeFilter === 'Y' ? 'blue' : 'gray'" size="small" @click="activeFilter = 'Y'" />
      <BaseButton label="비활성화" :color="activeFilter === 'N' ? 'blue' : 'gray'" size="small" @click="activeFilter = 'N'" />
    </div>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>회원번호</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>가입일시</th>
            <th>수정일시</th>
            <th>역할</th>
            <th>활성화여부</th>
            <th>변경</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.userEmail }}</td>
            <td>{{ user.userNickname }}</td>
            <td>{{ user.createdAt }}</td>
            <td>{{ user.updatedAt }}</td>
            <td>{{ user.userRole }}</td>
            <td>{{ user.userStatus }}</td>
            <td>
              <AdminButton @click="openModal(user)">변경</AdminButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Replace static pagination with PaginationButton component -->
    <PaginationButton
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="updateCurrentPage"
    />

    <AdminModal
      :visible="isModalVisible"
      :user-data="selectedUser"
      @update:visible="isModalVisible = $event"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.user-management-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: 600;
}

.filter-buttons-container {
  display: flex;
  justify-content: flex-end; /* Align to the right, based on the image hint */
  margin-bottom: 20px;
  gap: 10px; /* Space between buttons */
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.user-table th {
  background: #f0f7ff;
  padding: 12px;
  font-weight: 600;
}

.user-table td {
  background: #fff;
  padding: 14px;
  text-align: center;
  border-radius: 12px;
}

/* Remove the old pagination styles if they are no longer needed */
/*
.pagination {
  margin-top: 25px;
  text-align: center;
}
.pagination button {
  margin: 0 5px;
  border: none;
  padding: 6px 10px;
  border-radius: 50%;
}
*/
</style>
