import api from "./axios";

/**
 * 전체 게임방 목록 조회
 * GET /api/v1/chat/rooms/game
 */
export async function fetchGameRooms({ page = 1, size = 20 } = {}) {
    const res = await api.get("/chat/rooms/game", {
        params: { page, size },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 또는 Pinia store
        },
    });

    return res.data; // PageResponse<GameRoomListResponseDto>
}

/**
 * 특정 게임방 정보 조회? (원하면 추가)
 * GET /api/v1/chat/rooms/{roomId}
 * 백엔드에 존재하면 구현, 없으면 생략
 */
export async function fetchGameRoomDetail(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return res.data.data;
}

/**
 * 게임방 생성
 * POST /api/v1/chat/rooms
 */
export async function createGameRoom(payload) {
    const res = await api.post("/chat/rooms", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.data; // 성공하면 ApiResponse or DTO
}

/**
 * 방 입장 (비밀번호 있을 경우 roomCode 포함)
 * POST /api/v1/chat/rooms/{roomId}/join
 */
export async function joinGameRoom(roomId, roomCode = null) {
    const body = roomCode !== null ? { roomCode } : {};

    const res = await api.post(`/chat/rooms/${roomId}/join`, body, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.data; // ChatRoomJoinResponseDto
}

/**
 * 해당 방의 현재 참여자 목록 조회
 * GET /api/v1/chat/rooms/{roomId}/members
 */
export async function fetchRoomMembers(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}/members`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.data; // List<ChatMemberDto>
}

/**
 * 특정 방의 메시지 목록 조회
 * GET /api/v1/chat/rooms/{roomId}/messages
 */
export async function fetchRoomMessages(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}/messages`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res.data; // Mongo message list
}
