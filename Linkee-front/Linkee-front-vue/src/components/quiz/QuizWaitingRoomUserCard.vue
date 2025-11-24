<template>
  <div class="room-card">
    <!-- 카드 배경 -->
    <img src="@/assets/대기실 카드.svg" class="card-bg" />

    <!-- 상태 태그 (방장 / 대기 / 준비) -->
    <div :class="['status-tag', user.isLeader ? 'leader' : 'normal']">
      {{ user.isLeader ? '방장' : (user.status === 'READY' ? '준비' : '대기') }}
    </div>

    <!-- 캐릭터 -->
    <img src="@/assets/대기실 캐릭터.svg" class="character-img" />

    <!-- 닉네임 / 등급 -->
    <div class="info-area">
      <p class="nickname">{{ user.nickname }}</p>
      <p class="grade">{{ user.grade }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* 상위 div 배경 제거 */
.room-card {
  width: 220px;
  height: 280px;
  position: relative;
  background: none !important;
}

/* 카드 SVG가 전체 덮도록 */
.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 캐릭터 위치 ( SVG의 흰 영역 기준 중앙) */
.character-img {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  z-index: 2;
}

/* 상태 태그 */
.status-tag {
  position: absolute;
  top: 80px;
  left: 15px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  z-index: 3;
}

.status-tag.leader {
  background: #00BCD4;
  color: white;
}

.status-tag.normal {
  background: #BDBDBD;
  color: white;
}

/* 닉네임/등급 (SVG 하단 회색 영역 기준) */
.info-area {
  position: absolute;
  bottom: 60px;
  right: 60px;
  width: 100%;
  text-align: center;
  z-index: 2;
}

.nickname {
  font-size: 13px;
  font-weight: 600;
}

.grade {
  font-size: 12px;
  color: #666;
}
</style>
