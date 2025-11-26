<template>
  <div class="signup-wrapper">
    <div class="signup-card">
      <h1 class="logo">🔗 Linkee</h1>
      <p class="subtitle">회원가입하고 Linkee 서비스를 시작하세요</p>

      <!-- 회원가입 폼 -->
      <form @submit.prevent="validateSignup">

        <div class="email-row">
          <input v-model="email" type="email" placeholder="이메일" required/>

          <button type="button" class="verify-btn" @click="sendVerifyEmail">
            {{ sent ? "재전송" : "인증번호 전송" }}
          </button>
        </div>

        <p class="error-message">{{ emailError }}</p>

        <!-- 인증번호 입력창 (전송된 이후에만 표시) -->
        <div v-if="sent" class="verify-section">
          <div class="verify-row">
            <input v-model="verifyCode" type="text" placeholder="인증번호 입력"/>

            <!-- 인증번호 확인 버튼 -->
            <button type="button" class="verify-check-btn" @click="checkVerifyCode">
              확인
            </button>
          </div>

          <!-- 인증 결과 메시지 -->
          <p class="verify-result" :class="{ success: verifySuccess, fail: verifyFail }">
            {{ verifyMessage }}
          </p>

          <p class="verify-info">이메일로 전송된 인증번호를 입력하세요.</p>
        </div>

        <input v-model="nickname" type="text" placeholder="닉네임" required/>
        <input v-model="password" type="password" placeholder="비밀번호" required/>
        <input v-model="confirm" type="password" placeholder="비밀번호 확인" required/>

        <button type="submit" class="btn-primary glow">회원가입</button>
      </form>

      <p class="message">{{ message }}</p>

      <!-- SNS 회원가입 -->
      <div class="social-login">
        <p>또는 SNS로 간편 회원가입</p>
        <a
            href="http://localhost:8080/oauth2/authorization/naver"
            class="naver-btn"
        >
          <img src="@/assets/naver_logo.svg" alt="네이버 로고"/> 네이버로 가입하기
        </a>
      </div>

      <p class="login-link">
        이미 계정이 있나요?
        <router-link to="/login">로그인</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sendEmailCode, signupApi, verifyEmailCode } from "@/api/authApi.js";

const router = useRouter();  // 🔥 추가됨

const email = ref("");
const nickname = ref("");
const password = ref("");
const confirm = ref("");

const emailError = ref("");
const message = ref("");

const sent = ref(false);           // 인증 메일 전송 여부
const verifyCode = ref("");        // 입력한 인증번호
const verifyMessage = ref("");
const verifySuccess = ref(false);
const verifyFail = ref(false);

const generatedCode = ref("");     // 실제 인증번호 (임시 생성)


// 이메일 인증 요청
const sendVerifyEmail = async () => {
  emailError.value = "";

  if (!email.value.includes("@")) {
    emailError.value = "올바른 이메일 형식이 아닙니다.";
    return;
  }

  try {
    const res = await sendEmailCode(email.value);

    sent.value = true;
    verifyMessage.value = "";
    verifyFail.value = false;
    verifySuccess.value = false;

    message.value = "인증번호가 이메일로 전송되었습니다!";
  } catch (e) {
    message.value = "인증 메일 전송 실패";
  }
};


// 이메일 인증번호 검증 버튼
const checkVerifyCode = async () => {
  if (verifyCode.value.trim() === "") {
    verifyFail.value = true;
    verifySuccess.value = false;
    verifyMessage.value = "인증번호를 입력하세요.";
    return;
  }

  try {
    const res = await verifyEmailCode(email.value, verifyCode.value);

    if (res.data === "인증 성공!") {
      verifySuccess.value = true;
      verifyFail.value = false;
      verifyMessage.value = "✔ 인증 완료!";
    } else {
      verifySuccess.value = false;
      verifyFail.value = true;
      verifyMessage.value = "❌ 인증 실패 또는 만료됨";
    }
  } catch (e) {
    verifySuccess.value = false;
    verifyFail.value = true;
    verifyMessage.value = "서버 오류: 인증 불가";
  }
};


// 회원가입 및 검증
const validateSignup = async () => {
  message.value = "";
  emailError.value = "";

  if (!email.value.includes("@")) {
    emailError.value = "올바른 이메일 형식이 아닙니다.";
    return;
  }

  if (password.value !== confirm.value) {
    message.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  if (!verifySuccess.value) {
    message.value = "이메일 인증을 완료해주세요.";
    return;
  }

  // 실제 회원가입요청
  const requestBody = {
    userEmail: email.value,
    userNickname: nickname.value,
    userPassword: password.value
  };

  try {
    const res = await signupApi(requestBody);

    // 응답 문자열에 "완료" 포함되면 성공
    if (typeof res.data === "string" && res.data.includes("완료")) {
      alert("회원가입이 완료되었습니다!");
      router.replace("/login");
      return;
    }

    message.value = "회원가입 실패";

  } catch (e) {
    console.error("회원가입 실패:", e);

    // catch로 와도 서버 응답 문자열이면 성공 처리
    const data = e.response?.data;
    if (typeof data === "string" && data.includes("완료")) {
      alert("회원가입이 완료되었습니다!");
      router.replace("/login");
      return;
    }

    message.value =
        e.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Noto+Sans+KR:wght@400;700&display=swap');

.signup-wrapper {
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0094f6, #4fc3f7, #e1f5fe);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* ✨ 움직이는 반짝 배경 */
.signup-wrapper::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3), transparent 40%),
  radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.25), transparent 40%);
  animation: floatBg 15s infinite alternate;
  z-index: 0;
}

@keyframes floatBg {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-10%, -10%);
  }
}

/* 🧊 회원가입 카드 */
.signup-card {
  position: relative;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 148, 246, 0.25);
  padding: 2rem 2rem;
  text-align: center;
  width: 380px;
  z-index: 1;
  animation: fadeIn 1.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🔗 로고 */
.logo {
  font-size: 2rem;
  color: #0094f6;
  font-weight: 800;
  margin-bottom: 0.4rem;
  text-shadow: 0 0 15px rgba(0, 148, 246, 0.4);
}

/* 💬 부제 */
.subtitle {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* ✏️ 입력창 스타일 */
input {
  width: 90%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1.5px solid #b3e5fc;
  background: rgba(255, 255, 255, 0.85);
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

input:focus {
  border-color: #0094f6;
  box-shadow: 0 0 8px rgba(0, 148, 246, 0.3);
}

/* 🚨 에러 메시지 */
.error-message {
  color: #ff5252;
  font-size: 0.85rem;
  margin-top: -0.8rem;
  margin-bottom: 0.5rem;
  height: 0.9rem;
}

/* 💎 회원가입 버튼 */
.btn-primary {
  width: 90%;
  padding: 0.7rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
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

/* 메시지 */
.message {
  margin-top: 1rem;
  font-size: 0.9rem;
  height: 1.2rem;
}

/* SNS 로그인 */
.social-login {
  text-align: center;
  margin-top: 1.8rem;
}

.social-login p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

/* 네이버 버튼 */
.naver-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #03c75a;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.naver-btn:hover {
  background-color: #02b350;
}

.naver-btn img {
  width: 20px;
  height: 20px;
}

/* 로그인 링크 */
.login-link {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #555;
}

.login-link a {
  color: #0094f6;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}


.email-row {
  width: 96%;
  display: flex;
  gap: 10px;
  /* margin-bottom: 0.5rem; */
  flex-direction: row;
  padding-left: 0.4rem;
}

.email-row input {
  flex: 1;
}

.verify-btn {
  width: 4.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  background: #0094f6;
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.verify-btn:hover {
  background: #007cd6;
}

.verify-info {
  color: #444;
  font-size: 0.8rem;
  margin-top: -0.5rem;
  margin-bottom: 0.8rem;
}


/* 인증번호 입력창 */
.verify-row input {
  flex: 1;
  padding: 0.7rem;
  border-radius: 8px;
  border: 1.5px solid #b3e5fc;
  background: rgba(255, 255, 255, 0.85);
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin: 0;
}

.verify-row input:focus {
  border-color: #0094f6;
  box-shadow: 0 0 8px rgba(0, 148, 246, 0.3);
}


.verify-row {
  width: 60%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-left: 20%;
}

.verify-check-btn {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: none;
  background: #00b894;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;
}


.verify-check-btn:hover {
  background: #009f7a;
}

/* 인증 결과 메시지 */
.verify-result {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  min-height: 1rem;
}

.verify-result.success {
  color: #00a86b;
  font-weight: 700;
}

.verify-result.fail {
  color: #ff5252;
  font-weight: 700;
}
</style>
