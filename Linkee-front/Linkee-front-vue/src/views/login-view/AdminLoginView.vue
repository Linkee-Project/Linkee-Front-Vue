<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="logo">🔗 관리자 Linkee</h1>
      <p class="subtitle">계정으로 로그인하세요</p>

      <form @submit.prevent>
        <input v-model="email" type="email" placeholder="이메일" />
        <input v-model="password" type="password" placeholder="비밀번호" />

        <button type="submit" class="btn-primary glow">
          로그인
        </button>
      </form>

      <p class="message"></p>

      <p class="signup-link">
        아직 계정이 없나요?
        <router-link to="/signup">회원가입</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Noto+Sans+KR:wght@400;700&display=swap');

body {
  margin: 0;
  font-family: "Poppins", "Noto Sans KR", sans-serif;
}

.login-wrapper {
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0094f6, #4fc3f7, #e1f5fe);
  display: flex;
  justify-content: center;
  align-items: center;
}

body::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3), transparent 40%),
  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.25), transparent 40%);
  animation: floatBg 15s infinite alternate;
  z-index: 0;
}

@keyframes floatBg {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-10%, -10%); }
}

.login-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 148, 246, 0.25);
  padding: 3rem 2.5rem;
  text-align: center;
  width: 360px;
  z-index: 1;
  animation: fadeIn 1.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo {
  font-size: 2.4rem;
  color: #0094f6;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(0, 148, 246, 0.5);
}

.subtitle {
  color: #555;
  font-size: 1rem;
  margin-bottom: 2rem;
}

input {
  width: 90%;
  padding: 0.9rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1.5px solid #b3e5fc;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

input:focus {
  border-color: #0094f6;
  box-shadow: 0 0 8px rgba(0, 148, 246, 0.3);
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary.glow {
  background-color: #0094f6;
  color: #fff;
  border: none;
  box-shadow: 0 0 10px rgba(0, 148, 246, 0.6);
}

.btn-primary.glow:hover {
  background-color: #0072d2;
  transform: scale(1.03);
  box-shadow: 0 0 25px rgba(0, 148, 246, 0.9);
}

.message {
  margin-top: 1rem;
  height: 1.2rem;
}

.signup-link {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #555;
}

.signup-link a {
  color: #0094f6;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
