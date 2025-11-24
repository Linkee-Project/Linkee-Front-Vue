<script setup>
import {defineProps, defineEmits, ref} from "vue";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue", "submit"]);
const close = () => emit("update:modelValue", false);
const inquiryText = ref("");

const submitInquiry = () => {
  if (!inquiryText.value.trim()) return;

  emit ("submit", inquiryText.value);
  inquiryText.value = "";
  close();
}
</script>

<template>
  <div v-if="props.modelValue" class="overlay" @click.self="close">
    <div class="side-modal">

      <h2 class="title">링키에게 문의하기</h2>
      <div class="subtitle">문의 내용을 알려주세요. (필수)</div>

      <textarea
        class="textarea"
        v-model="inquiryText"
        placeholder="문의 내용을 입력해주세요"></textarea>

      <button class="submit-btn" @click="submitInquiry">제출하기</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  z-index: 2000;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.side-modal {
  position: absolute;
  top: 0;
  right: 0;
  width: 310px;
  height: calc(100vh - 50px);
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(18px);
  box-shadow: -8px 0 30px rgba(0,0,0,0.18);
  border-left: 1px solid rgba(255,255,255,0.5);

  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: slideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

@keyframes slideIn {
  from { transform: translateX(110px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #1b3c8c;
  margin-bottom: 14px;
}

.subtitle {
  font-size: 14px;
  margin-bottom: 10px;
  color: #444;
}

.textarea {
  width: 90%;
  height: 400px;
  resize: none;
  border: 1px solid #d7dceb;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  outline: none;
  background: #f8faff;
}

.textarea:focus {
  border-color: #8ab6ff;
  background: #f0f6ff;
}

.submit-btn {
  width: 100%;
  margin-top: auto;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;

  background: linear-gradient(135deg, #0094F6, #6BC8FF);
  box-shadow: 0 6px 18px rgba(0, 148, 246, 0.25);
  transition: 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 148, 246, 0.35);
}
</style>