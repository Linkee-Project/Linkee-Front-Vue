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
        <div class="form-row nickname-row">
          <label for="nickname">닉네임</label>
          <div class="input-with-button">
            <input
                id="nickname"
                v-model="nickname"
                type="text"
                class="input"
                @blur="validateField('nickname')"
            />
            <BaseButton class="change-nickname-btn" color="blue" size="small" @click="updateNickname">닉네임 변경</BaseButton>
          </div>
          <p class="warning" v-if="validationErrors.nickname">{{ validationErrors.nickname }}</p>
        </div>

        <!-- 이메일 -->
        <div class="form-row">
          <label>이메일</label>
          <div class="email-text">{{ email }}</div>
        </div>

        <!-- 현재 비밀번호 -->
        <div class="form-row">
          <label for="currentPw">현재 비밀번호</label>
          <input
              id="currentPw"
              v-model="currentPw"
              type="password"
              class="input"
              @blur="validateField('currentPw')"
          />
          <p class="warning" v-if="validationErrors.currentPw">{{ validationErrors.currentPw }}</p>
        </div>

        <!-- 새 비밀번호 -->
        <div class="form-row">
          <label for="newPw">새 비밀번호</label>
          <input
              id="newPw"
              v-model="newPw"
              type="password"
              class="input"
              @blur="validateField('newPw')"
          />
          <p class="warning" v-if="validationErrors.newPw">{{ validationErrors.newPw }}</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-row">
          <label for="confirmPw">비밀번호 확인</label>
          <input
              id="confirmPw"
              v-model="confirmPw"
              type="password"
              class="input"
              @blur="validateField('confirmPw')"
          />
          <p class="warning" v-if="validationErrors.confirmPw">{{ validationErrors.confirmPw }}</p>
        </div>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="button-area">
      <button class="delete-btn" @click="openDeleteModal">회원탈퇴</button>
      <BaseButton color="blue" size="small" @click="updatePassword">수정</BaseButton>
    </div>

    <ConfirmationModal
      :visible="isDeleteModalVisible"
      title="회원 탈퇴"
      message="정말로 회원 탈퇴 하시겠습니까?"
      confirm-text="탈퇴"
      cancel-text="취소"
      @confirm="confirmDeleteAccount"
      @cancel="isDeleteModalVisible = false"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'; // useRouter import
import { useAuthStore } from '@/stores/authStore'; // useAuthStore import
import BaseButton from '@/components/base/button/BaseButton.vue';
import api from '@/api/axios.js'; // API import
import { debounce } from '@/utils/debounce.js'; // debounce import
import ConfirmationModal from '@/components/common/modal/ConfirmationModal.vue'; // ConfirmationModal import

const router = useRouter();
const authStore = useAuthStore();

const oldNickname = ref(''); // 기존 닉네임을 저장
const nickname = ref('');
const email = ref('');
const currentPw = ref('');
const newPw = ref('');
const confirmPw = ref('');

const validationErrors = ref({});
const isDeleteModalVisible = ref(false); // 회원탈퇴 모달 가시성

// 회원탈퇴 모달 열기
const openDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

// 회원탈퇴 확인 처리
const confirmDeleteAccount = async () => {
  isDeleteModalVisible.value = false; // 모달 닫기
  try {
    await api.delete('/users/user/delete');
    alert('회원탈퇴가 성공적으로 처리되었습니다.');
    authStore.clearAuthState(); // 로그아웃 처리
    router.push('/login'); // 로그인 페이지로 리디렉션
  } catch (error) {
    console.error('회원탈퇴 실패:', error);
    alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
};

// 닉네임 유효성 검사 규칙
const nicknameRules = [
  { required: true, message: '닉네임은 필수 입력입니다.' },
  { min: 2, max: 10, message: '닉네임은 2~10자로 입력해야 합니다.' },
  { pattern: /^[a-zA-Z0-9가-힣]+$/, message: '닉네임은 한글, 영어, 숫자만 포함할 수 있습니다.' },
];

// 비밀번호 유효성 검사 규칙
const passwordRules = [
  { required: true, message: '비밀번호는 필수 입력입니다.' },
  { min: 8, max: 20, message: '비밀번호는 8~20자로 입력해야 합니다.' },
  { pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.' },
];

// 필드별 유효성 검사
const validateField = (field) => {
  let error = '';
  switch (field) {
    case 'nickname':
      for (const rule of nicknameRules) {
        if (rule.required && !nickname.value) {
          error = rule.message;
          break;
        }
        if (rule.min && nickname.value.length < rule.min) {
          error = rule.message;
          break;
        }
        if (rule.max && nickname.value.length > rule.max) {
          error = rule.message;
          break;
        }
        if (rule.pattern && !rule.pattern.test(nickname.value)) {
          error = rule.message;
          break;
        }
      }
      validationErrors.value.nickname = error;
      break;
    case 'currentPw':
      if (!currentPw.value) {
        error = '현재 비밀번호는 필수 입력입니다.';
      }
      validationErrors.value.currentPw = error;
      break;
    case 'newPw':
      if (newPw.value === '' && confirmPw.value === '') { // 새 비밀번호와 확인 비밀번호 모두 비어있으면 유효성 검사 통과 (변경 안 함)
        validationErrors.value.newPw = '';
        validationErrors.value.confirmPw = '';
        return true;
      }
      for (const rule of passwordRules) {
        if (rule.required && !newPw.value) {
          error = rule.message;
          break;
        }
        if (rule.min && newPw.value.length < rule.min) {
          error = rule.message;
          break;
        }
        if (rule.max && newPw.value.length > rule.max) {
          error = rule.message;
          break;
        }
        if (rule.pattern && !rule.pattern.test(newPw.value)) {
          error = rule.message;
          break;
        }
      }
      validationErrors.value.newPw = error;
      if (confirmPw.value !== '') { // 새 비밀번호가 변경되었으니 확인 비밀번호도 다시 검증
        validateField('confirmPw');
      }
      break;
    case 'confirmPw':
      if (newPw.value === '' && confirmPw.value === '') { // 새 비밀번호와 확인 비밀번호 모두 비어있으면 유효성 검사 통과 (변경 안 함)
        validationErrors.value.newPw = '';
        validationErrors.value.confirmPw = '';
        return true;
      }
      if (!confirmPw.value) {
        error = '비밀번호 확인은 필수 입력입니다.';
      } else if (newPw.value !== confirmPw.value) {
        error = '비밀번호가 일치하지 않습니다.';
      }
      validationErrors.value.confirmPw = error;
      break;
  }
  return !error;
};

// 모든 필드 유효성 검사
const validateForm = async () => {
  let isValid = true;
  // 닉네임 필드 유효성 검사
  isValid = validateField('nickname');
  if (validationErrors.value.nickname) {
    isValid = false;
  }

  // 비밀번호 변경이 있을 경우에만 비밀번호 관련 필드 유효성 검사
  const isPasswordChangeAttempted = currentPw.value !== '' || newPw.value !== '' || confirmPw.value !== '';
  if (isPasswordChangeAttempted) {
    isValid = validateField('currentPw') && isValid;
    isValid = validateField('newPw') && isValid;
    isValid = validateField('confirmPw') && isValid;
  } else {
    // 비밀번호 변경 시도가 없으면 관련 오류 초기화 (옵션)
    validationErrors.value.currentPw = '';
    validationErrors.value.newPw = '';
    validationErrors.value.confirmPw = '';
  }


  return isValid;
};

const updateNickname = async () => {
  // 닉네임 유효성 검사
  const isValid = validateField('nickname');
  if (!isValid) {
    alert('닉네임 정보를 다시 확인해주세요.');
    return;
  }

  // 닉네임 변경이 없는 경우
  if (nickname.value === oldNickname.value) {
    alert('변경할 닉네임이 없습니다.');
    return;
  }

  try {
    console.log('닉네임 변경 시도:', nickname.value);
    await api.patch('/users/user', { nickName: nickname.value });
    oldNickname.value = nickname.value; // 성공적으로 변경되면 oldNickname 업데이트
    alert('닉네임이 성공적으로 업데이트되었습니다.');
    validationErrors.value.nickname = ''; // 성공 시 에러 메시지 초기화
  } catch (error) {
    console.error('닉네임 업데이트 실패:', error);
    if (error.response && error.response.status === 409) {
      alert('닉네임이 이미 사용 중입니다. 다른 닉네임을 사용해주세요.');
      validationErrors.value.nickname = '이미 존재하는 닉네임입니다.';
    } else {
      alert('닉네임 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

const updatePassword = async () => {
  // 비밀번호 변경 시도 여부 확인
  const isPasswordChangeAttempted = currentPw.value !== '' || newPw.value !== '' || confirmPw.value !== '';

  if (!isPasswordChangeAttempted) {
    alert('변경할 비밀번호 정보가 없습니다.');
    return;
  }

  // 비밀번호 관련 필드 유효성 검사
  let isValid = true;
  isValid = validateField('currentPw') && isValid;
  isValid = validateField('newPw') && isValid;
  isValid = validateField('confirmPw') && isValid;

  if (!isValid) {
    alert('비밀번호 정보를 다시 확인해주세요.');
    return;
  }

  try {
    console.log('비밀번호 변경 시도 감지');
    const response = await api.post('/users/user/password/change', {
      oldPassword: currentPw.value,
      newPassword: newPw.value
    });

    // 백엔드 응답이 문자열일 경우와 객체일 경우를 모두 처리
    const isSuccessString = typeof response.data === 'string' && response.data.includes('성공적으로 변경되었습니다.');
    const isSuccessObject = typeof response.data === 'object' && response.data.success === true;

    if (isSuccessString || isSuccessObject) {
      alert('비밀번호가 성공적으로 업데이트되었습니다.');
      currentPw.value = '';
      newPw.value = '';
      confirmPw.value = '';
      validationErrors.value.currentPw = '';
      validationErrors.value.newPw = '';
      validationErrors.value.confirmPw = '';
    } else {
      // 백엔드에서 success: false를 보낼 때의 에러 처리 (객체 응답만 해당)
      if (typeof response.data === 'object' && response.data.errorCode === '1005') {
        alert('현재 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        validationErrors.value.currentPw = '현재 비밀번호가 일치하지 않습니다.'; // 특정 필드에 에러 표시
      } else {
        alert(`비밀번호 업데이트에 실패했습니다: ${response.data?.message || '알 수 없는 오류'}`);
      }
    }
  } catch (error) {
    console.error('비밀번호 업데이트 실패:', error);
    if (error.response) {
        if (error.response.status === 401) {
            alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
            // 선택적으로 로그인 페이지로 리디렉션 (Vue Router 필요)
            // import { useRouter } from 'vue-router';
            // const router = useRouter();
            // router.push('/login');
        } else if (error.response.status === 400 && error.response.data?.errorCode === '1005') {
            alert('현재 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            validationErrors.value.currentPw = '현재 비밀번호가 일치하지 않습니다.'; // 특정 필드에 에러 표시
        } else {
            alert(`비밀번호 업데이트에 실패했습니다: ${error.response.data?.message || '알 수 없는 오류'}`);
        }
    } else {
        alert('비밀번호 업데이트에 실패했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.');
    }
  }
};

const changeProfile = () => {
  alert('프로필 사진 변경 기능은 아직 준비중입니다!');
}

// 사용자 정보 불러오기
const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/user/me');
    const userData = response.data;
    if (userData) {
      nickname.value = userData.userNickname;
      oldNickname.value = userData.userNickname; // 기존 닉네임 저장
      email.value = userData.userEmail;
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    // 에러 처리 로직 추가 (예: 토스트 메시지 표시)
  }
};

onMounted(() => {
  fetchUserProfile();
});
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

.nickname-row {
  display: flex;
  flex-direction: column;
}

.input-with-button {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-with-button .input {
  flex-grow: 1;
}

.change-nickname-btn {
  white-space: nowrap; /* 버튼 텍스트가 줄 바꿈되지 않도록 */
  padding: 10px 15px; /* 버튼 패딩 조정 */
  border-radius: 20px; /* 버튼 모양 조정 */
  font-size: 14px;
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
}
</style>
