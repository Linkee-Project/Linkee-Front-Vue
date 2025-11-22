<script setup>
import {reactive, ref} from "vue";

import UserNavbar from "@/components/layout/user/UserNavbar.vue";
import UserSidebar from "@/components/layout/user/UserSidebar.vue";
import BaseButton from "@/components/base/button/BaseButton.vue";
import BaseInput from "@/components/base/input/BaseInput.vue";
import SearchForm from "@/components/base/SearchForm.vue";






// 검색 키워드
const keyword = ref('');

// 검색 버튼 눌렀을 때
const handleSearch = () => {

};


</script>

<template>
  <div id="app">
    <UserNavbar />

    <div class="main-layout">
      <div class="router-view-container">
        <router-view />

        <!-- Small 버튼 줄 -->
        <div class="button-row">
          <BaseButton color="blue" size="small">small</BaseButton>
          <BaseButton color="emerald" size="small">small</BaseButton>
          <BaseButton color="white" size="small">small</BaseButton>
          <BaseButton color="gray" size="small">small</BaseButton>
          <BaseButton color="orange" size="small">small</BaseButton>
        </div>
        <br>

        <!-- Medium 버튼 줄 -->
        <div class="button-row">
          <BaseButton color="gray" size="medium">Medium</BaseButton>
          <BaseButton color="blue" size="medium">Medium</BaseButton>
          <BaseButton color="orange" size="medium">Medium</BaseButton>
          <BaseButton color="emerald" size="medium">Medium</BaseButton>
          <BaseButton color="white" size="medium">Medium</BaseButton>
        </div>
        <br>

        <!-- Large 버튼 줄 -->
        <div class="button-row">
          <BaseButton color="white" size="large">Large</BaseButton>
          <BaseButton color="orange" size="large">Large</BaseButton>
          <BaseButton color="blue" size="large">Large</BaseButton>
          <BaseButton color="gray" size="large">Large</BaseButton>
          <BaseButton color="emerald" size="large">Large</BaseButton>
        </div>
        <br>
      </div>

      <div>
        <div>
          <SearchForm @search="handleSearch" />
        </div>
      </div>

      <UserSidebar />
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: "Noto Sans KR", sans-serif;
  background: #D4EBF5;
  min-height: 100vh;
}

.main-layout {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.router-view-container {
  flex: 1;
}
</style>
