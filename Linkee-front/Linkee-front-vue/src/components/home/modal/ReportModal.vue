<script setup lang="ts">
import BaseModal from "@/components/base/modal/BaseModal.vue";
import { ref, defineProps, computed, defineEmits } from "vue";
import defaultRoomImg from "@/assets/chat_room_img.svg";

/* props */
const props = defineProps({
  modelValue: Boolean,
  target: Object
});

/* emit */
const emit = defineEmits(["update:modelValue", "submit"]);

/* BaseModal v-model 연동 */
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

/* el-form 사용 */
const formRef = ref(null);
const form = ref({
  title: "",
  content: ""
});

/* 검증 rules */
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

    emit("submit", {
      title: form.value.title,
      content: form.value.content,
      target: props.target
    });

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
      <!-- 입력 영역 -->
      <div class="form-area">

        <el-form-item prop="title" class="item">
          <el-input
              v-model="form.title"
              placeholder="신고 제목을 입력하세요."
              class="input"
          />
        </el-form-item>

        <el-form-item prop="content" class="item">
          <el-input
              type="textarea"
              :rows="6"
              v-model="form.content"
              placeholder="신고 내용을 입력하세요."
              class="textarea"
          />
        </el-form-item>

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

    <!-- 완료 버튼 -->
    <template #footer>
      <button class="submit-btn" @click="submitReport">제출하기</button>
    </template>
  </BaseModal>
</template>

<style scoped>
/* 전체 정렬 */
.form-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
}

/* input 스타일 */
.item .el-input,
.item .el-textarea {
  width: 100%;
}

/* 신고 대상 영역 */
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

/* 제출하기 버튼 */
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

/* textarea 높이 딱 이미지처럼 */
.textarea ::v-deep textarea {
  height: 140px !important;
}
</style>
