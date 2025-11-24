<script setup lang="ts">
import BaseModal from "@/components/base/modal/BaseModal.vue";
import { ref, defineProps, computed, defineEmits, inject } from "vue";
import defaultRoomImg from "@/assets/chat_room_img.svg";

/* toast */
const toast = inject("toast");

/* props */
const props = defineProps({
  modelValue: Boolean,
  target: Object
});

/* emit */
const emit = defineEmits(["update:modelValue", "submit"]);

/* BaseModal 연동 */
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

/* form */
const formRef = ref(null);
const form = ref({
  title: "",
  content: "",
  type: ""  // 🔥 신고 유형 추가
});

/* 신고 유형 리스트 */
const reportTypes = [
  { key: "chat", label: "채팅" },
  { key: "comment", label: "댓글" },
  { key: "user", label: "유저" },
  { key: "post", label: "게시글" },
  { key: "game", label: "게임" }
];

/* validation rules */
const rules = {
  title: [
    { required: true, message: "신고 제목을 입력하세요.", trigger: "blur" },
    { min: 1, max: 20, message: "제목은 1~20자 이내여야 합니다.", trigger: "blur" }
  ],
  content: [
    { required: true, message: "신고 내용을 입력하세요.", trigger: "blur" },
    { min: 10, max: 300, message: "내용은 10~300자 이내여야 합니다.", trigger: "blur" }
  ]
};

/* 제출 */
const submitReport = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;

    if (!form.value.type) {
      toast?.show("신고 유형을 선택해주세요 ❗");
      return;
    }

    emit("submit", {
      title: form.value.title,
      content: form.value.content,
      type: form.value.type,
      target: props.target
    });

    toast?.show("신고가 접수되었습니다. 📮");

    visible.value = false;
  });
};
</script>

<template>
  <BaseModal v-model="visible" title="신고하기">

    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @submit.prevent
    >
      <div class="form-area">

        <!-- 제목 -->
        <el-form-item prop="title" class="item">
          <el-input
              v-model="form.title"
              placeholder="신고 제목을 입력하세요."
              class="input"
          />
        </el-form-item>

        <!-- 내용 -->
        <el-form-item prop="content" class="item">
          <el-input
              type="textarea"
              :rows="6"
              v-model="form.content"
              placeholder="신고 내용을 입력하세요."
              class="textarea"
          />
        </el-form-item>

        <!-- 신고 유형 선택 -->
        <div class="type-area">
          <span class="type-label">신고 유형 선택</span>

          <div class="type-list">
            <div
                v-for="t in reportTypes"
                :key="t.key"
                class="type-card"
                :class="{ active: form.type === t.key }"
                @click="form.type = t.key"
            >
              {{ t.label }}
            </div>
          </div>
        </div>

        <!-- 신고 대상 -->
        <div class="target-area">
          <span class="target-label">신고 대상</span>

          <div class="target-box">
            <img
                class="target-img"
                :src="props.target?.avatar ?? defaultRoomImg"
            />
            <span class="target-name">
              {{ props.target?.name ?? props.target?.title }}
            </span>
          </div>
        </div>

      </div>

    </el-form>

    <template #footer>
      <button class="submit-btn" @click="submitReport">
        제출하기
      </button>
    </template>

  </BaseModal>
</template>


<style scoped>
.form-area {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 10px;
}

/* ==== 신고 유형 선택 ==== */
.type-area {
  width: 90%;
}

.type-label {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;
  display: block;
}

.type-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.type-card {
  padding: 10px 17px;
  border-radius: 14px;
  background: #f4f8ff;
  /*
  border: 1.5px solid #d4e4ff;
  */
  font-size: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.22s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
}

.type-card.active {
  background: linear-gradient(90deg, #4FC3FC, #0094F6);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(0, 148, 246, 0.3);
}

.item .el-input,
.item .el-textarea {
  width: 100%;
}

.target-area {
  width: 90%;
}

.target-label {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
}

.target-box {
  width: 100%;
  border: 1.5px solid #d8e8ff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
}

.target-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.target-name {
  font-weight: 600;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #0094F6, #4FC3FC);
  color: white;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}

.submit-btn:hover {
  opacity: 0.92;
}

</style>
