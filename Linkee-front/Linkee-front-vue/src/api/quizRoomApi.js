import api from "./axios";

/**
 * 퀴즈방 목록 조회
 * GET /api/v1/quiz/rooms
 */
export async function fetchQuizRooms({ page = 1, size = 12,keyword = null, categoryId = null } = {}) {
    const params ={
        'page':page-1,
        'size':size
    };
    if(keyword){
        params.keyword = keyword;
    }
    if(categoryId){
        params.categoryId = categoryId;
    }
    const res = await api.get("/quiz/rooms",{ params });
    return res.data.data;  // PageResponse<QuizRoomListResponseDto>
}

/**
 * 퀴즈방 상세 조회
 * GET /api/v1/quiz/rooms/{roomId}
 */
export async function fetchQuizRoomDetail(roomId) {
    const res = await api.get(`/quiz/rooms/${roomId}`);
    return res.data.data; // QuizRoomDetailResponseDto
}

/**
 * 빠른 시작
 * GET /api/v1/quiz/rooms/quick-start
 */
export async function quickStart() {
    const res = await api.get(`/quiz/rooms/quick-start`);
    return res.data.data; // QuizRoomResponseDto
}

/**
 * 플레이 진행 상태 조회
 * GET /api/v1/quiz/rooms/{roomId}/state
 */
export async function fetchPlayState(roomId) {
    const res = await api.get(`/quiz/rooms/${roomId}/state`);
    return res.data.data;  // PlayStateResponseDto
}

/**
 * 최종 결과 조회
 * GET /api/v1/quiz/rooms/{roomId}/results
 */
export async function fetchQuizResults(roomId, { page = 0, size = 10 } = {}) {
    const res = await api.get(`/rooms/${roomId}/results`, {
        params: { page, size },
    });

    return res.data.data; // List<ResultRowResponseDto>
}

/**
 * 퀴즈방 멤버 생성(입장)
 * POST /api/v1/quiz/rooms/member
 */
export async function joinQuizRoom(quizRoomId) {
    // 👉 roomId가 잘 넘어오는지만 먼저 콘솔로 체크
    console.log('[joinQuizRoom] roomId = ', quizRoomId);

    const res = await api.post('/quiz/rooms/member', {
        quizRoomId: Number(quizRoomId)
    });

    return res.data.data;
}

/**
 * 퀴즈방 생성
 * POST /api/v1/quiz/rooms
 */
export async function createQuizRoom(payload) {
    const res = await api.post("/quiz/rooms", payload);
    return res.data.data;   // Long quizRoomId
}
/**
 * 퀴즈방 나가기
 * POST /api/v1/quiz/rooms/{quizRoomId}/leave
 */
// 방장/일반 유저 공통 엔드포인트
export const leaveQuizRoom = (quizRoomId) => {
    return api.post(`/quiz/rooms/${quizRoomId}/leave`)
}
/**
 * 퀴즈방 시작
 * POST /api/v1/quiz/rooms//{quizRoomId}/start
 */
export function startQuizRoom(quizRoomId) {
    return api.post(`/quiz/rooms/${quizRoomId}/start`)
}