<script setup>
import { ref } from 'vue';
import GradeListItem from '@/components/mypage/grade/GradeListItem.vue';

// 더미 등급 데이터 (실제 백엔드 연동 시 교체)
const gradeData = ref({
  // overallGuidance는 이제 템플릿에서 직접 각 등급별 조건을 설명하므로 제거
  
  categories: [
    {
      id: 1,
      name: '알고리즘',
      currentLevel: 14,
      maxLevel: 20,
      badgeImage: '/src/assets/SILVER Grade.svg'
    },
    {
      id: 2,
      name: '자료구조',
      currentLevel: 3,
      maxLevel: 10,
      badgeImage: '/src/assets/BRONZE Grade.svg'
    },
    {
      id: 3,
      name: '네트워크',
      currentLevel: 7,
      maxLevel: 10,
      badgeImage: '/src/assets/SILVER Grade.svg'
    },
    {
      id: 4,
      name: '데이터베이스',
      currentLevel: 1,
      maxLevel: 10,
      badgeImage: '/src/assets/GOLD Grade.svg'
    }
  ]
});
</script>

<template>
  <div class="list-container">
    <h2 class="list-main-title">나의 등급</h2>

    <div class="grade-main-content">
      <!-- 상단 등급 조건 설명 -->
      <div class="grade-conditions-display">
        <div class="grade-condition-item">
          <img src="/src/assets/BRONZE Grade.svg" alt="브론즈 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">BRONZE: 1 ~ 10</p>
        </div>
        <div class="grade-condition-item">
          <img src="/src/assets/SILVER Grade.svg" alt="실버 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">SILVER: 11 ~ 20</p>
        </div>
        <div class="grade-condition-item">
          <img src="/src/assets/GOLD Grade.svg" alt="골드 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">GOLD: 21 이상</p>
        </div>
      </div>

      <!-- 카테고리별 등급 목록 -->
      <div class="category-grades-wrapper">
        <GradeListItem
          v-for="categoryGrade in gradeData.categories"
          :key="categoryGrade.id"
          :categoryGrade="categoryGrade"
        />
      </div>

      <!-- 하단 추가 등급 설명 -->
      <div class="grade-conditions-display bottom-grades">
        <div class="grade-condition-item">
          <img src="/src/assets/Yellow Grade.svg" alt="옐로우 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">Yellow: 0 ~ 25</p>
        </div>
        <div class="grade-condition-item">
          <img src="/src/assets/Red Grade.svg" alt="레드 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">Red: 26 ~ 40</p>
        </div>
        <div class="grade-condition-item">
          <img src="/src/assets/Pupple Grade.svg" alt="퍼플 등급" class="grade-condition-badge" />
          <p class="grade-condition-text">Pupple: 41 이상</p>
        </div>
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

/* --- 상단 등급 조건 표시 스타일 --- */
.grade-conditions-display {
  display: flex;
  justify-content: space-around; /* 아이템들을 균등하게 분배 */
  align-items: center;
  background-color: #f0f8ff; /* 연한 배경색 */
  border: 1px solid #cceeff; /* 테두리 */
  border-radius: 10px;
  padding: 15px 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap; /* 반응형을 위해 줄바꿈 허용 */
}

/* 하단 등급 조건 섹션의 상단 마진 조절 */
.grade-conditions-display.bottom-grades {
  margin-top: 20px;
  margin-bottom: 0; /* 불필요한 하단 마진 제거 */
}

.grade-condition-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0; /* 아이템 간 상하 간격 */
}

.grade-condition-badge {
  width: 40px; /* 이미지 크기 조정 */
  height: auto;
  flex-shrink: 0;
}

.grade-condition-text {
  font-size: 15px;
  color: #2c3e50;
  margin: 0;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}


/* --- 안내 박스 공통 스타일 (기존 overall-guidance는 이제 사용하지 않음) --- */
/*
.guidance-box {
  background-color: #e0f7fa;
  border-left: 5px solid #00BCD4;
  border-radius: 10px;
  padding: 18px 25px;
  font-size: 15px;
  color: #333;
  line-height: 1.6;
}

.overall-guidance {
  margin-top: 20px;
}
*/

/* --- 카테고리별 등급 Wrapper --- */
.category-grades-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 한 줄에 4개 항목 */
  gap: 20px; /* 아이템 간 간격 조정 */
  justify-content: center;
}

/* 반응형 */
@media (max-width: 1200px) {
  .grade-condition-badge {
    width: 35px;
  }
  .grade-condition-text {
    font-size: 14px;
  }
  .category-grades-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
  .grade-conditions-display {
    flex-direction: column; /* 모바일에서 세로로 배치 */
    align-items: flex-start; /* 왼쪽 정렬 */
    padding: 10px 15px;
    gap: 8px; /* 아이템 간 간격 */
  }
  .grade-condition-item {
    width: 100%; /* 너비 100% */
  }
  .grade-condition-badge {
    width: 30px;
  }
  .grade-condition-text {
    font-size: 13px;
  }
  /* 기존 .guidance-box 스타일은 주석 처리 또는 제거 */
  /*
  .guidance-box {
    font-size: 14px;
    padding: 15px 20px;
  }
  */
  .category-grades-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .category-grades-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
