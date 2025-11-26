<template>
  <section class="comment-section">
    <h2 class="comment-title">댓글</h2>

    <!-- 상단 댓글 입력 폼 -->
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
      <input v-model="newCommentContent" type="text" placeholder="댓글을 입력하세요" @keyup.enter="addComment"/>
      <BaseButton color="blue" size="small" class="comment-submit" @click="addComment" :disabled="!newCommentContent.trim()">등록</BaseButton>
    </div>

    <!-- 댓글 + 대댓글 목록 -->
    <div class="comment-list">
      <div v-if="loading">댓글을 불러오는 중...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="comments.length > 0">
        <CommentListItem
          v-for="comment in topLevelComments"
          :key="comment.commentId"
          :comment="comment"
          :question-id="questionId"
          @commentUpdated="fetchComments"
          @commentDeleted="fetchComments"
          @commentAdded="fetchComments"
        >
          <template #default>
            <!-- 대댓글 리스트는 CommentListItem의 slot을 통해 전달 -->
            <div v-if="comment.childCount > 0" class="comment-thread reply"> <!-- 대댓글은 comment-thread reply 클래스를 추가 -->
              <CommentListItem
                v-for="child in getChildComments(comment.commentId)"
                :key="child.commentId"
                :comment="child"
                :question-id="questionId"
                @commentUpdated="fetchComments"
                @commentDeleted="fetchComments"
                @commentAdded="fetchComments"
              />
            </div>
          </template>
        </CommentListItem>
      </div>
      <div v-else>
        아직 댓글이 없습니다.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCommentsByQuestionId, createComment } from '@/api/problemApi.js';
import CommentListItem from './CommentListItem.vue';
import BaseButton from '@/components/base/button/BaseButton.vue'; // BaseButton 추가
import profileImg from '@/assets/profile_img.svg'; // 프로필 이미지 추가
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  questionId: {
    type: [Number, String],
    required: true,
  },
});

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)
const currentUserName = computed(() => currentUser.value?.nickname || '방문자')


const comments = ref([]);
const loading = ref(false);
const error = ref(null);
const newCommentContent = ref(''); // 새 댓글 내용을 위한 ref

const fetchComments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getCommentsByQuestionId(props.questionId);
    comments.value = response.data;
  } catch (err) {
    error.value = '댓글을 불러오는 데 실패했습니다.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const addComment = async () => {
  if (!newCommentContent.value.trim()) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  try {
    await createComment(props.questionId, { commentContent: newCommentContent.value });
    newCommentContent.value = ''; // 입력 필드 초기화
    await fetchComments(); // 댓글 목록 새로고침
  } catch (err) {
    console.error('댓글 생성 실패:', err);
    alert('댓글 생성에 실패했습니다.');
  }
};

onMounted(() => {
  fetchComments();
});

const topLevelComments = computed(() => {
  return comments.value.filter(comment => comment.parentCommentId === null);
});

const getChildComments = (parentId) => {
  return comments.value.filter(comment => comment.parentCommentId === parentId);
};
</script>

<style scoped>
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
/* .comment-item { // CommentListItem.vue에서 관리
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-left: 18px;
} */

/* 대댓글 들여쓰기 */
/* .comment-item.reply { // CommentListItem.vue에서 관리
  margin-top: 12px;
  margin-left: 32px;
} */

/* .comment-item.reply .comment-body { // CommentListItem.vue에서 관리
  margin-left: 0;
} */

/* .comment-header { // CommentListItem.vue에서 관리
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
} */

/* .comment-header .name { // CommentListItem.vue에서 관리
  font-weight: 600;
  color: #111827;
} */

/* .comment-content { // CommentListItem.vue에서 관리
  margin-top: 4px;
  font-size: 14px;
} */

/* 액션: 답글/수정 회색 */
/* .comment-actions { // CommentListItem.vue에서 관리
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 8px;
} */

/* .comment-actions span { // CommentListItem.vue에서 관리
  cursor: pointer;
} */

/* 삭제 빨간색 */
/* .comment-actions .delete { // CommentListItem.vue에서 관리
  color: #ef4444;
} */

/* 대댓글 입력창 */
/* .reply-form { // CommentListItem.vue에서 관리
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
} */

/* .reply-form input { // CommentListItem.vue에서 관리
  flex: 1;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  font-size: 14px;
} */

/* 수정 모드 */
/* .edit-input { // CommentListItem.vue에서 관리
  width: 100%;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 4px 8px;
  margin-top: 4px;
  font-size: 14px;
} */

/* .edit-actions { // CommentListItem.vue에서 관리
  margin-top: 4px;
  display: flex;
  gap: 8px;
  font-size: 12px;
} */
/* ====== 반응형 ====== */

/* 태블릿 (<= 1024px) */
@media (max-width: 1024px) {
  /* .page-inner { // CommentList 외부 요소
    max-width: 100%;
    margin: 60px auto 60px;
    padding: 0 16px;
  } */

  /* .problem-detail-card { // CommentList 외부 요소
    padding: 20px 20px;
  } */

  .comment-form {
    border-radius: 16px;
  }
}

/* 모바일 (<= 768px) */
@media (max-width: 768px) {
  /* .page-inner { // CommentList 외부 요소
    margin: 40px auto 40px;
    padding: 0 12px;
  } */

  /* .problem-header { // CommentList 외부 요소
    gap: 8px;
    margin-bottom: 16px;
  } */

  /* .page-title { // CommentList 외부 요소
    font-size: 20px;
  } */


  /* .problem-detail-card { // CommentList 외부 요소
    padding: 16px 16px;
  } */


  /* .detail-header { // CommentList 외부 요소
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  } */

  /* .detail-right { // CommentList 외부 요소
    margin-top: 8px;
  } */

  /* .detail-title { // CommentList 외부 요소
    font-size: 18px;
  } */

  /* .detail-meta { // CommentList 외부 요소
    font-size: 11px;
    flex-wrap: wrap;
    row-gap: 2px;
  } */

  /* .section-content { // CommentList 외부 요소
    font-size: 13px;
  } */


  /* .option-box { // CommentList 외부 요소
    padding: 12px 12px;
  } */


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


  /* .comment-item { // CommentListItem.vue에서 관리
    padding-left: 0;
  } */

  .comment-thread .reply {
    margin-left: 16px;
  }

  /* .comment-item.reply { // CommentListItem.vue에서 관리
    margin-left: 16px;
  } */

  /* .comment-header { // CommentListItem.vue에서 관리
    font-size: 11px;
  } */

  /* .comment-content { // CommentListItem.vue에서 관리
    font-size: 13px;
  } */

  /* .reply-form input { // CommentListItem.vue에서 관리
    font-size: 13px;
  } */
}
</style>