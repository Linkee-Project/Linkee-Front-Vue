<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 상단 제목 -->
      <header class="problem-header">
        <button class="back-btn" @click="goDetail">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제 수정</h1>
      </header>


      <ProblemForm
          v-model="problemForm"
          :categories="categories"
          mode="edit"
          @submit="handleSubmit"
          @cancel="goDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProblemForm from '@/views/problem-view/ProblemForm.vue'
import problemBackIcon from '@/assets/problem_back_icon.svg'

const route = useRoute()
const router = useRouter()

const problemId = route.params.id

// 목록으로 이동
const goList = () => {
  router.push({ name: 'ProblemList' })
}

const categories = ['네트워크', '운영체제', '데이터베이스', '자료구조']

// 수정폼 데이터
const problemForm = ref({
  category: '',
  title: '',
  content: '',
  options: ['', '', '', ''],
  answer: 1
})

const isLoading = ref(true)

onMounted(async () => {
  // TODO: API 연동해서 기존 문제 데이터 가져오기
  problemForm.value = {
    category: '네트워크',
    title: '기존에 등록된 문제 제목입니다.',
    content: '기존에 등록된 문제 내용입니다.',
    options: ['보기1', '보기2', '보기3', '보기4'],
    answer: 2
  }

  isLoading.value = false
})

// 상단 뒤로가기 / 취소 시 이동
const goDetail = () => {
  router.push({ name: 'ProblemDetail', params: { id: problemId } })
}

const handleSubmit = async (form) => {
  // TODO: 실제 수정 API 연동

  console.log('수정 요청 payload:', form)
  goDetail()
}

const handleCancel = () => {
  goDetail()
}
</script>

<style scoped>
.problem-page {
  height: 100%;
  overflow: auto;
}

.page-inner {
  max-width: 1113px;
  margin: 40px auto 40px;
}

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
