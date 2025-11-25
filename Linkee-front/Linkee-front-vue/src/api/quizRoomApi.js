import api from "./axios";

/**
 * 퀴즈방 목록 조회
 * GET /api/v1/quiz/rooms
 */
export async function fetchQuizRooms({ page = 1, size = 12 } = {}) {
    const res = await api.get("/quiz/rooms", {
        params: { page: page - 1, size },  // 백엔드는 0부터 시작
    });

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
