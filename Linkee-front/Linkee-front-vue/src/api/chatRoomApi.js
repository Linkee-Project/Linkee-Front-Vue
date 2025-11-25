import api from "@/api/axios.js";

/** 게임방 목록 */
export async function fetchGameRooms({ page = 0, size = 20 } = {}) {
    const res = await api.get("/chat/rooms/game", {
        params: { page, size }
    });

    console.log(res.data)
    return res.data;  // <- 서버가 보내는 PageResponse 그대로 반환
}

/** 게임방 상세 */
export async function fetchGameRoomDetail(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}`);
    return res.data.data;
}

/** 게임방 생성 */
export async function createGameRoom(payload) {
    const res = await api.post("/chat/rooms", payload);
    return res.data;
}

/** 입장 */
export async function joinGameRoom(roomId, roomCode = null) {
    const body = roomCode ? { roomCode } : {};
    const res = await api.post(`/chat/rooms/${roomId}/join`, body);
    return res.data;
}

/** 멤버 목록 */
export async function fetchRoomMembers(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}/members`);
    return res.data;
}

/** 메시지 */
export async function fetchRoomMessages(roomId) {
    const res = await api.get(`/chat/rooms/${roomId}/messages`);
    return res.data;
}
