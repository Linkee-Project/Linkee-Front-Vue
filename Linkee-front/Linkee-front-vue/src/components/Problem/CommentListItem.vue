<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="comment-author">{{ comment.userNickname }}</span>
      <span class="comment-date">{{ formattedCreatedAt }}</span>
    </div>

    <!-- 댓글 내용 (수정 모드와 일반 모드) -->
    <div class="comment-content">
      <template v-if="isEditing">
        <textarea v-model="editedContent" rows="3"></textarea>
        <div class="edit-actions">
          <button @click="saveEdit">저장</button>
          <button @click="cancelEdit">취소</button>
        </div>
      </template>
      <template v-else>
        <p>{{ comment.commentContent }}</p>
      </template>
    </div>

    <div class="comment-actions">
      <button @click="showReplyForm = !showReplyForm">답글</button>
      <!-- 현재 사용자가 댓글 작성자인 경우에만 수정/삭제 버튼 표시 -->
      <template v-if="currentUser && currentUser.userId === comment.userId">
        <button @click="startEdit">수정</button>
        <button class="delete-button" @click="handleDelete">삭제</button>
      </template>
    </div>

    <!-- 답글 입력 폼 -->
    <div v-if="showReplyForm" class="reply-input-form">
        <textarea v-model="newReplyContent" placeholder="답글을 입력하세요..." rows="2"></textarea>
        <button @click="submitReply" :disabled="!newReplyContent.trim()">등록</button>
    </div>

    <div class="child-comments">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { updateComment, deleteComment, createComment } from '@/api/problemApi.js'; // createComment 추가
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

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

const emit = defineEmits(['commentUpdated', 'commentDeleted', 'commentAdded']); // commentAdded 이벤트 추가

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const showReplyForm = ref(false);
const isEditing = ref(false);
const editedContent = ref('');
const newReplyContent = ref(''); // 답글 내용을 위한 ref

const formattedCreatedAt = computed(() => {
  if (!props.comment.createdAt) {
    return '';
  }
  const date = new Date(props.comment.createdAt);
  return date.toLocaleString();
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
    emit('commentUpdated'); // 부모 컴포넌트에 댓글이 업데이트되었음을 알림
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
    emit('commentDeleted'); // 부모 컴포넌트에 댓글이 삭제되었음을 알림
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
    newReplyContent.value = ''; // 입력 필드 초기화
    showReplyForm.value = false; // 답글 폼 닫기
    emit('commentAdded'); // 부모 컴포넌트에 새 댓글이 추가되었음을 알림 (재로딩 유도)
  } catch (err) {
    console.error('답글 생성 실패:', err);
    alert('답글 생성에 실패했습니다.');
  }
};



</script>