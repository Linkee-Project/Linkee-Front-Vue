<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 제목 -->
      <header class="problem-header">
        <button class="back-btn" @click="goList">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제 등록</h1>
      </header>

      <!-- 문제 등록 -->
      <section class="problem-create-card">
        <header class="create-header">
          <h2 class="create-title">새 문제 등록</h2>
        </header>

        <!-- 카테고리 -->
        <div class="form-row">
          <label class="form-label">카테고리</label>
          <div class="form-field">
            <CategorySelect
                v-model="form.category"
                :options="categoryOptions"
                placeholder="카테고리를 선택하세요."
            />
          </div>
        </div>

        <!-- 제목 -->
        <div class="form-row">
          <label class="form-label">제목</label>
          <div class="form-field">
            <input
                v-model="form.title"
                type="text"
                class="text-input"
                placeholder="제목을 입력하세요."
            />
          </div>
        </div>

        <!-- 문제 -->
        <div class="form-row textarea-row">
          <label class="form-label">문제</label>
            <div class="form-field">
              <textarea v-model="form.content" class="textarea-input" placeholder="문제 내용을 입력하세요."></textarea>
            </div>
        </div>

        <!-- 보기 -->
        <div class="form-row">
          <label class="form-label">보기</label>
          <div class="form-field">
            <div class="option-row" v-for="n in 4" :key="n">
              <span class="option-label">{{ n }}번</span>
              <input
                  v-model="form.options[n - 1]"
                  type="text"
                  class="text-input"
                  :placeholder="`${n}번 보기를 입력하세요.`"
              />
            </div>
          </div>
        </div>

        <!-- 정답 번호 -->
        <div class="form-row">
          <label class="form-label">정답번호</label>
          <div class="form-field answer-group">
            <label
                v-for="n in 4"
                :key="n"
                class="answer-option"
            >
              <input
                  type="radio"
                  :value="n"
                  v-model="form.answer"
              />
              <span>{{ n }}번</span>
            </label>
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="form-actions">
          <BaseButton color="gray" size="medium" @click="goList">취소</BaseButton>
          <BaseButton color="blue" size="medium" @click="submitForm">등록</BaseButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/button/BaseButton.vue'
import CategorySelect from '@/views/problem-view/CategorySelect.vue'
import problemBackIcon from '@/assets/problem_back_icon.svg'

const router = useRouter()

const form = reactive({
  category: '',
  title: '',
  content: '',
  options: ['', '', '', ''],
  answer: 1
})

const categoryOptions = ['네트워크', '운영체제', '데이터베이스', '자료구조']

const goList = () => {
  router.push({ name: 'ProblemList' })
}

const submitForm = () => {
  // TODO: 실제 API 연동
  console.log('폼 데이터', form)
  // 임시로 목록으로 이동
  router.push({ name: 'ProblemList' })
}
</script>

<style scoped>

/* 전체 배경 */
.problem-page {
  min-height: 100vh;
}

/* 가운데 정렬 */
.page-inner {
  max-width: 1113px;
  margin: 80px auto 80px;
}

/* 제목 영역 */
.problem-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;
}

/* 뒤로가기 버튼 */
.back-btn {
  border: none;
  background: transparent;
  padding: 0;
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 40px;
  height: 40px;
  position: relative;
  top: 2px;
}

/* ---------------- 문제 등록 ---------------- */

.problem-create-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 24px 28px;
}

.create-header {
  margin-bottom: 16px;
}

.create-title {
  font-size: 18px;
  font-weight: 600;
}

/* 폼 레이아웃 */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}
.form-row.textarea-row {
  align-items: flex-start;
}


.form-label {
  width: 80px;
  font-size: 14px;
  font-weight: 600;
  padding-top: 10px;
}

.form-field {
  flex: 1;
}

/* 단일 라인 인풋 */
.text-input {
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  padding: 0 16px;
  font-size: 14px;
}

/* 문제 영역 textarea */
.textarea-input {
  width: 100%;
  min-height: 160px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  padding: 12px 16px;
  font-size: 14px;
  resize: vertical;
  margin: 0;
  display: block;
}
/* 보기 입력 */
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.option-label {
  width: 32px;
  font-size: 13px;
}

/* 정답 번호 라디오 그룹 */
.answer-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

/* 하단 버튼 */
.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ------------------- 반응형 ------------------- */

/* 태블릿 이하 (<= 1024px) */
@media (max-width: 1024px) {
  .page-inner {
    margin: 60px auto 60px;
    padding: 0 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .problem-create-card {
    padding: 20px 20px;
  }
}

/* 모바일 (<= 768px)  */
@media (max-width: 768px) {


  .page-inner {
    margin: 40px auto;
    padding: 0 12px;
  }


  .create-card {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    padding: 24px 16px;
  }


  .form-row {
    gap: 12px;
    margin-bottom: 12px;
  }


  .form-row.textarea-row {
    align-items: flex-start;
  }


  .form-label {
    width: 70px;
    font-size: 13px;
  }


  .form-field {
    flex: 1;
  }


  .text-input,
  .option-input {
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    padding: 0 18px;
    font-size: 13px;
  }


  .textarea-input {
    width: 100%;
    box-sizing: border-box;
    min-height: 150px;
    padding: 10px 14px;
    font-size: 13px;
  }


  .options-group .option-row {
    margin-bottom: 10px;
  }
}

</style>
