<template>
  <input
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      class="base-input"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'input']);

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input', event.target.value);
};
</script>

<style scoped>
.base-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid rgba(149, 212, 255,0.8);
  border-radius: 13px;
  font-size: 11px;
  color: #939393;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.base-input:focus {
  border-color: rgba(104, 193, 255, 0.6);
  box-shadow: 0 0 3px rgba(0, 148, 246, 0.8);
}
</style>
