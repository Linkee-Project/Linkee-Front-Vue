<template>
  <header class="header-container">

    <nav class="nav-menu">

      <!-- 왼쪽 메뉴 -->
      <router-link to="/admin/users" class="nav-item">회원관리</router-link>
      <router-link to="/admin/notices" class="nav-item">공지관리</router-link>
      <router-link to="/admin/problems" class="nav-item">문제게시판</router-link>

      <!-- 가운데 로고 -->
      <router-link to="/admin" class="logo-link mid-logo">
        <div class="logo-container">
          <img
              src="../../../../assets/linkee_character.svg"
              alt="Linkee Logo"
              class="logo-img"
          />
          <span class="logo-text">Linkee</span>
        </div>
      </router-link>

      <!-- 오른쪽 메뉴 -->
      <router-link to="/admin/templates" class="nav-item">알림템플릿</router-link>
      <router-link to="/admin/inquiries" class="nav-item">문의관리</router-link>
      <router-link to="/admin/reports" class="nav-item">신고관리</router-link>

    </nav>

  </header>
</template>

<script setup>
</script>

<style scoped>
a {
  text-decoration: none;
}
/* 전체 헤더 */
.header-container {
  width: 100%;
  height: 90px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 유지 */
  padding: 0 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #F6F6F6;
}

/* 메뉴 (양쪽 + 가운데 로고 포함) */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 35px;
}

/* 메뉴 버튼 */
.nav-item {
  width: 155px;
  height: 60px;

  background: #FFFFFF;
  border: none;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);

  cursor: pointer;
  transition: 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0px 5px 40px rgba(0, 148, 246, 0.25);
}

/* 가운데 로고 */
.mid-logo {
  display: flex;
  align-items: center;
  margin: 0 20px; /* 양쪽 메뉴와 자연스러운 간격 */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 55px;
  height: 55px;
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: #0094F6;
}
</style>
