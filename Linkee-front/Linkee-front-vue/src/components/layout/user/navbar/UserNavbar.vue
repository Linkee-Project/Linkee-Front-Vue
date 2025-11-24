<template>
  <!--
    <header> : 페이지의 상단 영역(헤더)을 의미하는 시맨틱 태그.
               여기에는 보통 로고, 내비게이션 메뉴, 사용자 정보 등이 위치함.
  -->
  <header class="header-container">
    <!--
      로고 영역
      사이트 브랜드 역할. 클릭 시 보통 홈으로 이동함.
    -->
    <router-link to="/" class="logo-link">
    <div class="logo-container ">
      <!-- 로고 이미지 -->
      <img
        src="../../../../assets/linkee_character.svg"
        alt="Linkee Logo"
        class="logo-img"
      />


      <!-- 텍스트 로고 (사이트 이름) -->
      <span class="logo-text">Linkee</span>

    </div>
    </router-link>

    <!--
      가운데 메뉴(nav)
      <nav> 태그는 페이지 이동 또는 메뉴 구조임을 알려주는 시맨틱 태그.
    -->
    <nav class="nav-menu">

      <!--마이페이지 버튼-->
<!--      <button class="nav-item">👤 마이페이지</button>-->
      <router-link to="/mypage/profile" class="nav-item">👤 마이페이지</router-link>

      <!--문제게시판 버튼-->
      <button class="nav-item">📜 문제 게시판</button>

      <!-- 공지사항 버튼 -->
      <button class="nav-item">📢 공지사항</button>

    </nav>

    <!-- 오른쪽 영역: 알림 + 프로필 -->
    <div class="right-section">
      <!-- 알림 버튼 -->
      <button class="icon-btn">
        <img src="../../../../assets/bell.svg" class = "icon-img" />
      </button>

      <!-- 프로필 버튼 -->
      <button class="profile-btn">
        <img src="../../../../assets/profile_img.svg" class="profile-img" />
        <span class="profile-name"> 김명지니어스<!--pinia 사용시 유저 이름 바꿔줌{{ userStore.nickname }}--></span>
      </button>
    </div>

  </header>

</template>

<script>
export default {
  name: "UserNavbar", // 컴포넌트 이름
};
</script>

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