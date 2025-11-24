<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  /* 선택된 카테고리 */
  modelValue: {
    type: String,
    default: ''
  },
  /* 카테고리 목록 */
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

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const selectOption = (option) => {
  emit('update:modelValue', option)
  close()
}

const displayLabel = computed(() =>
    props.modelValue ? props.modelValue : props.placeholder
)

/* 바깥 클릭하면 드롭다운 닫기 */
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
    <!-- 상단 토글 영역 -->
    <button
        type="button"
        class="category-trigger"
        @click.stop="toggleOpen"
    >
      <span
          class="category-label"
          :class="{ placeholder: !modelValue }"
      >
        {{ displayLabel }}
      </span>

      <span class="category-arrow" :class="{ open: isOpen }">
        ▲
      </span>
    </button>

    <!-- 옵션 리스트 -->
    <transition name="fade">
      <ul v-if="isOpen" class="category-list">
        <li
            v-for="option in options"
            :key="option"
            class="category-item"
            :class="{ active: option === modelValue }"
            @click.stop="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.category-select {
  width: 100%;
  position: relative;
}

/* 카테고리 박스  */
.category-trigger {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
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

/* 카테고리 리스트 */
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
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

/* 마우스 올렸을 때 (hover) */
.category-item:hover {
  background-color: #e1f2ff;
  color: #111827;
}

/* 선택된 항목 유지되는 상태 */
.category-item.active {
  background-color: #d6edff;
  color: #111827;
  font-weight: 600;
}


/* 페이드 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
