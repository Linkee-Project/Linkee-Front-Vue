<template>
  <div class="profile-container">
    <div class="profile-content-grow">
      <!-- 제목 -->
      <h2 class="section-title">프로필 사진</h2>

      <!-- 프로필 이미지 영역 -->
      <div class="profile-image-box">
        <img src="../../../assets/profile_img.svg" alt="profile-image-box" class="profile-image" />
        <div class="edit-icon" @click="changeProfile">
          <img src="../../../assets/프로필%20수정%20로고.svg" alt="edit-icon"/>
        </div>
      </div>

      <!-- 내 정보 -->
      <h2 class="section-title">내 정보</h2>

      <div class="form-wrapper">
        <!-- 닉네임 -->
        <div class="form-row">
          <label>닉네임</label>
          <input
              v-model="nickname"
              type="text"
              class="input"
          />
          <p class="warning" v-if="nicknameExists">이미 존재하는 닉네임입니다.</p>
        </div>

        <!-- 이메일 -->
        <div class="form-row">
          <label>이메일</label>
          <div class="email-text">{{ email }}</div>
        </div>

        <!-- 현재 비밀번호 -->
        <div class="form-row">
          <label>현재 비밀번호</label>
          <input v-model="currentPw" type="password" class="input" />
        </div>

        <!-- 새 비밀번호 -->
        <div class="form-row">
          <label>새 비밀번호</label>
          <input v-model="newPw" type="password" class="input" />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-row">
          <label>비밀번호 확인</label>
          <input v-model="confirmPw" type="password" class="input" />
          <p class="warning" v-if="newPw !== confirmPw">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>
      </div>
    </div>
    
    <!-- 버튼 영역 -->
    <div class="button-area">
      <button class="delete-btn">회원탈퇴</button>
      <BaseButton color="blue" size="small" @click="saveProfile">수정</BaseButton>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue';


const nickname = ref('김명지니어스')
const nicknameExists = ref(false)

const email = ref('jdo9886@naver.com')

const currentPw = ref('')
const newPw = ref('')
const confirmPw = ref('')

// 프로필 사진 변경 버튼
const changeProfile = () => {
  alert('프로필 사진 변경 기능은 아직 준비중입니다!')
}

// 저장 버튼 클릭
const saveProfile = () => {
  if (newPw.value !== confirmPw.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  alert('프로필 정보가 저장되었습니다.')
}
</script>


<style scoped>
.profile-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);




  box-sizing: border-box;
}

.section-title {
  color: #0094F6;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
}

.profile-image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 40px;
}

.profile-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #E0F2FF;
}

.edit-icon {
  position: absolute;
  bottom: 4px;
  right: calc(50% - 70px - 10px);
  color: white;
  padding: 8px 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}

.form-row {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.input {
  width: 100%;
  padding: 12px 18px;
  border-radius: 25px;
  background: #f8f8f8;
  border: 1px solid #eee;
  outline: none;
  box-sizing: border-box;
  font-size: 16px;
  color: #333;
}

.email-text {
  font-size: 16px;
  font-weight: 500;
  padding: 8px 18px;
  color: #555;
  background: #f8f8f8;
  border-radius: 25px;
  border: 1px solid #eee;
  box-sizing: border-box;
}

.warning {
  margin-top: 6px;
  font-size: 14px;
  color: #ff4a4a;
  text-align: right;
  padding-right: 10px;
}

.button-area {
  display: flex;
  justify-content: space-between; /* 버튼들을 양쪽 끝으로 배치 */
  gap: 15px;
  margin-top: 30px;

}

/* --- 버튼 스타일 수정 --- */
.delete-btn {
  background: transparent;
  border: 1px solid #FF6B6B;
  color: #FF6B6B;
  padding: 12px 25px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: #FF6B6B;
  color: white;
}

/* 반응형 */
@media (max-width: 768px) {
  .profile-container {
    padding: 20px;

  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  .edit-icon {
    right: calc(50% - 45px - 5px);
    bottom: 0px;
  }
  
  .edit-icon img {
    width: 30px;
  }

  .button-area {
    flex-direction: column;
    gap: 10px;
    justify-content: center;
  }

  .delete-btn {
    width: 100%;
  }

  /* BaseButton에 대한 반응형 처리 */
  .button-area .btn {
    width: 100%;
    min-width: unset;
  }
}
</style>
