<script setup>
import { ref } from 'vue';

// 상단 캐릭터 / 플레이어 캐릭터 이미지
import characterImg from '@/assets/linkee_character.svg';
import playerImg from '@/assets/퀴즈방 캐릭터.svg';

const phase = ref('question');

const setPhase = (next) => {
  phase.value = next;
};

const players = ref([
  { id: 1, name: '김폭주기관차', status: 'submitted' }, // submitted | thinking | connecting
  { id: 2, name: '김명지니어스', status: 'thinking' },
  { id: 3, name: '김이긴', status: 'thinking' },
  { id: 4, name: 'SteamJin', status: 'thinking' },
  { id: 5, name: '디저트마스터', status: 'connecting' }
]);

// TODO : WebSocket 이벤트에 맞게 수정
const showQuestion = () => {phase.value = 'question'};
const showAnswer = () => {phase.value = 'answer'};
const showResult = () => {phase.value = 'result'};
</script>

<template>
  <div class="quiz-room">
    <main class="quiz-main">

      <!-- 중앙 메인 패널 -->
      <section class="center-panel">
        <!-- 공통: 캐릭터 + 카테고리 -->
        <div class="character-wrap">
          <img :src="characterImg" alt="Linkee-Character" class="character-img" />
          <div class="category-chip">DB</div>
        </div>

        <!-- 문제 화면 -->
        <div v-if="phase === 'question'" class="card question-card">
          <div class="card-header">
            <div class="question-info">문제 1/5</div>
            <div class="timer">
              <span class="timer-badge">17초</span>
            </div>
          </div>

          <div class="question-text">
            다음 중 기본 키(Primary Key)의 특징으로 옳은 것은?
          </div>

          <div class="options-grid">
            <button class="option">
              <span class="index">1.</span>
              <span class="text">중복된 값을 허용한다</span>
            </button>
            <button class="option">
              <span class="index">2.</span>
              <span class="text">NULL 값을 가질 수 있다</span>
            </button>
            <button class="option">
              <span class="index">3.</span>
              <span class="text">테이블마다 반드시 하나만 존재한다</span>
            </button>
            <button class="option">
              <span class="index">4.</span>
              <span class="text">두 개 이상의 컬럼에 지정할 수 없다</span>
            </button>
          </div>
        </div>

        <!-- 정답 공개 화면 -->
        <div v-else-if="phase === 'answer'" class="card answer-card">
          <div class="answer-header">정답 공개</div>
          <p class="answer-text">
            정답 : 3. 테이블마다 반드시 하나만 존재한다
          </p>
        </div>

        <!-- 최종 순위 화면 -->
        <div v-else class="card result-card">
          <div class="answer-header result-header">
            🏆 최종 순위
          </div>
          <ul class="rank-list">
            <li class="rank-item">
              <span class="medal gold">1</span>
              <span class="name">김명지니어스</span>
              <span class="score">5/5</span>
            </li>
            <li class="rank-item">
              <span class="medal silver">2</span>
              <span class="name">김폭주기관차</span>
              <span class="score">4/5</span>
            </li>
            <li class="rank-item">
              <span class="medal bronze">3</span>
              <span class="name">김이긴</span>
              <span class="score">3/5</span>
            </li>
            <li class="rank-item">
              <span class="medal blue">4</span>
              <span class="name">디저트마스터</span>
              <span class="score">2/5</span>
            </li>
            <li class="rank-item">
              <span class="medal blue">5</span>
              <span class="name">SteamJin</span>
              <span class="score">1/5</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 하단 플레이어 라인 -->
      <section class="players-row">
        <div
            v-for="p in players"
            :key="p.id"
            class="player-card"
        >
          <div class="speech" v-if="phase === 'question'">
            <span v-if="p.status === 'submitted'">답안이 제출되었습니다 !</span>
            <span v-else>연결중...</span>
          </div>

          <img :src="playerImg" alt="플레이어" class="player-img" />
          <p class="player-name">{{ p.name }}</p>
        </div>
      </section>
    </main>

  <!-- 개발용 테스트 버튼 (나중에 숨겨도 됨) -->
  <footer class="debug-buttons">
    <button @click="setPhase('question')">문제 화면</button>
    <button @click="setPhase('answer')">정답 공개</button>
    <button @click="setPhase('result')">최종 순위</button>
  </footer>
  </div>
</template>

<style scoped>
.quiz-room {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: repeating-linear-gradient(
      90deg,
      #e7f5ff 0,
      #e7f5ff 180px,
      #d7ecff 180px,
      #d7ecff 360px
  );
}

.quiz-main {
  max-width: 1100px;
  margin: 24px auto 16px;
  padding: 0 16px;
  position: relative;       /* 🔹 다시 켜기! absolute 기준 박스로 사용 */
  padding-bottom: 260px;
}

.player-count .icon {
  font-size: 18px;
}

/* 중앙 패널 */
.center-panel {
  background: #0f68c9;
  border-radius: 28px;
  padding: 20px 30px 26px; /* 기존 32px 40px 40px → 줄임 */
  box-shadow: 0 10px 20px rgba(6, 60, 132, 0.3);
  color: #fff;
  max-height: 560px; /* 너무 길어지는 걸 방지 */
}

/* 마스코트 */
.character-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.character-img {
  width: 72px;
  height: 72px;
}

.category-chip {
  margin-top: 8px;
  padding: 6px 20px;
  border-radius: 999px;
  background: #ffffff;
  color: #0f68c9;
  font-weight: 700;
}

/* 카드 공통 */
.card {
  margin-top: 16px;
  border-radius: 24px;
  background: #ffffff;
  color: #202020;
  padding: 20px 26px 22px; /* 내측 여백 줄임 */
}


/* 문제 카드 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-weight: 600;
}

.question-info {
  background: rgba(15, 104, 201, 0.08);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 14px;
}

.timer-badge {
  background: #ffe066;
  border-radius: 999px;
  padding: 6px 14px;
  font-weight: 700;
  font-size: 14px;
}

.question-text {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 22px;
  text-align: center;
}

/* 보기 2x2 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  border: none;
  padding: 12px 18px;
  background: #f5f7fb;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
}

.option .index {
  font-weight: 700;
}

/* 정답/결과 카드 */
.answer-header {
  margin: 0 auto 18px;
  text-align: center;
  border-radius: 999px;
  padding: 8px 24px;
  background: #e8f2ff;
  font-weight: 700;
  font-size: 18px;
  width: max-content;
}

.answer-text {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

.result-header {
  background: #ffe6aa;
}

.rank-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}

.rank-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
  font-size: 16px;
}

.medal {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 10px;
}

.gold {
  background: #ffd43b;
}
.silver {
  background: #dee2e6;
}
.bronze {
  background: #f08c54;
}
.blue {
  background: #a5d8ff;
}

.rank-item .name {
  flex: 1;
}

.rank-item .score {
  font-weight: 600;
}

/* 플레이어 줄 */
.players-row {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 520px;               /* 위치는 취향에 맞게 미세 조정 */

  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 180px);
  justify-content: center;
  column-gap: 0;

  z-index: 1;               /* 🔹 플레이어 레이어는 1 */
}

/* 플레이어 카드 */
.player-card {
  width: 180px; /* 배경 스트라이프와 동일한 폭 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 플레이어 캐릭터 이미지 크기 조정 */
.player-img {
  width: 160px; /* 180px 내부에서 적절한 사이즈 */
  height: auto;
}

/* 말풍선 */
.speech {
  background: #ffe066;
  border-radius: 16px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.player-name {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 600;
}

/* 디버그 버튼 (phase 전환 버튼) */
.debug-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 16px;

  position: relative;
  z-index: 2;
}

.debug-buttons button {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
}

</style>
