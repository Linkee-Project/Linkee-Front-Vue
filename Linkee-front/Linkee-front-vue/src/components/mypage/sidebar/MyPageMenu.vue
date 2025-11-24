<template>
  <div class="menu-box">
    <h3>마이페이지</h3>
    <ul>
      <router-link
          v-for="item in menuList"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
      >
        <li :class="{ active: isActive }" @click="navigate">
          <a :href="href">{{ item.text }}</a>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script setup>
// 메뉴 리스트와 각 메뉴가 이동할 경로(path)를 객체 배열로 정의
const menuList = [
  { text: "계정 관리", to: "/mypage/profile" },
  { text: "나의 문제 조회", to: "/mypage/questions" },
  { text: "나의 문의 조회", to: "/mypage/inquiry" },
  { text: "나의 북마크 조회", to: "/mypage/bookmark" },
  { text: "나의 플레이 기록", to: "/mypage/history" },
];
</script>

<style scoped>
.menu-box {
  background: white;
  border-radius: 20px;
  padding: 25px 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.menu-box h3 {
  color: #0094F6;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.menu-box ul {
  padding: 0;
  margin: 0;
}

.menu-box li {
  list-style: none;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  transition: 0.2s;
}

.menu-box li:last-child {
  margin-bottom: 0;
}

.menu-box li:hover {
  color: #0094F6;
  font-weight: 600;
}

.menu-box li.active {
  background: #f4f4f4;
  color: #000;
  font-weight: 700;
}

/* router-link는 기본적으로 a 태그를 렌더링하므로, 스타일 초기화 */
.menu-box li a {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
