<template>
  <div class="quiz-room-header">
    <div class="text-section">
      <h2 class="title">퀴즈방</h2>
      <p class="subtitle">CS 지식 배틀</p>
    </div>

    <div class="button-section">
      <BaseButton class="btn-start">빠른 시작</BaseButton>
      <BaseButton class="btn-create">방 만들기</BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/base/button/BaseButton.vue";

export default {
  name: "QuizRoomHeader",
  components: { BaseButton }
};
</script>

<style scoped>
.quiz-room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #7DBEF2;
  height: 65px;
  padding: 0 60px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* 왼쪽 텍스트 영역 */
.text-section {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

/* ‘퀴즈방’ */
.title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #000000;
}

/* ‘CS 지식 배틀’ – 흰색 */
.subtitle {
  font-size: 14px;
  margin: 4px 0 0 0;
  color: white;
}

/* 버튼 영역 */
.button-section {
  display: flex;
  gap: 12px;
}

/* 버튼 스타일 통일 */
.btn-start,
.btn-create {
  background: #FF9A62 !important;
  color: white !important;
  height: 32px;
  padding: 0 18px;
  border-radius: 18px;
  font-size: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-start:hover,
.btn-create:hover {
  transform: translateY(-2px);
}
</style>
