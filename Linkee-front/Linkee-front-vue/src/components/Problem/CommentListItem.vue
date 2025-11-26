<template>
  <!-- 한 쓰레드(부모 + 대댓글 묶음) -->
  <div :class="['comment-thread', { 'reply': comment.parentCommentId !== null }]">
    <!-- 부모 댓글 또는 대댓글 -->
    <div :class="['comment-item', { 'reply': comment.parentCommentId !== null }]">
      <!-- 아바타 (임시) -->
      <div class="avatar small">
        <img :src="profileImg" alt="프로필" class="avatar-img" />
      </div>

      <div class="comment-body">
        <div class="comment-header">
          <span class="name">{{ comment.userNickname }}</span>
          <span class="date">{{ formattedCreatedAt }}</span>
        </div>

        <!-- 수정 모드 -->
        <div v-if="isEditing">
          <textarea v-model="editedContent" rows="3" class="edit-input"></textarea>
          <div class="edit-actions">
            <BaseButton color="blue" size="small" @click="saveEdit">수정</BaseButton>
            <BaseButton color="gray" size="small" @click="cancelEdit">취소</BaseButton>
          </div>
        </div>

        <!-- 일반 모드 -->
        <div v-else class="comment-content">
          {{ comment.commentContent }}
        </div>

        <!-- 액션 영역 (답글, 수정, 삭제) -->
        <div class="comment-actions">
          <span @click="showReplyForm = !showReplyForm">답글</span>
          <!-- 현재 사용자가 댓글 작성자인 경우에만 수정/삭제 버튼 표시 -->
          <template v-if="currentUser && currentUser.username === comment.userEmail">
            <span @click="startEdit">수정</span>
            <span class="delete" @click="handleDelete">삭제</span>
          </template>
        </div>

        <!-- 답글 입력창 -->
        <div v-if="showReplyForm" class="reply-form">
          <div class="avatar small">
            <img :src="profileImg" alt="프로필" class="avatar-img" />
          </div>
          <input v-model="newReplyContent" type="text" placeholder="답글을 입력하세요" @keyup.enter="submitReply" />
          <BaseButton color="blue" size="small" @click="submitReply" :disabled="!newReplyContent.trim()">등록</BaseButton>
        </div>
      </div>
    </div>
    <!-- 자식 댓글은 slot으로 받아서 렌더링 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { updateComment, deleteComment, createComment } from '@/api/problemApi.js';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import BaseButton from '@/components/base/button/BaseButton.vue'; // BaseButton 추가
import profileImg from '@/assets/profile_img.svg'; // 프로필 이미지 추가

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  questionId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(['commentUpdated', 'commentDeleted', 'commentAdded']);

const authStore = useAuthStore();
const { user: currentUser } = storeToRefs(authStore);

const showReplyForm = ref(false);
const isEditing = ref(false);
const editedContent = ref('');
const newReplyContent = ref('');

const formattedCreatedAt = computed(() => {
  if (!props.comment.createdAt) {
    return '';
  }
  const date = new Date(props.comment.createdAt);
  // 원래 포맷인 'YYYY-MM-DD HH:MM'으로 변경
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
});

const startEdit = () => {
  isEditing.value = true;
  editedContent.value = props.comment.commentContent;
};

const saveEdit = async () => {
  if (!editedContent.value.trim()) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  try {
    await updateComment(props.questionId, props.comment.commentId, { commentContent: editedContent.value });
    isEditing.value = false;
    emit('commentUpdated');
  } catch (err) {
    console.error('댓글 수정 실패:', err);
    alert('댓글 수정에 실패했습니다.');
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedContent.value = '';
};

const handleDelete = async () => {
  if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
    return;
  }
  try {
    await deleteComment(props.questionId, props.comment.commentId);
    emit('commentDeleted');
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    alert('댓글 삭제에 실패했습니다.');
  }
};

const submitReply = async () => {
  if (!newReplyContent.value.trim()) {
    alert('답글 내용을 입력해주세요.');
    return;
  }
  try {
    await createComment(props.questionId, {
      parentCommentId: props.comment.commentId,
      commentContent: newReplyContent.value,
    });
    newReplyContent.value = '';
    showReplyForm.value = false;
    emit('commentAdded');
  } catch (err) {
    console.error('답글 생성 실패:', err);
    alert('답글 생성에 실패했습니다.');
  }
};
</script>

<style scoped>
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
.comment-thread.reply {
  margin-left: 32px;
  padding: 12px 0;
  border-bottom: 1px solid #646568;
}

/* 마지막 대댓글은 선 제거  */
.comment-thread.reply:last-child {
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

.comment-body {
  flex: 1; /* 댓글 본문이 공간을 채우도록 */
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

/* 모바일 (<= 768px) */
@media (max-width: 768px) {
  .comment-item {
    padding-left: 0;
  }

  .comment-thread.reply {
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
