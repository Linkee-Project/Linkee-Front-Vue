<template>
  <div class="comment-list-container">
    <h3>댓글</h3>

    <!-- 댓글 입력 폼 -->
    <div class="comment-input-form">
        <textarea v-model="newCommentContent" placeholder="댓글을 입력하세요..." rows="3"></textarea>
        <button @click="addComment" :disabled="!newCommentContent.trim()">등록</button>
    </div>

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
        <div v-if="comment.childCount > 0" class="child-comments-container">
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
      </CommentListItem>
    </div>
    <div v-else>
      아직 댓글이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCommentsByQuestionId, createComment } from '@/api/problemApi.js';
import CommentListItem from './CommentListItem.vue';

const props = defineProps({
  questionId: {
    type: [Number, String],
    required: true,
  },
});

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
    // TODO: parentCommentId 처리 (현재는 최상위 댓글만)
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
.comment-list-container {
  margin-top: 2rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.comment-input-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #eee;
}

.comment-input-form textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    resize: vertical;
    min-height: 60px;
    box-sizing: border-box; /* padding을 포함한 너비 */
}

.comment-input-form textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.comment-input-form button {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
}

.comment-input-form button:hover:not(:disabled) {
    background-color: #0056b3;
}

.comment-input-form button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.child-comments-container{
    margin-top: 1rem;
}
</style>
