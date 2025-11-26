<template>
  <section class="create-card">
    <h2 class="create-title">
      {{ titleText }}
    </h2>

    <!-- 카테고리 -->
    <div class="form-row">
      <label class="form-label">카테고리</label>
      <div class="form-field">
        <CategorySelect
            v-model="inner.category"
            :options="categories"
        />
      </div>
    </div>

    <!-- 제목 -->
    <div class="form-row">
      <label class="form-label">제목</label>
      <div class="form-field">
        <input
            v-model="inner.title"
            type="text"
            class="text-input"
            placeholder="제목을 입력하세요."
        />
      </div>
    </div>

    <!-- 문제 내용 -->
    <div class="form-row textarea-row">
      <label class="form-label">문제</label>
      <div class="form-field">
        <textarea
            v-model="inner.content"
            class="textarea-input"
            placeholder="문제 내용을 입력하세요."
        />
      </div>
    </div>

    <!-- 보기 -->
    <div class="form-row">
      <label class="form-label">보기</label>

      <div class="form-field">
        <div
            v-for="(opt, idx) in inner.options"
            :key="idx"
            class="option-row"
        >
          <span class="option-label">{{ opt.index }}번</span>
          <input
              v-model="opt.text"
              type="text"
              class="text-input"
              :placeholder="`${opt.index}번 보기를 입력하세요.`"
          />
        </div>
      </div>
    </div>

    <!-- 정답 번호 -->
    <div class="form-row answer-row">
      <label class="form-label">정답번호</label>
      <div class="form-field answer-field">
        <label
            v-for="n in 4"
            :key="n"
            class="answer-option"
        >
          <input
              v-model="inner.answer"
              type="radio"
              name="answer"
              :value="n"
          />
          <span>{{ n }}번</span>
        </label>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="form-button-row">
      <BaseButton color="gray" size="medium" @click="handleCancel">
        취소
      </BaseButton>
      <BaseButton color="blue" size="medium" @click="handleSubmit">
        {{ submitText }}
      </BaseButton>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CategorySelect from '@/views/problem-view/CategorySelect.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

const props = defineProps({
  // create | edit
  mode: {
    type: String,
    default: 'create'
  },
  // v-model 로 받는 문제 데이터
  modelValue: {
    type: Object,
    required: true
  },
  // 카테고리 목록
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// ----- 객체 깊은 복사 -----
// props는 직접 수정 X , 항상 clone 해서 내부 상태(inner)에서만 수정
const clone = (obj) => JSON.parse(JSON.stringify(obj ?? {}))

//부모가 넘겨준 modelValue를 복사 -> 이 컴포넌트 안에서만 사용하는 전용 상태로 관리
const inner = ref(clone(props.modelValue))

// 부모 -> 폼 동기화
//부모에서 modelValue(= v-model 값)가 바뀌면 항상 최신 값을 다시 clone 해서 inner에 반영
watch(
    () => props.modelValue,
    (val) => {
      // options가 문자열 배열일 경우 객체 배열로 변환
      if (Array.isArray(val.options) && val.options.every(opt => typeof opt === 'string')) {
        inner.value = {
          ...clone(val),
          options: val.options.map((text, index) => ({ index: index + 1, text: text }))
        };
      } else {
        inner.value = clone(val)
      }
    },
    { deep: true, immediate: true } // immediate: true를 추가하여 컴포넌트 마운트 시 초기값 동기화
)

// 폼 → 부모 동기화
// 사용자가 입력창을 수정하면 inner가 바뀌는데,그 때마다 update:modelValue 이벤트를 날려서
// 부모의 v-model 값도 항상 최신 상태로 맞춰 줌
watch(
    inner,
    (val) => {
      emit('update:modelValue', clone(val))
    },
    { deep: true }
)

// mode에 따라 '새 문제 등록' / '문제 수정'
const titleText = computed(() =>
    props.mode === 'edit' ? '문제 수정' : '새 문제 등록'
)
// mode에 따라 버튼에 '등록' / '수정'
const submitText = computed(() =>
    props.mode === 'edit' ? '수정' : '등록'
)

const handleSubmit = () => {
  emit('submit', clone(inner.value))
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.create-card {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  padding: 24px 32px 28px;
  box-sizing: border-box;
}

.create-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}


.form-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 24px;
  align-items: center;
  margin-bottom: 16px;
}

.form-row.textarea-row {
  align-items: flex-start;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.form-field {
  width: 100%;
}

/* 공통 인풋 */
.text-input {
  width: 100%;
  height: 44px;
  border-radius: 16px;
  border: 1px solid #636464;
  background: #ffffff;
  padding: 0 16px;
  font-size: 14px;
  box-sizing: border-box;
}

.text-input::placeholder {
  color: #9ca3af;
}

/* textarea */
.textarea-input {
  width: 100%;
  min-height: 180px;
  border-radius: 16px;
  border: 1px solid #636464;
  padding: 12px 16px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.textarea-input::placeholder {
  color: #9ca3af;
}


.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.option-label {
  width: 32px;
  font-size: 14px;
  color: #6b7280;
  text-align: right;
}

/* 정답 번호 */
.answer-row {
  margin-top: 8px;
}

.answer-field {
  display: flex;
  align-items: center;
  gap: 16px;
}

.answer-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #111827;
}

.answer-option input[type='radio'] {
  accent-color: #ef4444;
}

/* 버튼 영역 */
.form-button-row {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ========== 반응형 ========== */

/* 태블릿 이하 (<= 1024px) */
@media (max-width: 1024px) {
  .create-card {
    padding: 20px 20px 24px;
  }
}

/* 모바일 (<= 768px)  */
@media (max-width: 768px) {
  .create-card {
    padding: 16px 16px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    row-gap: 6px;
    align-items: flex-start;
  }

  .form-label {
    font-size: 13px;
  }

  .text-input {
    height: 42px;
    font-size: 13px;
  }

  .textarea-input {
    min-height: 150px;
    font-size: 13px;
  }

  .answer-field {
    flex-wrap: wrap;
  }

  .form-button-row {
    margin-top: 20px;
  }
}
</style>
