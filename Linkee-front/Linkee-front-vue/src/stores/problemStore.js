import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getQuestionsList, getQuestionsListByCategory, getQuestionDetail, createQuestion, updateQuestion, deleteQuestion, getCommentsByQuestionId } from '@/api/problemApi'; // getCommentsByQuestionId API 함수 추가

export const useProblemStore = defineStore('problem', () => {
  // 1. 상태(State): 데이터 변수
  const problems = ref([]); // 문제 목록 배열
  const loading = ref(false); // 목록 로딩 상태
  const totalPages = ref(0); // 전체 페이지 수

  const problemDetail = ref(null); // 문제 상세 정보 객체
  const detailLoading = ref(false); // 상세 정보 로딩 상태

  const createLoading = ref(false); // 문제 생성 로딩 상태
  const updateLoading = ref(false); // 문제 수정 로딩 상태
  const deleteLoading = ref(false); // 문제 삭제 로딩 상태

  const comments = ref([]); // 댓글 목록 배열
  const commentsLoading = ref(false); // 댓글 로딩 상태


  // 2. 액션(Action): API를 호출하고 상태를 변경하는 함수
  async function fetchProblems(page = 0, size = 10, categoryId, keyword) {
    loading.value = true; // 로딩 시작
    try {
      let response;
      if (categoryId) { // categoryId가 유효하면 카테고리별 조회 API 호출
        response = await getQuestionsListByCategory(categoryId, page, size, keyword);
      } else { // categoryId가 없으면 전체 목록 조회 API 호출
        response = await getQuestionsList(page, size, keyword);
      }
      
      // 백엔드 응답 데이터 형식에 맞춰 상태를 업데이트합니다.
      problems.value = response.data.content; 
      totalPages.value = response.data.totalPages;
      
    } catch (error) {
      console.error('문제 목록을 불러오는데 실패했습니다.', error);
    } finally {
      loading.value = false; // 로딩 끝 (성공/실패 여부와 관계없이)
    }
  }

  async function fetchProblemDetail(questionId) {
    detailLoading.value = true;
    problemDetail.value = null; // 이전 데이터 초기화
    try {
      const response = await getQuestionDetail(questionId);
      problemDetail.value = response.data;
    } catch (error) {
      console.error('문제 상세 정보를 불러오는데 실패했습니다.', error);
    } finally {
      detailLoading.value = false;
    }
  }

  async function createQuestionAction(questionData) {
    createLoading.value = true;
    try {
      const response = await createQuestion(questionData);
      // 백엔드에서 "문제 등록 완료"라는 문자열을 반환하므로, response.data에 직접 접근
      return { success: true, message: response.data };
    } catch (error) {
      console.error('문제 등록 실패:', error);
      const errorMessage = error.response?.data?.message || '문제 등록 중 오류가 발생했습니다.';
      return { success: false, message: errorMessage };
    } finally {
      createLoading.value = false;
    }
  }

  async function updateQuestionAction(questionId, questionData) {
    updateLoading.value = true;
    try {
      const response = await updateQuestion(questionId, questionData);
      // 백엔드에서 "문제 수정 완료"라는 문자열을 반환하므로, response.data에 직접 접근
      return { success: true, message: response.data };
    } catch (error) {
      console.error('문제 수정 실패:', error);
      const errorMessage = error.response?.data?.message || '문제 수정 중 오류가 발생했습니다.';
      return { success: false, message: errorMessage };
    } finally {
      updateLoading.value = false;
    }
  }

  async function deleteQuestionAction(questionId) {
    deleteLoading.value = true;
    try {
      const response = await deleteQuestion(questionId);
      // 백엔드에서 "문제 삭제 완료"라는 문자열을 반환하므로, response.data에 직접 접근
      return { success: true, message: response.data };
    } catch (error) {
      console.error('문제 삭제 실패:', error);
      const errorMessage = error.response?.data?.message || '문제 삭제 중 오류가 발생했습니다.';
      return { success: false, message: errorMessage };
    } finally {
      deleteLoading.value = false;
    }
  }

  async function fetchComments(questionId) {
    commentsLoading.value = true;
    comments.value = []; // 이전 댓글 초기화
    try {
      const response = await getCommentsByQuestionId(questionId);
      comments.value = response.data;
    } catch (error) {
      console.error('댓글 목록을 불러오는데 실패했습니다:', error);
    } finally {
      commentsLoading.value = false;
    }
  }

  // 외부에서 사용할 상태와 액션을 반환합니다.
  return { 
    problems, 
    loading, 
    totalPages, 
    fetchProblems,
    problemDetail,
    detailLoading,
    fetchProblemDetail,
    createLoading,
    createQuestionAction,
    updateLoading,
    updateQuestionAction,
    deleteLoading,
    deleteQuestionAction,
    comments, // 새로운 상태 추가
    commentsLoading, // 새로운 로딩 상태 추가
    fetchComments, // 새로운 액션 추가
  };
});
