<template>
  <!--
    카드 목록(Grid)
    - 정적 상태에서는 반복 없이 직접 몇 개만 배치
    - 추후 API 연결 시 v-for 로 동적 렌더링 예정
  -->
  <div class="quiz-room-grid">
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
    <QuizRoomCard />
  </div>
</template>

<script>
import QuizRoomCard from "./QuizRoomCard.vue";

export default {
  name: "QuizRoomGrid",
  components: { QuizRoomCard }
};
</script>

<style scoped>
.quiz-room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 한 줄에 4개 */
  gap: 20px; /* 카드 간격 */
  margin-top: 20px;
}
</style>
