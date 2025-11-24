<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  categoryGrade: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="category-grade-card">
    <img :src="categoryGrade.badgeImage" :alt="categoryGrade.name" class="category-badge-image" />
    <h3 class="category-grade-name">{{ categoryGrade.name }}</h3>
    <p class="category-grade-level">Lv. {{ categoryGrade.currentLevel }} / {{ categoryGrade.maxLevel }}</p>
  </div>
</template>

<style scoped>
.category-grade-card {
  background: linear-gradient(145deg, #ffffff, #f0f8ff);
  border-radius: 15px;
  padding: 20px; /* 사이즈 조정을 위해 패딩 조정 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #e0f2f7;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 150px; /* 최소 너비 설정 */
}

.category-grade-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.category-badge-image {
  width: 100px; /* 사이즈 조정을 위해 이미지 크기 조정 */
  height: auto;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.category-grade-name {
  font-size: 20px; /* 사이즈 조정을 위해 폰트 크기 조정 */
  color: #007bbd;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.category-grade-level {
  font-size: 14px; /* 사이즈 조정을 위해 폰트 크기 조정 */
  color: #666;
  font-weight: 500;
  margin-bottom: 15px;
}
/*
.category-grade-description {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
  background-color: #f8fcfd;
  border-radius: 8px;
  padding: 8px;
}
*/
/*
.category-grade-benefits {
  text-align: left;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e0e0e0;
}
*/
/*
.category-grade-benefits h4 {
  font-size: 14px;
  color: #0094F6;
  margin-bottom: 10px;
  font-weight: 600;
}
*/
/*
.category-grade-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
*/
/*
.category-grade-benefits li {
  font-size: 12px;
  color: #444;
  margin-bottom: 6px;
  position: relative;
  padding-left: 18px;
  display: flex;
  align-items: center;
}
*/
/*
.category-grade-benefits li:last-child {
  margin-bottom: 0;
}
*/

/* 아이콘은 현재 템플릿에 없으므로 주석 처리
.benefit-icon {
  font-size: 1em;
  margin-right: 8px;
  color: #FFD700;
  position: absolute;
  left: 0;
}
*/

/* 반응형 */
@media (max-width: 768px) {
  .category-grade-card {
    padding: 15px;
    min-width: unset;
  }
  .category-badge-image {
    width: 80px;
  }
  .category-grade-name {
    font-size: 18px;
  }
  .category-grade-level {
    font-size: 12px;
  }
  .category-grade-benefits h4 {
    font-size: 13px;
  }
  .category-grade-benefits li {
    font-size: 10px;
    padding-left: 15px;
  }
}
</style>
