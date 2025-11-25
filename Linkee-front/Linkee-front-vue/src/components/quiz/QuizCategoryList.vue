<template>
  <div class="category-container">
    <div
        v-for="(category, index) in categories"
        :key="index"
        class="category-btn"
    >
      {{ category.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizCategoryList",
  data() {
    return {
      categories: [
        { name: "카테고리" },
        { name: "카테고리" },
        { name: "카테고리" },
        { name: "카테고리" },
        { name: "카테고리" },
      ],
    };
  },
};
</script>

<style scoped>
.category-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 양쪽 포함 균등 분배 */
  align-items: center;
  width: 100%;
  padding: 0 16px; /* Figma 기준 우측 영역 고려 → 실제 좌우 여백 */
  box-sizing: border-box;
}

.category-btn {
  flex: 1 1 160px;
  min-width: 160px;
  height: 90px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  /* Gradient 정확히 반영 (4DD0E1 → 00BCD4) */
  background: linear-gradient(90deg, #4DD0E1 0%, #00BCD4 100%);

  /* 그림자 (figma: X=2, Y=5, Blur=5, Color=#1CC2D7 30%) */
  box-shadow: 2px 5px 5px rgba(28, 194, 215, 0.3);
}
</style>
