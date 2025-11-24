<script setup>
import BaseModal from "@/components/base/modal/BaseModal.vue";

const props = defineProps({
  modelValue: Boolean,
  members: Array
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <BaseModal
      :modelValue="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      title="채팅 멤버"
  >
    <div class="member-container">

      <!-- 멤버 수 표시 -->
      <p class="member-count">총 {{ props.members.length }}명</p>

      <div class="member-list">
        <div
            v-for="m in props.members"
            :key="m.id"
            class="member-item"
        >
          <img :src="m.profile || m.avatar" class="profile" />
          <span class="name">{{ m.name }}</span>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.member-container {
  padding: 12px;
}

/* 멤버 수 표시 */
.member-count {
  font-size: 14px;
  color: #6b7a99;
  margin-bottom: 10px;
  padding-left: 4px;
}

/* 멤버 리스트 */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 멤버 카드 */
.member-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #ffffff;
  border-radius: 14px;

  /* 아기자기한 카드 그림자 */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transition: 0.2s ease;
}

/* hover 시 동적 반응 */
.member-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 아바타 */
.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  /* 감성 그림자 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 이름 */
.name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
</style>
