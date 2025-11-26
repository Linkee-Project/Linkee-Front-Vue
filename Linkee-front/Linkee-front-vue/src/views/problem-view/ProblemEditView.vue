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


      <!-- 로딩 중 -->
      <div v-if="detailLoading" class="loading-card">
        문제 정보를 불러오는 중입니다...
      </div>
      <!-- 문제 정보를 찾을 수 없을 때 -->
      <div v-else-if="!problemDetail" class="loading-card">
        수정할 문제 정보를 찾을 수 없습니다.
      </div>
      <!-- 문제 수정 폼 -->
      <ProblemForm
          v-else
          v-model="editForm"
          :categories="categories"
          mode="edit"
          @submit="handleSubmit"
          @cancel="goDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProblemStore } from '@/stores/problemStore'
import ProblemForm from '@/views/problem-view/ProblemForm.vue'
import problemBackIcon from '@/assets/problem_back_icon.svg'

const route = useRoute()
const router = useRouter()
const problemStore = useProblemStore()

const { problemDetail, detailLoading, updateLoading } = storeToRefs(problemStore) // Store 상태와 액션 가져오기

const questionId = ref(route.params.id) // URL 파라미터에서 questionId 가져오기

const categories = ['네트워크', '운영체제', '데이터베이스', '자료구조']

// 🚨 중요: 임시 카테고리 매핑 객체 - 백엔드의 실제 ID에 맞춰 수정 필요!
const categoryMap = {
  '네트워크': 1,
  '운영체제': 2,
  '데이터베이스': 3,
  '자료구조': 4
};
const reverseCategoryMap = { // ID -> 이름 매핑 (폼 초기화용)
    1: '네트워크',
    2: '운영체제',
    3: '데이터베이스',
    4: '자료구조'
};


// 수정폼 데이터 - problemDetail로부터 초기화
const editForm = ref({
  category: '',
  title: '',
  content: '',
  options: [],
  answer: 1
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  if (questionId.value) {
    problemStore.fetchProblemDetail(questionId.value)
  }
})

// problemDetail이 변경되면 editForm에 데이터 채우기
watch(problemDetail, (newVal) => {
  if (newVal) {
    editForm.value = {
      category: reverseCategoryMap[newVal.categoryId] || '', // ID를 이름으로 변환, 없으면 빈 값
      title: newVal.questionTitle,
      content: newVal.questionQuestion, // DTO에 맞게 필드 이름 변경
      options: newVal.options.map(opt => ({
        index: opt.optionIndex,
        text: opt.optionText
      })),
      answer: newVal.questionAnswer // DTO에 맞게 필드 이름 변경
    }
  }
}, { immediate: true })


// 상세 페이지로 이동
const goDetail = () => {
  router.push({ name: 'ProblemDetail', params: { id: questionId.value } })
}

const goList = () => {
  router.push({ name: 'ProblemList' });
};


const handleSubmit = async (form) => {
  // 1. 카테고리 이름(string)을 categoryId(Long)로 변환
  const categoryId = categoryMap[form.category];
  if (!categoryId) {
    alert('유효하지 않은 카테고리입니다.');
    return;
  }

  // 2. API DTO 형식에 맞게 payload 구성
  const payload = {
    // categoryId는 UpdateRequestDto에 포함되지 않으므로 제외
    questionTitle: form.title,
    questionQuestion: form.content, // DTO에 맞게 필드 이름 변경
    questionAnswer: form.answer,   // DTO에 맞게 필드 이름 변경
    options: form.options.map(opt => ({
      optionIndex: opt.index, // DTO에 맞게 필드 이름 변경
      optionText: opt.text    // DTO에 맞게 필드 이름 변경
    }))
  };

  // 3. Store의 액션 호출
  const result = await problemStore.updateQuestionAction(questionId.value, payload);

  // 4. 결과에 따라 처리
  if (result.success) {
    alert('문제가 성공적으로 수정되었습니다.');
    goDetail(); // 성공 시 상세 페이지로 이동
  } else {
    alert(`문제 수정에 실패했습니다: ${result.message}`);
  }
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
