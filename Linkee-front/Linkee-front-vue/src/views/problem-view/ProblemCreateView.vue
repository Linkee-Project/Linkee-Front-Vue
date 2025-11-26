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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProblemStore } from '@/stores/problemStore';
import ProblemForm from '@/views/problem-view/ProblemForm.vue';
import problemBackIcon from '@/assets/problem_back_icon.svg';

const router = useRouter();
const problemStore = useProblemStore();

// 카테고리 목록
const categories = ['운영체제', '네트워크', '자료구조', '데이터베이스'];

const categoryMap = {
  '운영체제': 1,
  '네트워크': 2,
  '자료구조': 3,
  '데이터베이스': 4
};

// 폼 기본값 - DTO 구조에 맞게 초기화
const problemForm = ref({
  category: '네트워크', // 기본 선택 카테고리
  title: '',
  content: '',
  // 보기 4개 - 객체 배열로 초기화
  options: [
    { index: 1, text: '' },
    { index: 2, text: '' },
    { index: 3, text: '' },
    { index: 4, text: '' }
  ],
  // 정답 번호 (1~4)
  answer: 1
});

// 목록으로 이동
const goList = () => {
  router.push({ name: 'ProblemList' });
};

// 등록 버튼 눌렀을 때
const handleSubmit = async (form) => {
  // 1. 카테고리 이름(string)을 categoryId(Long)로 변환
  const categoryId = categoryMap[form.category];
  if (!categoryId) {
    alert('카테고리를 선택해주세요.');
    return;
  }

  // 2. API DTO 형식에 맞게 payload 구성
  const payload = {
    categoryId: categoryId,
    questionTitle: form.title,
    questionQuestion: form.content, // DTO에 맞게 필드 이름 변경
    questionAnswer: form.answer,   // DTO에 맞게 필드 이름 변경
    options: form.options.map(opt => ({
      index: opt.index,
      text: opt.text
    }))
  };

  // 3. Store의 액션 호출
  const result = await problemStore.createQuestionAction(payload);

  // 4. 결과에 따라 처리
  if (result.success) {
    alert('문제가 성공적으로 등록되었습니다.');
    router.push({ name: 'ProblemList' }); // 성공 시 목록으로 이동
  } else {
    alert(`문제 등록에 실패했습니다: ${result.message}`);
  }
};

</script>

<style scoped>
/* 전체 배경 */
.problem-page {
  height: 100%;
  overflow: auto;
}

/* 가운데 정렬 */
.page-inner {
  max-width: 1113px;
  margin: 40px auto 40px;
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
