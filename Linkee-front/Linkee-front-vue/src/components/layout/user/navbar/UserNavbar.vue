<script setup>
import {computed, ref, onMounted} from "vue";
import { useRouter } from "vue-router";
import { inject } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { createInquiry } from "@/api/inquiryApi.js";
import { getAlarmBoxesMe } from "@/api/alarmApi.js"; // alarmApi import
import ProfileMenuModal from "@/components/home/modal/ProfileMenuModal.vue";
import InquiryModal from "@/components/home/modal/InquiryModal.vue";
import NotificationModal from "@/components/home/modal/NotificationModal.vue";

import bellIcon from "@/assets/bell.svg";
import bellCheckIcon from "@/assets/bell_check.svg";

const router = useRouter();
const auth = useAuthStore();

const user = computed(() => auth.user || {});


/* 모달 상태 */
const isProfileModal = ref(false);
const isInquiryModal = ref(false);
const isNotificationModal = ref(false);

const toast = inject("toast");

/* 메뉴 선택 시 실행 */
const handleProfileAction = async (menu) => {
  console.log("선택한 메뉴:", menu);

  if (menu === "logout") {
    await auth.logout();
    return;
  }

  if (menu === "account") return router.push("/mypage/profile");
  if (menu === "my-problem") return router.push("/mypage/questions");
  if (menu === "my-question") return router.push("/mypage/inquiry");
  if (menu === "my-bookmark") return router.push("/mypage/bookmark");
  if (menu === "my-record") return router.push("/mypage/history");

  if (menu === "inquiry") {
    isProfileModal.value = false;
    isInquiryModal.value = true;
  }
};

const handleInquirySubmit = async ({ inquiryTitle, inquiryContent }) => {
  try {
    await createInquiry({
      inquiryTitle,
      inquiryContent
    });

    toast.show("문의가 정상적으로 제출되었습니다! 🙌");

  } catch (error) {
    console.error(error);
    toast.show("문의 제출 중 오류가 발생했습니다 😢");
  }
};


/* 알림 리스트 */
const notifications = ref([]); // 알림 리스트 초기화

const hasUnreadNotifications = computed(() => {
  return notifications.value.some(n => !n.isChecked);
});

const fetchNotifications = async () => {
  try {
    const response = await getAlarmBoxesMe();
    // 최신순으로 정렬
    const sortedNotifications = response.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    notifications.value = sortedNotifications
      .map(alarm => {
        const date = new Date(alarm.createdAt);
        const formattedTime = date.toLocaleString('ko-KR', {
          year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        id: alarm.alarmBoxId,
        message: alarm.alarmBoxContent,
        time: formattedTime,
        isChecked: alarm.isChecked === 'Y',
        original: alarm // 원본 데이터도 함께 저장 (필요 시 사용)
      };
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    // 에러 처리 로직 추가 (예: 토스트 메시지)
  }
};

onMounted(() => {
  if (auth.isLoggedIn) {
    fetchNotifications();
  }
});
</script>


<template>
  <header class="header-container">

    <!-- 로고 -->
    <router-link to="/home" class="logo-link">
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
      <button class="icon-btn" @click="isNotificationModal = true">
        <img :src="hasUnreadNotifications ? bellIcon : bellCheckIcon" class="icon-img" />
      </button>

      <!-- 프로필 버튼 -->
      <button class="profile-btn" @click="isProfileModal = true">
        <img src="../../../../assets/profile_img.svg" class="profile-img" />
        <span class="profile-name">{{ user.userNickname || user.username  || "로그인" }}</span>
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

<!--알람 모달 -->
  <NotificationModal
      v-model="isNotificationModal"
      :notifications="notifications"
      @action="(item) => console.log('클릭한 알림:', item)"
      @refreshNotifications="fetchNotifications"
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

  width: 50px;
  height: 50px;

  border: none;
  border-radius: 50%; /* 완전 동그라미 모양 */

  cursor: pointer;
  transition: 0.2s;
}
.icon-btn:hover{
  transform: translateY(-2px);
  box-shadow: 5px 5px 40px rgba(0, 148, 246, 0.2);
}

.icon-img {
  padding-top: 4px;
  width: 35px;
  height: 35px;
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