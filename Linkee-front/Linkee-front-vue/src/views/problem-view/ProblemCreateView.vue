<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 상단 제목 -->
      <header class="problem-header">
        <button class="back-btn" @click="goList">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제게시판</h1>
      </header>

      <!-- 공통 폼 컴포넌트 -->
      <ProblemForm
          v-model="problemForm"
        :categories="categories"
        mode="create"
        @submit="handleSubmit"
        @cancel="goList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProblemForm from '@/views/problem-view/ProblemForm.vue'
import problemBackIcon from '@/assets/problem_back_icon.svg'

const router = useRouter()

// 카테고리 목록
const categories = ['네트워크', '운영체제', '데이터베이스', '자료구조']

// 폼 기본값
const problemForm = ref({
  category: '',
  title: '',
  content: '',
  // 보기 4개
  options: ['', '', '', ''],
  // 정답 번호 (1~4)
  answer: 1
})

// 목록으로 이동
const goList = () => {
  router.push({ name: 'ProblemList' })
}

// 등록 버튼 눌렀을 때
const handleSubmit = async (form) => {
  // TODO: 실제 등록 API 연동

  console.log('등록 요청 payload:', form)
  router.push({ name: 'ProblemList' })
}

// 취소 버튼 눌렀을 때
const handleCancel = () => {
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

/* ===== 반응형 ===== */

/* 태블릿 이하 (<= 1024px) */
@media (max-width: 1024px) {
  .page-inner {
    margin: 60px auto 60px;
    padding: 0 16px;
  }

  .page-title {
    font-size: 22px;
  }
}

/* 모바일 (<= 768px)  */
@media (max-width: 768px) {
  .page-inner {
    margin: 40px auto 40px;
    padding: 0 12px;
  }

  .problem-header {
    gap: 8px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }
}
</style>
