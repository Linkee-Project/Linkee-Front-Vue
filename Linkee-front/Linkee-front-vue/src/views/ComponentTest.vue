<script setup>

import BaseButton from "@/components/base/button/BaseButton.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import {ref} from "vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";





/** 검색용 */
// 검색 키워드
const keyword = ref('');
const handleSearch = (value) => {
  console.log('검색어 전달됨:', value);
};

/** 모달 열기 위한 ref **/
const showModal = ref(false);



</script>

<template>
  <h3>버튼 테스트</h3>
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
  <hr>

  <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
    <h3>검색 테스트</h3>
    <SearchForm v-model="keyword" @search="handleSearch" />
    <p style="margin: 0; font-size: 14px; color: #333;">
      입력값 확인: {{ keyword }}
    </p>
  </div>


  <hr>

  <div>
    <h3>모달 테스트</h3>
    <button @click="showModal = true">모달 열기</button>

    <BaseModal v-model="showModal" title="테스트 모달">
      <p>여기에 모달 내용 쓰시면 됩니다</p>
      <template #footer>
        <BaseButton color="blue" size="small" @click="showModal = false">확인</BaseButton>
        <BaseButton color="gray" size="small" @click="showModal = false">닫기</BaseButton>
      </template>
    </BaseModal>

  </div>
  <hr>

</template>




<style scoped>

</style>