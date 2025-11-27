import api from "@/api/axios.js";

// 내 채팅방 목록 조회 (CHAT 전용)
export async function fetchMyChatRooms({ page = 0, size = 20 } = {}) {
    const res = await api.get("/chat/rooms/chat/my", {
        params: { page, size }
    });

    // 서버에서 Page 형태로 응답하면 res.data.content 형태임
    return res.data;
}

// 새 채팅방 생성
export async function createChatRoom(data) {
    return api.post("/chat/rooms", data);
}

// 친구 초대 API
export async function inviteToChatRoom(roomId, invitedUsers, token) {
    return api.post(
        `/chat/rooms/${roomId}/invite`,
        { userIds: invitedUsers.map(u => u.id) },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export async function fetchRoomMembers(roomId) {
    return api.get(`/chat/rooms/${roomId}/members`);
}

