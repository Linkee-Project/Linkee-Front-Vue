<script setup lang="ts">
import BaseModal from "@/components/base/modal/BaseModal.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import UserCard from "@/components/home/UserCard.vue";
import { ref, watch, inject } from "vue";

const toast = inject("toast");
/* props */
const props = defineProps({
  modelValue: Boolean,
  friends: Array,
  room: Object   // 초대할 대상 채팅방
});

/* emit */
const emit = defineEmits(["update:modelValue", "invite"]);

/* form */
const form = ref({
  invited: []
});

/* 검색 */
const keyword = ref("");
const searchResults = ref([]);

/* 모달 열릴 때 초기화 */
watch(() => props.modelValue, (v) => {
  if (v) {
    form.value.invited = [];
    keyword.value = "";
    searchResults.value = [];
  }
});

/* 검색 */
const searchFriend = (value) => {
  if (!value) {
    searchResults.value = [];
    return;
  }
  searchResults.value = props.friends.filter((f:any) =>
      f.name.includes(value)
  );
};

/* 초대 추가 */
const addInvite = (user:any) => {
  const alreadyInRoom = props.room.users?.some((u: any) => u.id === user.id)
      || props.room.members?.some(u => u.id === user.id);

  if (alreadyInRoom) {
    toast?.show(`${user.name}님은 이미 이 방에 있습니다.`);
    return;
  }

  const alreadyInvited = form.value.invited.some((u: any) => u.id === user.id);
  if (alreadyInvited) {
    toast?.show(`${user.name}님은 이미 초대 목록에 있습니다.`);
    return;
  }

  form.value.invited.push(user);

};

/* 초대 제거 */
const removeInvite = (id:number) => {
  form.value.invited = form.value.invited.filter(u => u.id !== id);
};

/* 초대 완료 */
const sendInvite = () => {
  emit("invite", {
    roomId: props.room.id,
    invited: form.value.invited
  });

  emit("update:modelValue", false);
  toast?.show("친구가 채팅방에 초대되었습니다! 🎉");
};
</script>


<template>
  <BaseModal
      :modelValue="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      title="친구 초대하기"
  >
    <div class="modal-body">

      <!-- 검색 -->
      <div class="label">친구 검색</div>
      <SearchForm
          v-model="keyword"
          @search="searchFriend"
      />

      <!-- 검색 결과 -->
      <div class="search-list">
        <div class="user-item"
             v-for="user in searchResults"
             :key="user.id"
        >
          <UserCard :user="user" />
          <button class="invite-btn" @click="addInvite(user)">추가</button>
        </div>

        <p v-if="!searchResults.length" class="empty">검색 결과가 없습니다.</p>
      </div>

      <!-- 초대한 친구 -->
      <div class="label mt-20">초대한 친구</div>
      <div class="invited-list">
        <div class="invited-pill"
             v-for="user in form.invited"
             :key="user.id"
        >
          <UserCard :user="user" />
          <button class="remove-btn" @click="removeInvite(user.id)">✕</button>
        </div>

        <p v-if="form.invited.length===0" class="empty">아직 추가된 친구가 없습니다.</p>
      </div>

    </div>

    <template #footer>
      <button class="invite-submit-btn" @click="sendInvite">
        초대하기
      </button>
    </template>
  </BaseModal>
</template>


<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 10px; /* 좌우 동일 여백 */
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.center-item {
  width: 100%;
  justify-content: center;
}

.wide-input {
  width: 100%;
}

/* 검색 결과 리스트 */
.search-list {
  width: 92%;
  min-height: 120px;
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid #e4eaf1;
  border-radius: 10px;
  padding: 10px;
  background: #fafcff;
  margin-top: 10px;
}

/* 검색 결과 유저 카드 */
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.invite-btn {
  background: linear-gradient(90deg, #00bcd4, #4dd0e1);
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
}

/* 초대한 친구 목록 */
.invited-list {
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 6px;
}

/* 초대한 친구 카드 */
.invited-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #f3faff; /* 조금 더 밝고 자연스러운 톤 */
  padding: 8px 15px;
  border-radius: 16px;

  width: 90%;
  margin-bottom: 10px;

  border: 1px solid #e6f2f7; /* 아주 미세한 테두리 (깔끔) */
}

/* UserCard 내부 스타일 */
.invited-pill :deep(.user-card) {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0;
  margin: 0;

  font-size: 14px; /* 텍스트도 살짝 줄여 컴팩트하게 */
}

/* 삭제 버튼 */
.remove-btn {
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 16px;
  color: #9aa8b0;

  padding: 4px; /* 너무 커 보이지 않게 축소 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #5e6a73;
}

.empty {
  text-align: center;
  color: #9aa8b0;
  font-size: 13px;
  padding: 10px;
}

/* 하단 초대 버튼 */
.invite-submit-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  background: linear-gradient(90deg, #00bcd4, #4dd0e1);
}
</style>
