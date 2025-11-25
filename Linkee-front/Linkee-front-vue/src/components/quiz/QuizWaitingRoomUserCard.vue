<template>
  <!-- 🔥 카드 전체 클릭 + 이벤트 전달 -->
  <div class="room-card" @click="emitClickUser($event)">

    <!-- 카드 배경 -->
    <img src="@/assets/대기실 카드.svg" class="card-bg" />

    <!-- 상태 태그 -->
    <div
        :class="[
        'status-tag',
        user.isLeader ? 'leader' : user.status === 'READY' ? 'ready' : 'normal'
      ]"
    >
      {{ user.isLeader ? '방장' : user.status === 'READY' ? '준비' : '대기' }}
    </div>

    <!-- 캐릭터 (이미 카드 클릭에 포함됨) -->
    <img src="@/assets/대기실 캐릭터.svg" class="character-img" />

    <!-- 닉네임 / 등급 -->
    <div class="info-area">
      <p class="nickname">{{ user.nickname }}</p>
      <p class="grade">{{ user.grade }}</p>
    </div>

  </div>
</template>

<script setup>
/* 사용자 정보 */
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

/* 이벤트 정의 */
const emit = defineEmits(['click-user'])

/* 🔥 클릭 시 event + user 전달 */
function emitClickUser(event) {
  emit('click-user', event, props.user)
}
</script>

<style scoped>
.room-card {
  width: 100%;
  height: 100%;
  position: relative;
  background: none;
  overflow: hidden;
  cursor: pointer; /* 클릭 가능 표시 */
}

/* 카드 배경 */
.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 캐릭터 */
.character-img {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  z-index: 2;
  transition: transform 0.15s ease;
}

.character-img:hover {
  transform: translateX(-50%) scale(1.05);
}

/* 상태 태그 */
.status-tag {
  position: absolute;
  top: 60px;
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

.status-tag.ready {
  background: #FF977A;
  color: white;
}

/* 닉네임 / 등급 */
.info-area {
  position: absolute;
  bottom: 50px;
  right: 90px;
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
  font-weight: 600;
  color: #666;
}
</style>
