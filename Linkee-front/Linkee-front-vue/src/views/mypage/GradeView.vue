<script setup>
import { ref } from 'vue';
import GradeListItem from '@/components/layout/mypage/grade/GradeListItem.vue'; // GradeListItem import

// 더미 등급 데이터 (실제 백엔드 연동 시 교체)
const gradeData = ref({
  topGuidance: 'Linkee의 등급 시스템은 각 카테고리별 활동을 기반으로 부여됩니다. 꾸준한 학습과 퀴즈 참여로 더 높은 등급에 도전해 보세요!',
  overallGuidance: '등급은 매월 1일에 갱신되며, 등급이 높을수록 더 많은 혜택이 제공됩니다. 나의 강점 카테고리를 파악하고 집중적으로 성장시켜보세요!',
  categories: [
    {
      id: 'overall',
      name: '전체 등급',
      currentLevel: 14,
      maxLevel: 20,
      badgeImage: '/src/assets/SILVER Grade.svg'
    },
    {
      id: 'math',
      name: '수학 등급',
      currentLevel: 3,
      maxLevel: 10,
      badgeImage: '/src/assets/BRONZE Grade.svg'
    },
    {
      id: 'science',
      name: '과학 등급',
      currentLevel: 7,
      maxLevel: 10,
      badgeImage: '/src/assets/Yellow Grade.svg',
    },
    {
      id: 'history',
      name: '역사 등급',
      currentLevel: 1,
      maxLevel: 10,
      badgeImage: '/src/assets/Red Grade.svg'
    },
    {
      id: 'english',
      name: '영어 등급',
      currentLevel: 9,
      maxLevel: 10,
      badgeImage: '/src/assets/GOLD Grade.svg'
    },
    {
      id: 'programming',
      name: '프로그래밍 등급',
      currentLevel: 5,
      maxLevel: 10,
      badgeImage: '/src/assets/Pupple Grade.svg'
    },
    {
      id: 'art',
      name: '미술 등급',
      currentLevel: 2,
      maxLevel: 10,
      badgeImage: '/src/assets/BRONZE Grade.svg'
    },
    {
      id: 'music',
      name: '음악 등급',
      currentLevel: 6,
      maxLevel: 10,
      badgeImage: '/src/assets/Yellow Grade.svg'
    }
  ]
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 등급</h2>

    <div class="grade-main-content">
      <!-- 상단 등급 기준 안내 -->
      <div class="guidance-box top-guidance">
        <p>{{ gradeData.topGuidance }}</p>
      </div>

      <!-- 카테고리별 등급 목록 -->
      <div class="category-grades-wrapper">
        <GradeListItem
          v-for="categoryGrade in gradeData.categories"
          :key="categoryGrade.id"
          :categoryGrade="categoryGrade"
        />
      </div>

      <!-- 하단 전체 등급 안내 -->
      <div class="guidance-box overall-guidance">
        <p>{{ gradeData.overallGuidance }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 목록 컨테이너 (하얀 박스) --- */
.list-container {
  background: white;
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

/* --- 페이지 제목 --- */
.list-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #0094F6;
  margin-bottom: 25px;
}

/* --- 등급 메인 컨텐츠 영역 --- */
.grade-main-content {
  display: flex;
  flex-direction: column;
  gap: 30px; /* 섹션 간 간격 */
}

/* --- 안내 박스 공통 스타일 --- */
.guidance-box {
  background-color: #e0f7fa; /* 연한 파란색 배경 */
  border-left: 5px solid #00BCD4; /* 포인트 색상 */
  border-radius: 10px;
  padding: 18px 25px;
  font-size: 15px;
  color: #333;
  line-height: 1.6;
}

.top-guidance {
  margin-bottom: 20px;
}
.overall-guidance {
  margin-top: 20px;
}

/* --- 카테고리별 등급 Wrapper --- */
.category-grades-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 한 줄에 4개 항목 */
  gap: 20px; /* 아이템 간 간격 조정 */
  justify-content: center;
}

/* 반응형 */
@media (max-width: 1200px) { /* 더 넓은 화면에서 4개 유지, 그 이하에서 3개 */
  .category-grades-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* 화면 축소 시 3개, 2개 등으로 자동 조절 */
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .list-container {
    padding: 15px;
  }
  .list-main-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .guidance-box {
    font-size: 14px;
    padding: 15px 20px;
  }
  .category-grades-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* 모바일에서 한 줄에 2개 등으로 자동 조절 */
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .category-grades-wrapper {
    grid-template-columns: 1fr; /* 아주 작은 화면에서는 1개 */
  }
}
</style>