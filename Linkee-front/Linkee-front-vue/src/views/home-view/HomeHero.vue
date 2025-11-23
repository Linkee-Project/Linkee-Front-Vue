<script setup lang="ts">

</script>

<template>
  <!-- 전체 히어로 + 푸터를 감싸는 최상위 컨테이너 (Vue는 최상위 1개 필요) -->
  <div class="home-wrapper">

    <!-- 메인 히어로 영역 -->
    <main class="hero">
      <!-- 좌측 안내/캐릭터 영역 -->
      <section class="hero-left">
        <!-- 캐릭터 이미지 -->
<!--        <img
            src="@/assets/linkee_character.svg"
            alt="링키 캐릭터"
            class="mascot"
        />-->

        <!-- 메인 문구 -->
        <h1 class="headline">오늘도 퀴즈로 두뇌를 깨워볼까요?</h1>

        <!-- 서브 설명 -->
        <p class="subhead">실시간 CS 퀴즈 플랫폼, Linkee</p>
      </section>

      <!-- 우측 버튼 영역 -->
      <section class="hero-right">
        <!-- 4개 주요 이동 버튼 -->
        <div class="action-grid">

          <!-- 퀴즈방 이동 버튼 -->
          <a class="gbtn g1"  aria-label="퀴즈방 입장">
            🧠 퀴즈방 입장
          </a>

          <!-- 자율방 이동 버튼 -->
          <router-link
              to="/chat/game/rooms"
              class="gbtn g2"
              aria-label="자율방 입장"
          >
            💬 자율방 입장
          </router-link>

        </div>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
      v2.0.0 · © 2025 Linkee
    </footer>

  </div>
</template>

<style scoped>
:root{
  --blue:#0094F6;
  --sky:#4FC3F7;
  --mint:#00BCD4;
  --bg:#E3F2FD;
  --text:#333;
  --text-sub:#666;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:"Poppins","Noto Sans KR",sans-serif;
  color:var(--text);
  overflow-x:hidden;
}
.home-wrapper {
   min-height: calc(100vh - 110px); /* 헤더 제외 전체 높이 */
   display: flex;
   flex-direction: column;
   justify-content: center; /* 세로 중앙 정렬 */
   align-items: center;     /* 가로 중앙 정렬 */
   padding-bottom: 2rem;
 }

.hero{
  max-width:1200px;
  margin: 0 auto;
  padding:1rem 1.2rem;
  display:grid;
  gap:2.4rem;
  grid-template-columns:1.1fr .9fr;
  align-items:center;
}

.hero-left{text-align:left}
/*.mascot{
  width:50px; height:auto; display:block;
  filter:drop-shadow(0 12px 24px rgba(0,148,246,.25));
  animation:float 3.4s ease-in-out infinite;
}*/
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-10px)}
}
.headline{
  font-size:2.2rem; line-height:1.25; margin:.8rem 0 .4rem;
  color:#0e2a4a; text-shadow:0 0 24px rgba(79,195,247,.35);
  font-weight:800;

  /*둥둥 떠다니는 애니메이션*/
  animation: floatUpDown 2s ease-in-out infinite;
}

/* ⬆⬇ 위아래로 천천히 움직이는 애니메이션 */
@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}
.subhead{color:var(--text-sub); font-weight:600}

/* ===== Gradient Buttons (no border) ===== */
.action-grid{
  display:grid; gap:1rem;
  grid-template-columns:1fr; width:min(360px, 90%);
  margin:0 auto;
}
.gbtn{
  display:flex; align-items:center; justify-content:center;
  padding:1rem 1.2rem; border-radius:16px; color:#fff; text-decoration:none;
  font-weight:800; letter-spacing:.2px;
  box-shadow:0 14px 32px rgba(0,148,246,.30);
  transition:transform .18s ease, box-shadow .25s ease, filter .25s ease;
  backdrop-filter:blur(2px);
}
.gbtn:hover{transform:translateY(-2px) scale(1.02); box-shadow:0 18px 40px rgba(0,148,246,.45); filter:saturate(1.08)}
.g1{background:linear-gradient(90deg, #0288D1, #03A9F4)}
.g2{background:linear-gradient(90deg, #00BCD4, #4DD0E1)}

/* ===== Footer ===== */
.footer{
  text-align:center; padding:1.4rem; color:#476276; font-size:.85rem; opacity:.8;
}
</style>
