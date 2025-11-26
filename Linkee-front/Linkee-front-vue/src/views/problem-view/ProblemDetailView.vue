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

      <!-- 로딩 중일 때 -->
      <div v-if="detailLoading" class="loading-card">
        문제 정보를 불러오는 중입니다...
      </div>

      <!-- 문제 상세 -->
      <section v-else-if="problemDetail" class="problem-detail-card">
        <header class="detail-header">
          <div>
            <!-- TODO: 백엔드 응답에 맞게 키 이름 확인 필요 -->
            <span class="problem-tag">{{ problemDetail.categoryName }}</span>
            <h2 class="detail-title">{{ problemDetail.questionTitle }}</h2>
            <div class="detail-meta">
              <span>작성자 : {{ problemDetail.userNickname }}</span>
              <span>등록일 : {{ formatDate(problemDetail.createdAt) }}</span>
              <span>조회수 : {{ problemDetail.viewCount }}</span>
            </div>
          </div>

          <!-- 오른쪽: 소유자이면 수정/삭제, 비소유자이면 북마크 -->
          <div class="detail-right">

            <!-- 북마크 버튼 -->
            <button
                v-if="!isOwner"
                class="bookmark-btn"
                :class="{ active: isProblemBookmarked }"
                @click="toggleBookmark"
            >
              <img class="bookmark-icon" :src="isProblemBookmarked ? problemBookMarkIcon : bookmarkCancelIcon" alt="북마크" />
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
          <!-- TODO: 백엔드 응답에 맞게 키 이름 확인 필요 (ex: problemDetail.content) -->
          <p class="section-content">
            {{ problemDetail.content }}
          </p>
        </section>

        <!-- 보기 -->
        <!-- TODO: 백엔드 응답에 맞게 키 이름 확인 필요 (ex: problemDetail.options) -->
        <section class="detail-section" v-if="problemDetail.options && problemDetail.options.length">
          <h3 class="section-title">보기</h3>
          <div class="option-box">
            <div v-for="(opt, idx) in problemDetail.options" :key="opt.optionId" class="option-row">
              <span class="option-step">{{ opt.optionIndex }}번</span>
              <span>{{ opt.optionText }}</span>
            </div>
          </div>

          <!-- 정답 표시: options 배열에서 isCorrected가 'Y'인 항목을 찾아 표시 -->
          <div class="answer-text">
            정답 :
            <template v-for="(opt, idx) in problemDetail.options">
                <span v-if="opt.isCorrected === 'Y'">{{ opt.optionIndex }}번 {{ opt.optionText }}</span>
            </template>
          </div>
        </section>

        <div class="detail-action-row">
          <BaseButton size="large" color="blue" @click="goList">
            목록으로
          </BaseButton>
        </div>
      </section>

      <!-- 데이터가 없을 때 -->
      <div v-else class="loading-card">
        요청한 문제 정보를 찾을 수 없습니다.
      </div>


      <!-- ===================== 댓글 ===================== -->
      <CommentList v-if="problemDetail" :question-id="problemDetail.questionId" />
      <!-- ================================================= -->
      <!-- ================================================= -->
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProblemStore } from '@/stores/problemStore'
import { useAuthStore } from '@/stores/authStore' // authStore 추가
import BaseButton from '@/components/base/button/BaseButton.vue'
import CommentList from '@/components/problem/CommentList.vue'; // CommentList 컴포넌트 추가
import { addBookmark, removeBookmark, getBookmarkedQuestions } from '@/api/problemApi.js'; // 북마크 API 추가

//icon
import problemBackIcon from '@/assets/problem_back_icon.svg'
import problemBookMarkIcon from '@/assets/problem_bookmark_icon.svg'
import bookmarkCancelIcon from '@/assets/bookmark-cancel.svg'; // 북마크 취소 아이콘 추가
import profileImg from '@/assets/profile_img.svg'


const router = useRouter()
const route = useRoute()
const problemStore = useProblemStore()
const authStore = useAuthStore() // authStore 인스턴스 생성

// Store에서 상태 가져오기
const { problemDetail, detailLoading } = storeToRefs(problemStore)
const { user: currentUser, isLoggedIn } = storeToRefs(authStore) // authStore에서 사용자 정보 가져오기

// 🚨 중요: 백엔드 응답에 'userEmail'이 있는지, authStore의 user 객체에 'username'(email)이 있는지 확인 필요
const isOwner = computed(
  () => isLoggedIn.value && problemDetail.value?.userEmail === currentUser.value?.username
)

// 댓글 작성자 이름으로 현재 로그인된 사용자 닉네임 사용
const currentUserName = computed(() => currentUser.value?.nickname || '방문자')

// 북마크 상태 (초기값은 false)
const isProblemBookmarked = ref(false);

// 🚨 권한 확인 디버깅용
watchEffect(() => {
  if (problemDetail.value && currentUser.value) {
    console.log('--- 권한 확인 디버깅 ---');
    console.log('문제 작성자 이메일 (userEmail):', problemDetail.value.userEmail, `(타입: ${typeof problemDetail.value.userEmail})`);
    console.log('로그인 사용자 이메일 (username):', currentUser.value.username, `(타입: ${typeof currentUser.value.username})`);
    console.log('isOwner 계산 결과:', isOwner.value);
    console.log('--------------------------');
  }
});


// 라이프사이클 훅: 컴포넌트가 마운트될 때 데이터 로드
onMounted(() => {
  const questionId = route.params.id;
  if (questionId) {
    problemStore.fetchProblemDetail(questionId);
    checkBookmarkStatus(questionId); // 북마크 상태 확인
  }
})

// 북마크 상태 확인 함수
const checkBookmarkStatus = async (questionId) => {
  if (!isLoggedIn.value) { // 로그인 안 했으면 북마크 상태 확인할 필요 없음
    isProblemBookmarked.value = false;
    return;
  }
  try {
    const response = await getBookmarkedQuestions({ page: 0, size: 9999 }); // 모든 북마크 가져옴
    const bookmarkedList = response.data.content;
    isProblemBookmarked.value = bookmarkedList.some(bookmark => bookmark.questionId === Number(questionId));
  } catch (error) {
    console.error('북마크 상태 확인 실패:', error);
    isProblemBookmarked.value = false;
  }
};

// 날짜 포맷 함수
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

// 수정 이동
const goEdit = () => {
  router.push({ name: 'ProblemEdit', params: { id: problemDetail.value.questionId } })
}
// 삭제 처리
const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  if (!problemDetail.value?.questionId) {
    alert('삭제할 문제 정보가 없습니다.');
    return;
  }

  const result = await problemStore.deleteQuestionAction(problemDetail.value.questionId);

  if (result.success) {
    alert('문제가 성공적으로 삭제되었습니다.');
    router.push({ name: 'ProblemList' }); // 성공 시 목록으로 이동
  } else {
    alert(`문제 삭제에 실패했습니다: ${result.message}`);
  }
}

// 목록으로 이동
const goList = () => {
  router.push({ name: 'ProblemList' })
}

// 북마크 토글
const toggleBookmark = async () => {
  if (!isLoggedIn.value) {
    alert('로그인 후 이용해주세요.');
    return;
  }

  const questionId = problemDetail.value?.questionId;
  if (!questionId) {
    alert('문제를 찾을 수 없습니다.');
    return;
  }

  try {
    if (isProblemBookmarked.value) {
      await removeBookmark(questionId);
      alert('북마크가 해제되었습니다.');
    } else {
      await addBookmark(questionId);
      alert('북마크가 등록되었습니다.');
    }
    isProblemBookmarked.value = !isProblemBookmarked.value; // 상태 즉시 업데이트 (낙관적 UI)
  } catch (error) {
    console.error('북마크 토글 실패:', error);
    alert('북마크 처리 중 오류가 발생했습니다.');
  }
}
</script>


<style scoped>

/* 전체 배경 */
.problem-page {
  height: 100%;
  overflow: auto;
}

/* 로딩 카드 */
.loading-card {
  text-align: center;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
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

</style>