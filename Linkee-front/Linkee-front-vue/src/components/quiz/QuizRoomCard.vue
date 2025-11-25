<template>
  <!--
    개별 퀴즈방 카드 UI
    - 정적 상태 기준 레이아웃
    - hover 시 살짝 떠오르는 효과 + 그림자
    - 클릭 시 입장 기능은 추후 @click 추가 예정
  -->
  <div class="quiz-room-card">

    <!-- 상단 정보 -->
    <div class="card-header">
      <span class="room-number">1</span>
      <span class="room-category">카테고리</span>
    </div>

    <!-- 방 제목 -->
    <div class="card-title">
      방제목
    </div>

    <!-- 인원 정보 -->
    <div class="card-footer">
      <span>인원 3 / 5</span>
    </div>

  </div>
</template>

<script>
export default {
  name: "QuizRoomCard",
  // ※ 데이터 연결 시 아래 props 활용
  // props: {
  //   room: Object
  // }
};
</script>

<style scoped>
.quiz-room-card {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid #E6E6E6;
  background: #ECF7FF;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  cursor: pointer;
  transition: all 0.25s ease;
}

/* hover 효과 */
.quiz-room-card:hover {
  transform: translateY(-3px); /* 살짝 위로 */
  box-shadow: 0 4px 20px rgba(0, 148, 246, 0.2); /* 블루 톤 그림자 */
}

/* 상단 */
.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  opacity: 0.8;
}

/* 제목 */
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 인원 표시 */
.card-footer {
  font-size: 14px;
  opacity: 0.7;
}
</style>
