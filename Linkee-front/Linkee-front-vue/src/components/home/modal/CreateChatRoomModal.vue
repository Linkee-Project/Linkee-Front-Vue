<script setup lang="ts">
import BaseModal from "@/components/base/modal/BaseModal.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import UserCard from "@/components/home/UserCard.vue";

import { ref, watch, inject } from "vue";


const toast = inject("toast");

/* Props */
const props = defineProps({
  modelValue: Boolean,
  friends: Array
});

/* Emit */
const emit = defineEmits(["update:modelValue", "create"]);

/* Modal visible */
const visible = ref(props.modelValue);

/* Form 데이터 */
const formRef = ref(null);
const form = ref({
  roomName: "",
  invited: []
});

/* 검증 rules */
const rules = {
  roomName: [
    { required: true, message: "방 이름을 입력하세요.", trigger: "blur" },
    { min: 1, max: 20, message: "방 이름은 1~20자로 입력하세요.", trigger: "blur" }
  ],
  invited: [
    { required: true, message: "최소 1명 이상 초대해야 합니다.", trigger: "change" }
  ]
};

/* 검색 */
const keyword = ref("");
const searchResults = ref([]);

/* 모달을 열 때 초기화 */
watch(
    () => props.modelValue,
    (v) => {
      if (v) {
        form.value.roomName = "";
        form.value.invited = [];
        keyword.value = "";
        searchResults.value = [];
      }
    }
);

/* 친구 검색 */
const searchFriend = (keywordValue: string) => {
  if (!keywordValue) {
    searchResults.value = [];
    return;
  }

  searchResults.value = props.friends.filter((f: any) =>
      f.name.includes(keywordValue)
  );
};

/* 초대 추가 */
const addInvite = (user: any) => {
  if (!form.value.invited.some((u: any) => u.id === user.id)) {
    form.value.invited.push(user);
  }
};

/* 방 생성 */
const createRoom = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return;

    emit("create", {
      roomName: form.value.roomName,
      invited: form.value.invited
    });

    emit("update:modelValue", false);

    toast?.show("새 채팅방이 생성되었습니다! 🎉");
  });
};
const removeInvite = (userId: number) => {
  form.value.invited = form.value.invited.filter(u => u.id !== userId);
};

</script>

<template>
  <BaseModal
      :modelValue="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      title="새 채팅방 만들기"
  >
  <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @submit.prevent
    >

      <!-- 전체 내용 body -->
      <div class="modal-body">

        <!-- 방 이름 -->
        <div class="label">방 이름</div>

        <el-form-item prop="roomName" class="center-item">
          <el-input
              v-model="form.roomName"
              placeholder="채팅방 이름을 입력하세요"
              class="wide-input"
          />
        </el-form-item>

        <!-- 검색 -->
        <div class="label mt-16">친구 검색</div>

        <div class="center-item">
          <SearchForm
              v-model="keyword"
              @search="searchFriend"
              class="wide-input"
          />
        </div>

        <!-- 검색 결과 리스트 -->
        <div class="search-list">
          <div
              class="user-item"
              v-for="user in searchResults"
              :key="user.id"
          >
            <UserCard :user="user" />
            <button class="invite-btn" @click="addInvite(user)">초대</button>
          </div>

          <p v-if="!searchResults.length" class="empty">
            친구를 검색해 초대해보세요.
          </p>
        </div>

        <!-- 초대한 친구 -->
        <div class="label mt-20">초대한 친구</div>

        <el-form-item prop="invited">
          <div class="invited-list">
            <div
                v-for="user in form.invited"
                :key="user.id"
                class="invited-pill"
            >
              <UserCard :user="user" />

              <button class="remove-btn" @click="removeInvite(user.id)">✕</button>

            </div>

            <p v-if="form.invited.length === 0" class="empty">
              아직 초대한 친구가 없습니다.
            </p>
          </div>
        </el-form-item>

      </div>

    </el-form>

    <!-- 하단 버튼 -->
    <template #footer>
      <button class="create-btn" @click="createRoom">
        새 채팅방 만들기
      </button>
    </template>
  </BaseModal>
</template>


<style scoped>
/* 전체 모달 body */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 16px;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
}

/* 라벨 */
.label {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #3b4450;
}

/* el-input 전체 확장 */
.wide-input {
  width: 100%;
}

/* 🔍 검색 리스트 */
.search-list {
  width: 90%;
  min-height: 120px;
  max-height: 260px;
  overflow-y: auto;
  padding: 12px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1px solid rgba(200, 220, 240, 0.4);

  box-shadow:
      0 4px 10px rgba(0,0,0,0.05),
      inset 0 0 12px rgba(255,255,255,0.3);

  animation: fadeIn 0.2s ease;
}

/* 개별 친구 item */
.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  background: #f8fcff;
  border-radius: 12px;
  padding: 10px 12px;

  border: 1px solid #e6eef7;
  transition: 0.2s;
}

.user-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(120, 180, 255, 0.15);
}

/* 초대 버튼 */
.invite-btn {
  background: linear-gradient(135deg, #58d1ff, #45b7e6);
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;

  box-shadow: 0 4px 10px rgba(0, 145, 255, 0.25);
  transition: 0.2s;
}

.invite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 145, 255, 0.35);
}

/* 초대한 친구 pill 영역 */
.invited-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 260px;
  overflow-y: auto;
  padding: 2px;
}

/* 친구 pill */
.invited-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: linear-gradient(135deg, #f0f7ff, #eaf3ff);
  padding: 10px 16px;
  border-radius: 16px;

  border: 1px solid #d3e6ff;
  box-shadow: 0 3px 8px rgba(150, 180, 220, 0.15);

  transition: 0.2s;
}

.invited-pill:hover {
  transform: translateX(4px);
}

/* UserCard 크기 줄이기 */
.invited-pill :deep(.user-card) {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0;
  margin: 0;

  font-size: 14px;
}

/* 제거 버튼 */
.remove-btn {
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 18px;
  color: #a8b3bb;

  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #6c7a85;
}

/* 빈 메시지 */
.empty {
  text-align: center;
  color: #9aa8b0;
  font-size: 13px;
  padding: 10px 0;
}

/* 하단 버튼 */
.create-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;

  background: linear-gradient(135deg, #4ec6ff, #0094f6);
  box-shadow: 0 6px 16px rgba(0, 150, 255, 0.35);

  transition: 0.25s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 150, 255, 0.45);
}

/* 부드러운 등장 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
