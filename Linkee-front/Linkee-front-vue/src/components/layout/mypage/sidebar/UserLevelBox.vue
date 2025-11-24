<template>
  <div class="level-box">
    <h3>나의 등급</h3>

    <div class="badge">
      <img src="@/assets/Yellow Grade.svg" alt="badge" />
    </div>

    <div class="progress">
      <span>{{ level }} / 20</span>
      <div class="bar">
        <div class="fill" :style="{ width: (level / 20 * 100) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const level = 14;
</script>

<style scoped>
.level-box {
  background: white;
  border-radius: 20px;
  padding: 25px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.level-box h3 {
  color: #0094F6;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px; /* 제목과 뱃지 사이 간격 */
  text-align: left;
  }

.badge {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.badge img {
  width: 150px;
}
.progress {
  margin-top: 10px;
  text-align: center;
}
.progress span {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
  }
.bar {
  width: 100%;
  height: 10px;
  background: #E0F2FF;
  border-radius: 6px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #0094F6;
  border-radius: 6px;
}
</style>
