<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizGameStore } from '@/stores/quizRoomStore.js'
import { useAuthStore } from '@/stores/authStore.js'

// 이미지
import characterImg from '@/assets/linkee_character.svg'
import playerImg from '@/assets/퀴즈방 캐릭터.svg'

// 스토어 정보
const quiz = useQuizGameStore()
const auth = useAuthStore()

// 라우팅 정보
const route = useRoute()
const router = useRouter()

// roomId는 computed로 만들어두면 안전
const roomId = computed(() => Number(route.params.quizRoomId))

const timeLeft = computed(() => {
  // timeLeft가 0이고 아직 문제 데이터만 있을 때를 대비해서
  return quiz.timeLeft || questionData.value.timeLimit || 0;
});

/** 화면에서 쓸 상태는 "퀴즈 스토어"에서 가져옴 **/
const phase = computed(() => quiz.phase)

// 서버에서 내려오는 데이터가 null일 때를 대비해서 "기본값"을 씌운 computed들
const questionData = computed(() => {
  return quiz.currentQuestion || {
    questionNumber: 0,
    totalQuestions: 0,
    questionId: null,
    questionContent: '문제를 불러오는 중입니다...',
    categoryName: '',
    options: [],
    timeLimit: 0,
  }
})

const resultData = computed(() => {
  return quiz.currentResult || {
    correctOptionId: null,
    correctOptionText: '',
    userResults: [],   // [{ userId, userName, isCorrect, ... }]
  }
})
/* 최종 순위 메달 */
const rankingView = computed(() => {
  return quiz.rankingData || {
    totalQuestions: 0,
    rankings: [],      // [{ rank, userId, userName, correctCount, isMe }]
  }
})

function medalClass(rank) {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'blue'
}

// 플레이어 목록 (스토어 → 화면)
const players = computed(() => quiz.players || [])

// 답 제출한 유저인지 체크하는 함수
const isSubmitted = (userId) => {
  return quiz.answerSubmittedUsers.some(u => u.userId === userId)
}

/** 보기 클릭 → 퀴즈 스토어에 "답 제출" 위임 **/
function submitAnswer(optionIndex) {
  quiz.submitAnswer(optionIndex)
}

// (디버그용) 강제로 phase 바꾸고 싶을 때만 사용
function setPhase(next) {
  quiz.phase = next
}

/** ✅ 컴포넌트가 그려질 때: 토큰 + roomId 체크 후 WebSocket 연결 **/
onMounted(() => {
  // 1) roomId 유효성 검사
  if (!roomId.value) {
    alert('잘못된 접근입니다.')
    router.push('/quiz/rooms')
    return
  }

  // 2) 새로고침 직후일 수도 있으니, 필요하면 저장값 복원
  if (!auth.accessToken) {
    auth.loadFromStorage()
  }

  // 3) 토큰 확인
  const token = auth.accessToken
  if (!token) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  // 4) 퀴즈 스토어 초기화 + WebSocket 연결
  quiz.init(token, roomId.value)
  quiz.connectSocket()
})

/** ✅ 페이지 나갈 때 WebSocket 정리 **/
onBeforeUnmount(() => {
  quiz.leaveRoom()
})
</script>

<template>
  <div class="quiz-room">
    <main class="quiz-main">

      <!-- 중앙 메인 패널 -->
      <section class="center-panel">
        <div class="character-wrap">
          <img :src="characterImg" alt="Linkee-Character" class="character-img" />
          <!-- ✅ 서버에서 온 카테고리명 사용 -->
          <div class="category-chip">
            {{ questionData.categoryName || '카테고리' }}
          </div>
        </div>

        <!-- 문제 화면 -->
        <div v-if="phase === 'question'" class="card question-card">
          <div class="card-header">
            <!-- ✅ 문제 번호 / 전체 문제 수 -->
            <div class="question-info">
              문제 {{ questionData.questionNumber }}/{{ questionData.totalQuestions }}
            </div>
            <!-- ✅ 타임리밋 (진짜 카운트다운은 나중에) -->
            <div class="timer" v-if="phase === 'question'">
              <span class="timer-badge">
                {{ timeLeft }}초
              </span>
            </div>

          </div>

          <!-- ✅ 문제 내용 -->
          <div class="question-text">
            {{ questionData.questionContent }}
          </div>

          <!-- ✅ 보기 리스트 -->
          <div class="options-grid">
            <button
                v-for="opt in questionData.options"
                :key="opt.optionId || opt.optionIndex"
                class="option"
                @click="submitAnswer(opt.optionIndex)"
            >
              <span class="index">{{ opt.optionIndex }}.</span>
              <span class="text">{{ opt.optionText }}</span>
            </button>

            <!-- 서버에서 아직 안 내려왔을 때 예비 샘플 -->
            <button
                v-if="questionData.options.length === 0"
                class="option"
                disabled
            >
              <span class="index">-</span>
              <span class="text">문제 데이터를 불러오는 중입니다...</span>
            </button>
          </div>
        </div>


        <!-- 정답 공개 화면 -->
        <div v-else-if="phase === 'answer'" class="card answer-card">
          <div class="answer-header">정답 공개</div>

          <p class="answer-text" v-if="resultData.correctOptionText">
            정답 : {{ resultData.correctOptionText }}
          </p>
          <p class="answer-text" v-else>
            정답 정보를 불러오는 중입니다...
          </p>
        </div>


        <!-- 최종 순위 화면 -->
        <div v-else class="card result-card">
          <div class="answer-header result-header">
            🏆 최종 순위
          </div>

          <!-- 총 문제 수 표시 (선택) -->
          <p style="text-align:center; margin-bottom: 8px;"
             v-if="rankingView.totalQuestions">
            총 {{ rankingView.totalQuestions }}문제
          </p>

          <ul class="rank-list">
            <li
                v-for="row in rankingView.rankings"
                :key="row.userId"
                class="rank-item"
            >
              <!-- 메달 색상은 rank에 따라 -->
              <span class="medal" :class="medalClass(row.rank)">
        {{ row.rank }}
      </span>

              <span class="name">
        <!-- isMe면 강조 (선택) -->
        <strong v-if="row.isMe">{{ row.userName }} (나)</strong>
        <span v-else>{{ row.userName }}</span>
      </span>

              <span class="score">
        {{ row.correctCount }}/{{ rankingView.totalQuestions }}
      </span>
            </li>

            <!-- 데이터 없을 때 예비 문구 -->
            <li
                v-if="rankingView.rankings.length === 0"
                class="rank-item"
            >
      <span class="name" style="flex:1; text-align:center;">
        순위 데이터를 불러오는 중입니다...
      </span>
            </li>
          </ul>
        </div>

      </section>

      <!-- 하단 플레이어 라인 -->
      <section class="players-row">
        <div
            v-for="p in players"
            :key="p.userId"
            class="player-card"
        >
          <!-- 말풍선: 문제 푸는 중 + 이 유저가 제출했을 때만 -->
          <div
              class="speech"
              v-if="phase === 'question' && isSubmitted(p.userId)"
          >
            <span>답안이 제출되었습니다 !</span>
          </div>

          <img :src="playerImg" alt="플레이어" class="player-img" />
          <p class="player-name">{{ p.userName }}</p>
        </div>

        <!-- ⚠️ players가 비어 있을 때 예비 메시지 (선택) -->
        <div
            v-if="players.length === 0"
            class="player-card"
            style="opacity:0.7; font-size:13px;"
        >
          <p>참가자 정보를 불러오는 중...</p>
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
  position: relative;  /* absolute → relative */
  left: 0;
  transform: none;    /* 제거 */
  top: 0;

  margin-top: 24px;   /* 카드 아래 여백으로 위치 조정 */

  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 180px);
  justify-content: center;
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
