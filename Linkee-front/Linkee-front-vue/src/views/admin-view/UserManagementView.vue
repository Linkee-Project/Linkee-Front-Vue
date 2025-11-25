<script setup>
import { ref } from 'vue';
import AdminButton from '@/components/base/button/AdminButton.vue';
import AdminModal from '@/components/common/modal/AdminModal.vue';
import PaginationButton from '@/components/base/button/PaginationButton.vue'; // Import PaginationButton
import BaseButton from '@/components/base/button/BaseButton.vue'; // Import BaseButton

const users = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    email: `user0${i + 1}@gmail.com`,
    nickname: `유저${i + 1}번임`,
    createdAt: '2025/11/10',
    updatedAt: '2025/11/10',
    role: 'USER',
    status: 'Y',
  }))
);

const isModalVisible = ref(false);
const selectedUser = ref(null);

const openModal = (user) => {
  selectedUser.value = user;
  isModalVisible.value = true;
};

const handleSave = (updatedUser) => {
  const index = users.value.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users.value[index] = { ...users.value[index], ...updatedUser };
  }
  isModalVisible.value = false;
};

// Pagination logic
const currentPage = ref(1);
const totalPages = ref(5); // Assuming 5 total pages for now

const updateCurrentPage = (newPage) => {
  currentPage.value = newPage;
  // In a real application, you would fetch data for the new page here
  console.log('Current page:', currentPage.value);
};

// Placeholder functions for filter buttons (no functionality required yet)
const showActiveUsers = () => {
  console.log('Show active users');
};

const showInactiveUsers = () => {
  console.log('Show inactive users');
};
</script>

<template>
  <div class="user-management-container">
    <h2 class="page-title">회원관리</h2>

    <div class="filter-buttons-container">
      <BaseButton label="활성화" color="blue" size="small" @click="showActiveUsers" />
      <BaseButton label="비활성화" color="gray" size="small" @click="showInactiveUsers" />
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
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.nickname }}</td>
            <td>{{ user.createdAt }}</td>
            <td>{{ user.updatedAt }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
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
