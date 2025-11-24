<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  /* v-model 값 */
  modelValue: {
    type: String,
    default: ''
  },
  /* 옵션 목록 */
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '카테고리를 선택하세요.'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const rootEl = ref(null)


const selected = ref(props.modelValue)

/* 부모에서 값 바꾸는 경우(수정 페이지에서 초기값 주기 등) 동기화 */
watch(
    () => props.modelValue,
    (val) => {
      selected.value = val
    }
)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const selectOption = (option) => {
  selected.value = option
  emit('update:modelValue', option)
  close()
}

const displayLabel = computed(() =>
    selected.value ? selected.value : props.placeholder
)

/* 바깥 클릭하면 닫기 */
const handleClickOutside = (e) => {
  if (!rootEl.value) return
  if (!rootEl.value.contains(e.target)) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="category-select" ref="rootEl">
    <!-- 상단 트리거 -->
    <button
        type="button"
        class="category-trigger"
        @click.stop="toggleOpen"
    >
      <span
          class="category-label"
          :class="{ placeholder: !selected }"
      >
        {{ displayLabel }}
      </span>

      <span class="category-arrow" :class="{ open: isOpen }">
        ▲
      </span>
    </button>

    <!-- 옵션 리스트 -->
      <ul v-if="isOpen" class="category-list">
        <li
            v-for="option in options"
            :key="option"
            class="category-item"
            :class="{
            active: option === selected,
          }"
            @click.stop="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
  </div>
</template>

<style scoped>
.category-select {
  width: 100%;
  position: relative;
}

/* 카테고리 박스 */
.category-trigger {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid #636464;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.category-label {
  font-size: 14px;
  color: #111827;
}

.category-label.placeholder {
  color: #9ca3af;
}

.category-arrow {
  font-size: 10px;
  color: #6b7280;
  transform: rotate(180deg);
  transition: transform 0.15s ease;
}

.category-arrow.open {
  transform: rotate(0deg);
}

/* 카테고리 리스트 박스 */
.category-list {
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  margin: 0;
  padding: 10px 16px;
  list-style: none;

  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #e5e7eb;

  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.category-item {
  font-size: 14px;
  color: #374151;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
}

/* 마우스 올렸을 때 */
.category-item:hover {
  background: #e5f2ff;
}

/* 선택된 항목 */
.category-item.active {
  background: #dbefff;
  font-weight: 600;
}
</style>
