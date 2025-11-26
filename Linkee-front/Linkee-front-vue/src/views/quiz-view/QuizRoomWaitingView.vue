<template>
  <div class="waiting-room">

    <!-- 상단 제목 + 태그 -->
    <div class="top-header">
      <p class="title">{{ roomInfo.title }}</p>
      <div class="tag-area">
        <span class="tag">{{ roomInfo.category }}</span>
        <span class="tag">{{ roomInfo.problemCount }}문제</span>
        <span class="tag">{{ roomInfo.current }}/{{ roomInfo.max }}</span>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="button-area">

      <!-- 나가기 버튼 -->
      <button class="icon-btn exit-btn" @click="leaveRoom">
        <img src="@/assets/icon/leave.png" alt="나가기" />
      </button>

      <!-- 준비 / 게임시작 버튼 -->
      <BaseButton
          v-if="myInfo.isLeader"
          color="orange"
          size="medium"
          :disabled="!allReady"
          @click="startGame"
      >
        게임시작
      </BaseButton>

      <BaseButton
          v-else
          class="ready-btn"
          color="orange"
          size="medium"
          @click="toggleReady"
      >
        {{ myInfo.isReady ? '준비완료' : '준비' }}
      </BaseButton>

      <!-- 초대 버튼 -->
      <button class="icon-btn invite-btn" @click="showInviteModal = true">
        <img src="@/assets/icon/invite.png" alt="초대하기" />
      </button>

    </div>

    <!-- 유저 및 빈 슬롯 카드 -->
    <div class="card-container">
      <!-- 1줄 3칸 -->
      <div class="row">
        <div
            v-for="slot in 3"
            :key="'row1-' + slot"
            class="card-wrapper">
          <QuizWaitingRoomUserCard
              v-if="users[slot - 1]"
              :user="users[slot - 1]"
              @click-user="(event) => openUserModal(event, users[slot - 1])"
          />
          <img v-else src="@/assets/대기실 X.svg" alt="empty" class="slot-card" />
        </div>
      </div>

      <!-- 2줄 2칸 -->
      <div class="row">
        <div
            v-for="slot in 2"
            :key="'row2-' + slot"
            class="card-wrapper">
          <QuizWaitingRoomUserCard
              v-if="users[slot + 2]"
              :user="users[slot + 2]"
              @click-user="(event) => openUserModal(event, users[slot + 2])"
          />
          <img v-else src="@/assets/대기실 X.svg" alt="empty" class="slot-card" />
        </div>
      </div>
    </div>

    <!-- 초대 모달 -->
    <BaseModal v-model="showInviteModal" title="친구 초대">
      <div class="invite-content">
        <p>초대할 친구를 선택하세요.</p>
        <div v-for="friend in friends" :key="friend.id" class="invite-item">
          <span>{{ friend.name }}</span>
          <BaseButton size="small" color="blue" @click="invite(friend)">초대하기</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- 작은 선택 모달 (대화하기 / 신고하기) -->
    <ChoiceModal
        :show="isModalOpen"
        :data="selectedFriend"
        type="friend"
        :x="modalX"
        :y="modalY"
        @close="() => isModalOpen = false"
        @action="handleAction"
    />

    <!-- 신고 모달 -->
    <ReportModal
        v-model="isReportModal"
        :target="reportTarget"
        @submit="handleReportSubmit"
    />

    <!-- 1:1 채팅 모달 -->
    <ChattingModal
        v-model="isChatModal"
        :room="currentRoom"
        :members="currentRoom?.members"
        :messages="roomMessages"
    />
  </div>

</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import BaseButton from '@/components/base/button/BaseButton.vue'
import QuizWaitingRoomUserCard from '@/components/quiz/QuizWaitingRoomUserCard.vue'
import BaseModal from "@/components/base/modal/BaseModal.vue";
import ChoiceModal from "@/components/common/modal/ChoiceModal.vue";
import ReportModal from "@/components/home/modal/ReportModal.vue";
import ChattingModal from "@/components/home/modal/ChattingModal.vue";
import { fetchQuizRoomDetail } from '@/api/quizRoomApi'

const modalX = ref(0)
const modalY = ref(0)

// 기존 코드 아래에 추가
const isModalOpen = ref(false)
const selectedFriend = ref(null)

// 신고 모달 상태
const isReportModal = ref(false)
const reportTarget = ref(null)

// 1:1 채팅 모달 상태
const isChatModal = ref(false)
const currentRoom = ref(null)
const roomMessages = ref([])

// 내 정보 (채팅 모달용)
const me = { id: 999, name: "나" }

function openUserModal(event, user) {
  if (!user) return
  selectedFriend.value = user

  const rect = event.currentTarget.getBoundingClientRect()
  modalX.value = rect.left + rect.width / 2
  modalY.value = rect.top - 10

  isModalOpen.value = true
}

// ChoiceModal에서 "대화하기 / 신고하기" 선택 시 호출
function handleAction(type) {
  isModalOpen.value = false

  // 신고하기
  if (type === 'report') {
    reportTarget.value = selectedFriend.value
    isReportModal.value = true
    return
  }

  // 1:1 채팅하기
  if (type === 'chat') {
    const friend = selectedFriend.value

    currentRoom.value = {
      id: Date.now(),
      title: `${friend.nickname || friend.name}님과 대화`,
      members: [me, friend],
      messages: []
    }

    roomMessages.value = []
    isChatModal.value = true
  }
}

// 신고 모달 제출 콜백
function handleReportSubmit(data) {
  console.log('신고 접수됨:', data)
}

const router = useRouter()
const route = useRoute()

const roomId = Number(route.query.roomId || route.params.roomId)

const showInviteModal = ref(false);

const friends = ref([
  { id: 101, name: "김비김비김" },
  { id: 102, name: "김명지니" },
  { id: 103, name: "진진돌이" }
]);

const invite = (friend) => {
  alert(friend.name + " 님을 초대했습니다.");
  showInviteModal.value = false;
};

const roomInfo = ref({
  title: '',
  category: route.query.category || '',
  problemCount: Number(route.query.problemCount || 0),
  current: 0,
  max: 0
})

const myInfo = ref({
  id: null,
  isReady: false,
  isLeader: false
})


const users = ref([])

const allReady = computed(() => users.value.every(u => u.status === 'READY'))

/* ========= 대기실 데이터 로딩 ========= */
const loadRoomDetail = async () => {
  try {
    const data = await fetchQuizRoomDetail(roomId);

    // 1. 상단 정보 업데이트
    roomInfo.value = {
      title: data.roomTitle,
      category: data.categoryName,
      problemCount: data.roomQuizLimit,
      current: data.members?.length || 0,
      max: data.roomCapacity || 0
    };

    // 2. 내 정보 업데이트
    myInfo.value.id = data.currentUserId;
    myInfo.value.isReady = false; // 준비 상태는 항상 false로 시작
    myInfo.value.isLeader = data.owner; // API의 isOwner로 방장 여부 판단

    // 3. 멤버 리스트 정보 업데이트
    users.value = (data.members || []).map(m => ({
      id: m.memberId,
      nickname: m.memberNickname,
      name: m.memberNickname,
      grade: 'BRONZE',
      status: m.ready ? 'READY' : 'WAIT', // isReady 필드 사용
      isLeader: m.owner,                 // isOwner 필드 사용
      roomMemberId: m.roomMemberId
    }));

  } catch (e) {
    console.error('대기실 정보 조회 실패', e);
    alert('방 정보를 불러오지 못했습니다.');
    router.push('/quiz/rooms');
  }
};


onMounted(() => {
  if (!roomId) {
    alert('잘못된 접근입니다.')
    router.push('/quiz/rooms')
    return
  }
  loadRoomDetail()
})
//TODO : 웹소켓 구현 후 서버로 전송
function toggleReady() {
  myInfo.value.isReady = !myInfo.value.isReady
  const user = users.value.find(u => u.id === myInfo.value.id)
  if (user) user.status = myInfo.value.isReady ? 'READY' : 'WAIT'
}

function startGame() { console.log('게임 시작') }

function leaveRoom() { router.push('/quiz/rooms') }

</script>

<style scoped>
/* 이하 스타일 기존 그대로 */
.waiting-room {
  background: #D9EBF5;
  padding: 0px 0 30px 0;
  text-align: center;
  min-height: calc(100vh - 90px);
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #79B9FD;
  height: 55px;
  padding: 10px 30px;
  border-radius: 10px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.tag-area {
  display: flex;
  gap: 6px;
}

.tag {
  border: 5px solid #FF977A;
  padding: 10px 20px;
  border-radius: 20px;
  background: white;
  font-size: 15px;
}

.button-area {
  display: flex;
  justify-content: space-between;
  width: 1150px;
  margin: 10px auto;
}

.ready-btn {
  font-size: 20px !important;
  height: 55px;
}

.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-top: 12px;
}

.row {
  display: flex;
  justify-content: center;
  gap: 18px;
}

.card-wrapper {
  width: 300px;
  aspect-ratio: 300 / 218;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-card {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  opacity: 0.35;
}

.icon-btn {
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 40%;
  padding: 0;
  cursor: pointer;
  background: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  user-select: none;
}

.icon-btn img {
  width: 40px;
  height: 40px;
}

.icon-btn:hover {
  transform: scale(1.06);
}

.invite-btn {
  background: #4AB5F5;
  padding-bottom: 10px;
}

.exit-btn {
  background: #41D35E;
  padding-right: 5px;
}

.invite-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 10px;
}

.invite-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f3faff;
  border-radius: 8px;
}
</style>
