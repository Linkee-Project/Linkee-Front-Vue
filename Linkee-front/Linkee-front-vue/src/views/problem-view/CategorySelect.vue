<template>
  <div class="select-wrapper" ref="rootEl">
    <div class="select-box" @click="toggle">
      <span class="label">{{ displayLabel }}</span>
      <span class="arrow">▼</span>
    </div>

    <ul v-if="isOpen" class="select-list">
      <li
          v-for="(opt, idx) in options"
          :key="idx"
          @click="selectOption(opt)"
      >
        {{ opt }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '선택하세요' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const rootEl = ref(null)

function toggle() {
  isOpen.value = !isOpen.value
}

// 🔥 옵션 선택 시 변경된 경우에만 emit
function selectOption(value) {
  if (props.modelValue !== value) {
    emit('update:modelValue', value)
  }
  isOpen.value = false
}

// 화면 바깥 클릭 시 닫기
const handleClickOutside = (e) => {
  if (!rootEl.value) return
  if (!rootEl.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))

// 🔍 라벨 표시 (선택값이 없으면 placeholder 표시)
const displayLabel = computed(() =>
    props.modelValue ? props.modelValue : props.placeholder
)
</script>

<style scoped>
.select-wrapper {
  width: 100%;
  position: relative;
}
.select-box {
  width: 100%;
  height: 44px;
  border-radius: 16px;
  border: 1px solid #636464;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  box-sizing: border-box;
}
.select-list {
  position: absolute;
  width: 100%;
  background: #fff;
  border: 1px solid #636464;
  border-radius: 16px;
  margin-top: 4px;
  list-style: none;
  padding: 6px 0;
  box-sizing: border-box;
  z-index: 10;
}
.select-list li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.select-list li:hover {
  background: #f3f4f6;
}
.arrow {
  font-size: 10px;
}
</style>
