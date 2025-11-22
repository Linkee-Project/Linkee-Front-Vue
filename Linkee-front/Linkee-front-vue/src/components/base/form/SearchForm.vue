<template>
  <div class="search-form">
    <div class="input-wrapper">
      <BaseInput
          :value="modelValue"
          @input="onInput"
          placeholder="검색어를 입력하세요"
          @keyup.enter="onSearchClick"
      />
      <BaseButton
          size="small"
          color="white"
          class="search-btn"
          @click="onSearchClick"
      >
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="url(#paint0_linear_1373_5264)"/>
          <defs>
            <linearGradient id="paint0_linear_1373_5264" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0094F6"/>
              <stop offset="1" stop-color="#4FC3FC"/>
            </linearGradient>
          </defs>
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>


import BaseInput from "@/components/base/input/BaseInput.vue";
import BaseButton from "@/components/base/button/BaseButton.vue";

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue', 'search']);

// BaseInput v-model 연결
const onInput = (value) => {
  emit('update:modelValue', value);  // 부모 keyword와 동기화
};

const onSearchClick = () => {
  emit('search', props.modelValue);  // 부모로 검색어 전달
  emit('update:modelValue', '');     // 입력 초기화
};
</script>

<style scoped>
.search-form { display: flex; justify-content: center; margin: 16px 0; }
.input-wrapper { display: flex; align-items: center; width: 300px; position: relative; }
.search-btn { position: absolute; right: 4px; padding: 4px 8px; min-width: 50px; }
.search-btn:hover { border: #4fc3f7; transform: none }
</style>
