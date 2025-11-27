import api from './axios';

/**
 * 문제 목록을 조회하는 API (카테고리 필터링 없음)
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} size - 한 페이지에 보여줄 문제 수
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<any>}
 */
export const getQuestionsList = (page = 0, size = 10, keyword) => {
  const params = {
    page,
    size,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  return api.get('/question/questions', {
    params,
  });
};

/**
 * 문제 목록을 카테고리별로 조회하는 API
 * @param {Long} categoryId - 카테고리 ID
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} size - 한 페이지에 보여줄 문제 수
 *
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<any>}
 */
export const getQuestionsListByCategory = (categoryId, page = 0, size = 10, keyword) => {
  const params = {
    page,
    size,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  return api.get(`/question/questions/categories/${categoryId}`, {
    params,
  });
};

/**
 * 문제 상세 정보를 조회하는 API
 * @param {Long} questionId - 조회할 문제의 ID
 * @returns {Promise<any>}
 */
export const getQuestionDetail = (questionId) => {
  return api.get(`/question/questions/${questionId}`);
};

/**
 * 새로운 문제를 등록하는 API
 * @param {Object} questionData - CreateQuestionRequestDto 형식의 문제 데이터
 * @returns {Promise<any>}
 */
export const createQuestion = (questionData) => {
  // POST 요청이므로 두 번째 인자로 body 데이터를 보냅니다.
  return api.post('/question/questions/new', questionData);
};

/**
 * 기존 문제를 수정하는 API
 * @param {Long} questionId - 수정할 문제의 ID
 * @param {Object} questionData - UpdateQuestionRequestDto 형식의 문제 데이터
 * @returns {Promise<any>}
 */
export const updateQuestion = (questionId, questionData) => {
  // PATCH 요청이므로 두 번째 인자로 body 데이터를 보냅니다.
  return api.patch(`/question/questions/${questionId}`, questionData);
};

/**
 * 문제를 삭제하는 API
 * @param {Long} questionId - 삭제할 문제의 ID
 * @returns {Promise<any>}
 */
export const deleteQuestion = (questionId) => {
  return api.delete(`/question/questions/${questionId}`);
};

/**
 * 특정 문제의 댓글 목록을 조회하는 API
 * @param {Long} questionId - 댓글을 조회할 문제의 ID
 * @returns {Promise<List<CommentListResponseDto>>}
 */
export const getCommentsByQuestionId = (questionId) => {
  return api.get(`/question/comments/questions/${questionId}`);
};

/**
 * 새로운 댓글을 등록하는 API
 * @param {Long} questionId - 댓글을 등록할 문제의 ID
 * @param {object} commentData - { parentCommentId: Long | null, commentContent: String } 형식의 댓글 데이터
 * @returns {Promise<any>}
 */
export const createComment = (questionId, commentData) => {
  return api.post(`/question/questions/${questionId}/comments`, commentData);
};

/**
 * 기존 댓글을 수정하는 API
 * @param {Long} questionId - 댓글이 속한 문제의 ID
 * @param {Long} commentId - 수정할 댓글의 ID
 * @param {object} commentData - { commentContent: String } 형식의 댓글 데이터
 * @returns {Promise<any>}
 */
export const updateComment = (questionId, commentId, commentData) => {
  return api.patch(`/question/questions/${questionId}/comments/${commentId}`, commentData);
};

/**
 * 댓글을 삭제하는 API
 * @param {Long} questionId - 댓글이 속한 문제의 ID
 * @param {Long} commentId - 삭제할 댓글의 ID
 * @returns {Promise<any>}
 */
export const deleteComment = (questionId, commentId) => {
  return api.delete(`/question/questions/${questionId}/comments/${commentId}`);
};

/**
 * 문제 북마크를 추가하는 API
 * @param {Long} questionId - 북마크할 문제의 ID
 * @returns {Promise<any>}
 */
export const addBookmark = (questionId) => {
  return api.post(`/question/bookmarks/${questionId}`);
};

/**
 * 문제 북마크를 삭제하는 API
 * @param {Long} questionId - 북마크를 삭제할 문제의 ID
 * @returns {Promise<any>}
 */
export const removeBookmark = (questionId) => {
  return api.delete(`/question/bookmarks/${questionId}`);
};

/**
 * 현재 사용자의 북마크된 문제 목록을 조회하는 API
 * @param {object} params - { page: number, size: number, keyword: string }
 * @returns {Promise<PageResponse<BookmarkListResponseDto>>}
 */
export const getBookmarkedQuestions = (params = { page: 0, size: 10 }) => {
  return api.get(`/question/bookmarks/me`, { params });
};

/**
 * 관리자용 문제 목록을 조회하는 API (필터링 및 페이지네이션 포함)
 * @param {object} params - { page: number, size: number, keyword: string, verified: string, deleted: string } (AdminQuestionSearchRequest DTO)
 * @returns {Promise<PageResponse<QuestionListResponseDto>>}
 */
export const getAdminProblemList = (params) => {
  return api.get(`/question/questions/admin/questions`, { params });
};

/**
 * 관리자가 특정 문제를 검증 처리하는 API
 * @param {Long} questionId - 검증할 문제의 ID
 * @returns {Promise<any>}
 */
export const verifyProblem = (questionId) => {
  return api.post(`/admin/question/questions/${questionId}/verify`);
};

/**
 * 관리자가 특정 문제를 소프트 삭제 처리하는 API
 * @param {Long} questionId - 삭제할 문제의 ID
 * @returns {Promise<any>}
 */
export const adminDeleteProblem = (questionId) => {
  return api.delete(`/admin/question/questions/${questionId}`);
};
