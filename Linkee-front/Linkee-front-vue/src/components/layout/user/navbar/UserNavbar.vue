<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { inject } from "vue";
import ProfileMenuModal from "@/components/home/modal/ProfileMenuModal.vue"; // ← 추가
import InquiryModal from "@/components/home/modal/InquiryModal.vue";

const router = useRouter();

/* 프로필 모달 상태 */
const isProfileModal = ref(false);
/* 문의 모달 상태 */
const isInquiryModal = ref(false);
/*성공 토스트*/
const toast = inject("toast");

/* 로그인한 유저 정보 */
// TODO: 로그인한 유저 가져오기
const user = {
  name: "김명지니어스",
  profile: "/src/assets/profile_img.svg"
};

/* 메뉴 선택 시 실행 */
const handleProfileAction = (menu) => {
  console.log("선택한 메뉴:", menu);

  if (menu === "logout") {
    // TODO: 로그아웃 처리
    console.log("로그아웃");
    return;
  }

  // 계정 관리
  if (menu === "account") {
    router.push("/mypage/profile");
    return;
  }

  // 나의 문제 조회
  if (menu === "my-problem") {
    router.push("/mypage/questions");
    return;
  }

  // 나의 문의 조회
  if (menu === "my-question") {
    router.push("/mypage/inquiry");
    return;
  }

  // 나의 북마크 조회
  if (menu === "my-bookmark") {
    router.push("/mypage/bookmark");
    return;
  }

  // 나의 플레이 기록
  if (menu === "my-record") {
    router.push("/mypage/history");
    return;
  }

  // "문의하기"
  if (menu === "inquiry") {
    isProfileModal.value = false;
    isInquiryModal.value = true;
  }
};
const handleInquirySubmit = (text) => {
  toast.show("문의가 정상적으로 제출되었습니다! 🙌");
};
</script>

<template>
  <header class="header-container">

    <!-- 로고 -->
    <router-link to="/" class="logo-link">
      <div class="logo-container">
        <img src="../../../../assets/linkee_character.svg" class="logo-img"/>
        <span class="logo-text">Linkee</span>
      </div>
    </router-link>

    <!-- 네비게이션 -->
    <nav class="nav-menu">
      <router-link to="/mypage/profile" class="nav-item">👤 마이페이지</router-link>

      <!--문제게시판 버튼-->
      <router-link to = "/problem" class="nav-item" >📜 문제 게시판</router-link>
      <!-- 공지사항 버튼 -->
      <router-link to="/notice" style="text-decoration: none">
        <button class="nav-item">📢 공지사항</button>
      </router-link>
    </nav>

    <!-- 오른쪽 버튼들 -->
    <div class="right-section">

      <!-- 알림 -->
      <button class="icon-btn">
        <img src="../../../../assets/bell.svg" class="icon-img" />
      </button>

      <!-- 프로필 버튼 -->
      <button class="profile-btn" @click="isProfileModal = true">
        <img src="../../../../assets/profile_img.svg" class="profile-img" />
        <span class="profile-name">{{ user.name }}</span>
      </button>
    </div>
  </header>

  <!-- 프로필 모달 추가 -->
  <ProfileMenuModal
      v-model="isProfileModal"
      :user="user"
      @select="handleProfileAction"
  />

  <!-- 문의 모달 -->
  <InquiryModal
      v-model="isInquiryModal"
      @submit="handleInquirySubmit"
  />
</template>


<style scoped>

/* 전체 상단바 스타일 */
.header-container { width: 100%; /* 전체 너비 */
  height: 90px; /* 피그마 기준 헤더 높이 */
  background: #ffffff; /* 하얀색 배경 */
  display: flex; /* 가로 배치 */
  align-items: center; /* 세로 가운데 정렬 */
  justify-content: space-between; /* 좌/중앙/우 배치를 좌우로 나눔 */
  padding: 0 40px; /* 좌우 여백 */
  box-sizing: border-box;
  border-bottom: 1px solid #F6F6F6; /* 아래 얇은 라인 */
}

/* 로고 영역 */
.logo-link {
  display: flex;
  align-items: center;
  cursor: pointer; /* 손가락 모양 */
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 글자색 유지 */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px; /* 로고 이미지와 텍스트 간격 */

}


.logo-img {
  width: 60px;
  height: 55px;
}

.nav-menu {
  display: flex;
  gap: 41px; /* 버튼 간 간격 */
  flex: 1;
  justify-content: center;
}
.logo-text {
  font-size: 36px;   /* 로고 글자 크기 */
  font-weight: 700;  /* 굵게 */
  color: #0094F6;    /* 메인 블루 색상 */
}


/* 메뉴 버튼 스타일 */
.nav-item {
  width: 175px;
  height: 73px;

  background: #FFFFFF; /* 흰색 버튼 */
  border: none;
  border-radius: 50px; /* 둥금 정도 */

  padding: 10px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);

  cursor: pointer;
  transition: 0.2s;  /* hover 애니메이션 */

  box-sizing: border-box; /* 패딩이 크기에 영향을 주지 않도록 설정 */
  text-decoration: none;  /* 링크 밑줄 제거 */
}

/* Hover 시 떠오르는 효과 */
.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 40px rgba(0, 148, 246, 0.25);
}

/* 오른쪽 영역(알림 + 프로필) */
.right-section {
  display: flex;
  align-items: center;
  gap: 15px;

  position: relative;
  right: -30px; /* 원하는 만큼 조절 */
}

/* 알림 버튼 */
.icon-btn {
  background: #FFFFFF;

  width: 73px;
  height: 73px;

  border: none;
  border-radius: 50%; /* 완전 동그라미 모양 */
  padding: 10px;

  cursor: pointer;
  transition: 0.2s;
}
.icon-btn:hover{
  transform: translateY(-2px);
  box-shadow: 5px 5px 40px rgba(0, 148, 246, 0.2);
}

.icon-img {
  width: 58px;
  height: 59px;
}

/* 프로필 버튼 */
.profile-btn {

  width: 226px;
  height: 73px;

  display: flex;
  align-items: center;
  gap: 8px;

  background: #FFFFFF;
  border-radius: 50px;
  padding: 15px 23px;
  border: none;

  cursor: pointer;
  transition: 0.2s;
}
.profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 40px rgba(0, 148, 246, 0.2);
}

/* 프로필 이미지 */
.profile-img {
  width: 46px;
  height: 46px;
  border-radius: 50%; /* 동그란 프로필 이미지 */
}

/* 프로필 이름 */
.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #0094F6; /* 메인 블루 */
}

</style>