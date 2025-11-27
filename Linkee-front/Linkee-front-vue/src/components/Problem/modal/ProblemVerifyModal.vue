<template>
  <div class="question-verify-modal">
  <BaseModal
      title="문제 검증"
      :modelValue="visible"
      @update:modelValue="closeModal"
  >
    <div v-if="questionData" class="question-detail">
      <!-- 카테고리 태그 -->
      <div class="category-tag">
        {{ questionData.category }}
      </div>

      <!-- 제목 -->
      <h2 class="question-title">
        {{ questionData.title }}
      </h2>

      <!-- 메타 정보 -->
      <div class="meta">
        <span>작성자 : {{ questionData.writer }}</span>
        <span>등록일 : {{ questionData.createdAt }}</span>
        <span>조회수 : {{ questionData.views }}</span>
      </div>

      <!-- 문제 내용 -->
      <section class="section">
        <h3 class="section-title">문제</h3>
        <p class="section-body">
          {{ questionData.content }}
        </p>
      </section>

      <!-- 보기 -->
      <section class="section">
        <h3 class="section-title">보기</h3>
        <ul class="option-list">
          <li v-for="opt in questionData.options" :key="opt.optionId">
            <strong>{{ opt.optionIndex }}번</strong> {{ opt.optionText }}
          </li>
        </ul>
      </section>

      <!-- 정답 -->
      <section class="section answer-section">
        <span class="answer-label">정답 :</span>
        <span class="answer-value">{{ correctAnswerIndex }}번</span>
      </section>
    </div>

    <template #footer>
      <div class="footer-buttons">
        <AdminButton
            label="검증완료"
            size="medium"
            @click="onVerifyClick"
        />
        <AdminButton
            label="취소"
            size="medium"
            @click="closeModal"
        />
      </div>
    </template>
  </BaseModal>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import BaseModal from '@/components/base/modal/BaseModal.vue';
import AdminButton from '@/components/base/button/AdminButton.vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  questionData: { type: Object, default: () => null },
});

const emit = defineEmits(['update:visible', 'verify']);

const correctAnswerIndex = computed(() => {
  if (!props.questionData || !props.questionData.options) {
    return null;
  }
  const correctOption = props.questionData.options.find(opt => opt.isCorrected === 'Y');
  return correctOption ? correctOption.optionIndex : null;
});


  const closeModal = () => {
  emit('update:visible', false);
};

const onVerifyClick = () => {
  if (props.questionData) {
    emit('verify', props.questionData.questionId);
  }
};
</script>

<style scoped>
.question-detail {
  padding: 20px 10px 10px;
}

.category-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e5f2ff;
  color: #0077cc;
  font-size: 12px;
  margin-bottom: 8px;
}

.question-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.section-body {
  font-size: 14px;
  line-height: 1.5;
}

.option-list {
  list-style: none;
  padding: 10px 12px;
  margin: 0;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 14px;
}

.option-list li + li {
  margin-top: 4px;
}

.option-list strong {
  margin-right: 4px;
}

.answer-section {
  font-size: 14px;
}

.answer-label {
  font-weight: 600;
  margin-right: 4px;
}

.answer-value {
  color: #0077ff;
  font-weight: 700;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* BaseModal 안의 .modal-content 만 타겟 */
.question-verify-modal :deep(.modal-content) {
  width: 600px;
  max-width: 90%;
}


@media (max-width: 768px) {
  .question-verify-modal :deep(.modal-content) {
    width: 90%;
  }
}
</style>
