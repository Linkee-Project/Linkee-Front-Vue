<script setup>

import BaseButton from "@/components/base/button/BaseButton.vue";
import SearchForm from "@/components/base/form/SearchForm.vue";
import {computed, ref} from "vue";
import BaseModal from "@/components/base/modal/BaseModal.vue";
import PaginationButton from "@/components/base/button/PaginationButton.vue";





/** 검색용 */
// 검색 키워드
const keyword = ref('');
const handleSearch = (value) => {
  console.log('검색어 전달됨:', value);
};

/** 모달 열기 위한 ref **/
const showModal = ref(false);

/** 페이징 테스트 */
// 테스트용 데이터
const cards = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `카드 제목 ${i + 1}`,
})));

// 페이지 관련
const page = ref(1);
const pageSize = 6; // 한 페이지에 보여줄 카드 수
const totalPages = computed(() => Math.ceil(cards.value.length / pageSize));

// 현재 페이지에 보여줄 카드 계산
const pagedCards = computed(() => {
  const start = (page.value - 1) * pageSize;
  return cards.value.slice(start, start + pageSize);
});

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


  <h3>페이징 테스트</h3>
  <div style="padding: 24px;">
    <h3>카드 + 페이지네이션 테스트</h3>

    <!-- 카드 리스트 -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
      <BaseButton
          v-for="card in pagedCards"
          :key="card.id"
          color="white"
          size="small"
      >
        {{ card.title }}
      </BaseButton>
    </div>

    <!-- 페이지네이션 -->
    <div style="margin-top: 24px; display: flex; justify-content: center;">
      <PaginationButton
          v-model:currentPage="page"
          :total-pages="totalPages"
      />
    </div>

    <p style="margin-top: 16px;">현재 페이지: {{ page }} / {{ totalPages }}</p>
  </div>


</template>




<style scoped>

</style>