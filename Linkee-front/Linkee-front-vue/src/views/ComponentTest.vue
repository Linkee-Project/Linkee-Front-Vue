<script setup>

import BaseButton from "@/components/base/button/BaseButton.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import {ref} from "vue";





/** 검색용 */
// 검색 키워드
const keyword = ref('');

const handleSearch = (value) => {
  console.log('검색어 전달됨:', value);
};


</script>

<template>
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

  <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
    <h2>검색 테스트</h2>
    <SearchForm v-model="keyword" @search="handleSearch" />
    <p style="margin: 0; font-size: 14px; color: #333;">
      입력값 확인: {{ keyword }}
    </p>
  </div>
</template>

<style scoped>

</style>