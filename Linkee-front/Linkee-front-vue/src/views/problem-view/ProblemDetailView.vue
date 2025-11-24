<template>
  <div class="problem-page">
    <div class="page-inner">
      <!-- 제목  -->
      <header class="problem-header">
        <button class="back-btn" @click="goList">
          <img class="back-icon" :src="problemBackIcon" alt="뒤로 가기" />
        </button>
        <h1 class="page-title">문제게시판</h1>
      </header>

      <!-- 문제 상세 -->
      <section class="problem-detail-card">
        <header class="detail-header">
          <div>
            <span class="problem-tag">{{ problem.category }}</span>
            <h2 class="detail-title">{{ problem.title }}</h2>
            <div class="detail-meta">
              <span>작성자 : {{ problem.writer }}</span>
              <span>등록일 : {{ problem.createdAt }}</span>
              <span>조회수 : {{ problem.views }}</span>
            </div>
          </div>

          <!-- 오른쪽: 소유자이면 수정/삭제, 비소유자이면 북마크 -->
          <div class="detail-right">

            <!-- 북마크 버튼 -->
            <button
                v-if="!isOwner"
                class="bookmark-btn"
                :class="{ active: problem.bookmarked }"
                @click="toggleBookmark"
            >
              <img class="bookmark-icon" :src="problemBookMarkIcon" alt="북마크" />
            </button>

            <!-- 작성자일 때만 수정/삭제 -->
            <div class="detail-actions" v-if="isOwner">
              <BaseButton color="gray" size="small" @click="goEdit">
                수정
              </BaseButton>
              <BaseButton color="orange" size="small" @click="handleDelete">
                삭제
              </BaseButton>
            </div>
          </div>


        </header>

        <!-- 문제 내용 -->
        <section class="detail-section">
          <h3 class="section-title">문제</h3>
          <p class="section-content">
            {{ problem.content }}
          </p>
        </section>

        <!-- 보기 -->
        <section class="detail-section" v-if="problem.options.length">
          <h3 class="section-title">보기</h3>
          <div class="option-box">
            <div v-for="(opt, idx) in problem.options" :key="idx" class="option-row">
              <span class="option-step">{{ idx + 1 }}번</span>
              <span>{{ opt }}</span>
            </div>
          </div>

          <div class="answer-text">정답 : {{ problem.answer }}번</div>
        </section>

        <div class="detail-action-row">
          <BaseButton size="large" color="blue" @click="goList">
            목록으로
          </BaseButton>
        </div>
      </section>

      <!-- ===================== 댓글 ===================== -->
      <section class="comment-section">
        <h2 class="comment-title">댓글</h2>

        <!-- 상단 댓글 입력 -->
        <div class="comment-form">
          <!-- 아바타 + 닉네임 묶음 -->
          <div class="comment-user-block">
            <div class="avatar">
              <img :src="profileImg" alt="프로필" class="avatar-img" />
            </div>
            <div class="comment-user-name">
              {{ currentUserName }}
            </div>
          </div>

          <!-- 인풋 영역 -->
          <input v-model="newComment" type="text" placeholder="댓글을 입력하세요" @keyup.enter="addComment"/>
          <BaseButton color="blue" size="small" class="comment-submit" @click="addComment">등록</BaseButton>
        </div>


        <!-- 댓글 + 대댓글 목록 -->
        <div class="comment-list">
          <!-- 댓글 + 그에 대한 대댓글들 -->
          <div v-for="comment in topLevelComments" :key="comment.id" class="comment-thread">
            <!-- 부모 댓글 -->
            <div class="comment-item">
              <div class="avatar small">
                <img :src="profileImg" alt="프로필" class="avatar-img" />
              </div>

              <div class="comment-body">
                <div class="comment-header">
                  <span class="name">{{ comment.author }}</span>
                  <span class="date">{{ comment.date }} {{ comment.time }}</span>
                </div>

                <!-- 수정 모드 -->
                <div v-if="editingId === comment.id">
                  <input v-model="editText" type="text" class="edit-input"/>
                  <div class="edit-actions">
                    <BaseButton color="blue" size="small" @click="saveEdit(comment.id)">수정</BaseButton>
                    <BaseButton color="gray" size="small" @click="cancelEdit">취소</BaseButton>
                  </div>
                </div>

                <!-- 일반 -->
                <div v-else class="comment-content">
                  {{ comment.content }}
                </div>

                <!-- 액션 영역 -->
                <div class="comment-actions">
                  <span @click="openReply(comment.id)">답글</span>
                  <span v-if="comment.mine" @click="startEdit(comment)">수정</span>
                  <span v-if="comment.mine" class="delete" @click="deleteComment(comment.id)">삭제</span>
                </div>


                <!-- 대댓글 입력창  -->
                <div v-if="replyTargetId === comment.id" class="reply-form">
                  <div class="avatar small">
                    <img :src="profileImg" alt="프로필" class="avatar-img" />
                  </div>
                  <input v-model="replyText" type="text" placeholder="답글을 입력하세요" @keyup.enter="submitReply(comment.id)"/>
                  <BaseButton color="blue" size="small" class="comment-submit" @click="submitReply(comment.id)">등록</BaseButton>
                </div>
              </div>
            </div>

            <!-- 대댓글 리스트 -->
            <div v-for="reply in repliesFor(comment.id)" :key="reply.id" class="comment-item reply">
              <div class="avatar small">
                <img :src="profileImg" alt="프로필" class="avatar-img" />
              </div>

              <div class="comment-body">
                <div class="comment-header">
                  <span class="name">{{ reply.author }}</span>
                  <span class="date">{{ reply.date }} {{ reply.time }}</span>
                </div>

                <!-- 대댓글 수정 -->
                <div v-if="editingId === reply.id">
                  <input v-model="editText" type="text" class="edit-input"/>
                  <div class="edit-actions">
                    <BaseButton color="blue" size="small" @click="saveEdit(reply.id)">수정</BaseButton>
                    <BaseButton color="gray" size="small" @click="cancelEdit">취소</BaseButton>
                  </div>
                </div>

                <!-- 대댓글 일반  -->
                <div v-else class="comment-content">
                  {{ reply.content }}
                </div>

                <div v-if="reply.mine" class="comment-actions">
                  <span @click="startEdit(reply)">수정</span>
                  <span class="delete" @click="deleteComment(reply.id)">삭제</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- ================================================= -->
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/base/button/BaseButton.vue'

//icon
import problemBackIcon from '@/assets/problem_back_icon.svg'
import problemBookMarkIcon from '@/assets/problem_bookmark_icon.svg'
import profileImg from '@/assets/profile_img.svg'


const router = useRouter()
const route = useRoute()

// 로그인 된 유저 ID (더미 데이터)
const currentUserId = ref('USER-123')

// TODO: 실제 API 연동 시 교체

const problem = ref({
  id: Number(route.params.id),
  category: '네트워크',
  title: 'TCP 3-way handshake 흐름을 묻는 문제',
  writer: '김명지니어스',
  createdAt: '2025-11-17',
  views: 15,
  writerId: 'USER-123',
  bookmarked: false,
  content:
      'TCP 3-way handshake의 각 단계(SYN, SYN+ACK, ACK)를 순서대로 설명하세요.',
  options: [
    '클라이언트가 ACK를 먼저 보낸다.',
    '클라이언트 SYN → 서버 SYN+ACK → 클라이언트 ACK.',
    '서버가 두 번 SYN을 보낸다.',
    '자동으로 연결된다.'
  ],
  answer: 2
})

// 작성자 본인인지 여부
const isOwner = computed(
    () => problem.value.writerId === currentUserId.value
)

const currentUserName = ref('김이긴')

const comments = ref([
  {
    id: 1,
    parentId: null,
    author: 'dzma',
    content: '좋은 문제네요.',
    date: '2025-11-17',
    time: '13:21',
    mine: false
  },
  {
    id: 2,
    parentId: 1,
    author: '김이긴',
    content: '저도 좋은 문제라고 생각합니다.',
    date: '2025-11-18',
    time: '13:21',
    mine: true
  }
])

// 상단 새 댓글 입력
const newComment = ref('')

// 대댓글 입력용
const replyTargetId = ref(null)   // 어느 댓글에 대댓글을 다는지
const replyText = ref('')

const editingId = ref(null)      // 지금 수정 중인 댓글 id
const editText = ref('')         // 수정 입력값


// 수정 이동
const goEdit = () => {
  router.push({ name: 'ProblemEdit', params: { id: problem.value.id } })
}
// 삭제 처리
const handleDelete = () => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  console.log('삭제 요청:', problem.value.id)

  router.push({ name: 'ProblemList' })
}

// 상단 "목록으로" 이동
const goList = () => {
  router.push({ name: 'ProblemList' })
}

// 북마크 토글
const toggleBookmark = () => {
  problem.value.bookmarked = !problem.value.bookmarked
}

// 최상위 댓글만 필터링
const topLevelComments = computed(() =>
    comments.value.filter(c => c.parentId === null)
)

// 특정 댓글의 대댓글 목록
const repliesFor = (parentId) =>
    comments.value.filter(c => c.parentId === parentId)

// 새 댓글 등록 할 때 userNickname, 시간 더미데이터 (상단 입력창)
const addComment = () => {
  if (!newComment.value.trim()) return

  comments.value.push({
    id: Date.now(),
    parentId: null,
    author: '우하하',
    content: newComment.value.trim(),
    date: '2025-11-18',
    time: '13:21',
    mine: true
  })
  newComment.value = ''
}

// 답글(대댓글) 입력창 열기
const openReply = (commentId) => {
  // 같은 댓글을 다시 누르면 토글로 닫기
  if (replyTargetId.value === commentId) {
    replyTargetId.value = null
    replyText.value = ''
  } else {
    replyTargetId.value = commentId
    replyText.value = ''
  }
}

// 대댓글 등록
const submitReply = (parentId) => {
  if (!replyText.value.trim()) return

  comments.value.push({
    id: Date.now(),
    parentId,
    author: '김명지니어스',
    content: replyText.value.trim(),
    date: '2025-11-18',
    time: '13:21',
    mine: true
  })

  replyTargetId.value = null
  replyText.value = ''
}

// 댓글/대댓글 수정 시작
const startEdit = (comment) => {
  editingId.value = comment.id
  editText.value = comment.content
}

// 수정 저장
const saveEdit = (id) => {
  const target = comments.value.find(c => c.id === id)
  if (target) target.content = editText.value.trim() || target.content
  editingId.value = null
  editText.value = ''
}

// 수정 취소
const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
}

// 삭제 (부모 댓글 삭제 시 그 댓글의 대댓글도 같이 삭제)
const deleteComment = (id) => {
  comments.value = comments.value.filter(
      c => c.id !== id && c.parentId !== id
  )
}
</script>


<style scoped>

/* 전체 배경 */
.problem-page {
  min-height: 100vh;
}

/* 가운데 정렬 */
.page-inner {
  max-width: 1113px;
  margin: 80px auto 80px;
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


/* 상세 카드 */
.problem-detail-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 24px 28px;
  margin-bottom: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.problem-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #e2f2ff;
  color: #1d8fff;
  font-size: 12px;
  margin-bottom: 6px;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
}

.detail-meta {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 12px;
}

/* 북마크 버튼 */
.bookmark-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 수정 / 삭제 버튼 묶음 */
.detail-actions {
  display: flex;
  gap: 8px;
}

.bookmark-icon {
  width: 20px;
  height: 20px;
}

/* 본문 영역 */
.detail-section {
  margin-top: 20px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.section-content {
  font-size: 14px;
  line-height: 1.6;
}

/* 보기 영역 */
.option-box {
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
}

.option-row + .option-row {
  margin-top: 6px;
}

.option-step {
  font-weight: 600;
  margin-right: 4px;
}

.answer-text {
  margin-top: 10px;
  font-weight: 700;
  color: #2563eb;
}

/* 하단 버튼 */
.detail-action-row {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 8px 24px;
  border-radius: 999px;
  border: none;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

/* 댓글 영역 */
.comment-section {
  margin-top: 32px;
}

/* 제목 */
.comment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 상단 입력폼 */
.comment-form {
  background: #ffffff;
  border-radius: 999px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

/* 아바타 + 닉네임 묶음 */
.comment-user-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 72px;
}

.avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar.small {
  width: 32px;
  height: 32px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* 입력폼 안의 닉네임 */
.comment-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

/* 입력 */
.comment-form input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
}

/* 등록 버튼 */
.comment-submit {
  margin-left: 8px;
}

/* 댓글 전체 리스트 */
.comment-list {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
}

/* 한 쓰레드(부모 + 대댓글 묶음) */
.comment-thread {
  padding: 12px 0;
  border-top: 1px solid #646568;
}

/* 첫 번째 댓글은 위에 선 없게 */
.comment-thread:first-child {
  border-top: none;
}

/* 부모 댓글 아래에도 선 */
.comment-thread > .comment-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #646568;
}

/* 대댓글 박스 전체 */
.comment-thread .reply {
  margin-left: 32px;
  padding: 12px 0;
  border-bottom: 1px solid #646568;
}

/* 마지막 대댓글은 선 제거  */
.comment-thread .reply:last-child {
  border-bottom: none;
}

/* 부모 + 대댓글 공통 */
.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-left: 18px;
}

/* 대댓글 들여쓰기 */
.comment-item.reply {
  margin-top: 12px;
  margin-left: 32px;
}

.comment-item.reply .comment-body {
  margin-left: 0;
}

.comment-header {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.comment-header .name {
  font-weight: 600;
  color: #111827;
}

.comment-content {
  margin-top: 4px;
  font-size: 14px;
}

/* 액션: 답글/수정 회색 */
.comment-actions {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 8px;
}

.comment-actions span {
  cursor: pointer;
}

/* 삭제 빨간색 */
.comment-actions .delete {
  color: #ef4444;
}

/* 대댓글 입력창 */
.reply-form {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reply-form input {
  flex: 1;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  font-size: 14px;
}

/* 수정 모드 */
.edit-input {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 4px 8px;
  margin-top: 4px;
  font-size: 14px;
}

.edit-actions {
  margin-top: 4px;
  display: flex;
  gap: 8px;
  font-size: 12px;
}
/* ====== 반응형 ====== */

/* 태블릿 (<= 1024px) */
@media (max-width: 1024px) {
  .page-inner {
    max-width: 100%;
    margin: 60px auto 60px;
    padding: 0 16px;
  }

  .problem-detail-card {
    padding: 20px 20px;
  }

  .comment-form {
    border-radius: 16px;
  }
}

/* 모바일 (<= 768px) */
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


  .problem-detail-card {
    padding: 16px 16px;
  }


  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .detail-right {
    margin-top: 8px;
  }

  .detail-title {
    font-size: 18px;
  }

  .detail-meta {
    font-size: 11px;
    flex-wrap: wrap;
    row-gap: 2px;
  }

  .section-content {
    font-size: 13px;
  }


  .option-box {
    padding: 12px 12px;
  }


  .comment-form {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    border-radius: 12px;
  }

  .comment-user-block {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    min-width: auto;
  }

  .comment-user-name {
    font-size: 13px;
  }

  .comment-form input {
    font-size: 13px;
  }

  .comment-submit {
    align-self: flex-end;
    margin-left: 0;
  }


  .comment-item {
    padding-left: 0;
  }

  .comment-thread .reply {
    margin-left: 16px;
  }

  .comment-item.reply {
    margin-left: 16px;
  }

  .comment-header {
    font-size: 11px;
  }

  .comment-content {
    font-size: 13px;
  }

  .reply-form input {
    font-size: 13px;
  }
}

/* 모바일 보다 더작게 (<= 480px)  */
/*@media (max-width: 480px) {
  .page-inner {
    margin: 32px auto 32px;
    padding: 0 10px;
  }

  .problem-detail-card {
    padding: 14px 14px;
  }

  .detail-title {
    font-size: 17px;
  }

  .detail-meta {
    font-size: 10px;
  }

  .comment-form {
    padding: 8px 12px;
  }
}*/


</style>