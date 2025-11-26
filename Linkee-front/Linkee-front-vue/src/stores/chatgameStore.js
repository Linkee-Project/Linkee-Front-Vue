import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useChatGameStore = defineStore("chatGame", {
    state: () => ({
        token: null,
        roomId: null,

        stompClient: null,
        subscription: null,

        messages: [],
        members: [],
        problems: [],

        currentQuestion: null,
        currentAnswer: null,
    }),

    actions: {
        /* -------------------------------------------
           초기화
        ------------------------------------------- */
        init(token, roomId) {
            this.token = token;
            this.roomId = Number(roomId);
        },

        /* -------------------------------------------
           WebSocket 연결 (최신 Stomp Client 방식)
        ------------------------------------------- */
        connectSocket() {
            console.log("🔌 WebSocket 연결 준비...");

            this.stompClient = new Client({
                webSocketFactory: () =>
                    new SockJS(`http://localhost:8080/ws-chat?token=${this.token}`),

                connectHeaders: {
                    Authorization: "Bearer " + this.token  // 이건 STOMP CONNECT 프레임용
                },

                reconnectDelay: 5000,
                debug: msg => console.log("[STOMP]", msg)
            });

            /* 연결 성공 시 */
            this.stompClient.onConnect = () => {
                console.log("🟢 WebSocket 연결됨!");

                this.subscription = this.stompClient.subscribe(
                    `/topic/chatroom/${this.roomId}`,
                    this.onSocketMessage.bind(this)
                );
            };

            /* 연결 끊김 */
            this.stompClient.onStompError = (frame) => {
                console.error("❌ STOMP ERROR:", frame);
            };

            /* 연결 시작 */
            this.stompClient.activate();
        },

        /* -------------------------------------------
           WebSocket 메시지 처리
        ------------------------------------------- */
        onSocketMessage(raw) {
            const msg = JSON.parse(raw.body);

            /* 문제 출제 */
            if (msg.type === "QNA_QUESTION") {
                this.currentQuestion = msg.question;
                this.currentAnswer = null;

                this.problems.push({
                    id: this.problems.length + 1,
                    title: msg.question,
                    desc: "",
                    answer: null,
                    user: msg.senderNickname || "SYSTEM",
                    revealed: false,
                });

                this.messages.push({
                    id: Date.now(),
                    user: "SYSTEM",
                    text: `문제가 출제되었습니다: ${msg.question}`,
                });
                return;
            }

            /* 정답 공개 */
            if (msg.type === "QNA_ANSWER") {
                this.currentAnswer = msg.answer;

                const last = this.problems[this.problems.length - 1];
                if (last) {
                    last.revealed = true;
                    last.answer = msg.answer;
                }

                this.messages.push({
                    id: Date.now(),
                    user: "SYSTEM",
                    text: `정답이 공개되었습니다: ${msg.answer}`,
                });
                return;
            }

            /* 일반 채팅 */
            this.messages.push({
                id: Date.now(),
                user: msg.senderNickname,
                text: msg.message,
            });
        },

        /* -------------------------------------------
           메시지 전송
        ------------------------------------------- */
        sendMessage(text) {
            if (!text.trim() || !this.stompClient) return;

            this.stompClient.publish({
                destination: "/app/chat.send",
                headers: { Authorization: "Bearer " + this.token },
                body: JSON.stringify({
                    roomId: this.roomId,
                    message: text,
                }),
            });
        },

        /* -------------------------------------------
           문제 출제 REST API
        ------------------------------------------- */
        async submitProblem(question, answer) {
            await fetch(
                `http://localhost:8080/api/v1/chat/qna/${this.roomId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + this.token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question, answer }),
                }
            );
        },

        /* -------------------------------------------
           정답 공개 REST API
        ------------------------------------------- */
        async revealAnswer() {
            const res = await fetch(
                `http://localhost:8080/api/v1/chat/qna/${this.roomId}/reveal`,
                {
                    headers: { Authorization: "Bearer " + this.token },
                }
            );
            const data = await res.json();

            this.currentAnswer = data.qnaAnswer;
        },

        /* -------------------------------------------
           기존 메시지 불러오기
        ------------------------------------------- */
        async loadMessages() {
            const res = await fetch(
                `http://localhost:8080/api/v1/chat/rooms/${this.roomId}/messages`,
                {
                    headers: { Authorization: "Bearer " + this.token },
                }
            );

            const arr = await res.json();

            this.messages = arr.map(m => ({
                id: m.id,
                user: m.senderNickname,
                text: m.message,
            }));
        },

        /* -------------------------------------------
           멤버 목록 가져오기
        ------------------------------------------- */
        async loadMembers() {
            const res = await fetch(
                `http://localhost:8080/api/v1/chat/rooms/${this.roomId}/members`,
                {
                    headers: { Authorization: "Bearer " + this.token },
                }
            );

            this.members = await res.json();
        },

        /* -------------------------------------------
           방 나가기
        ------------------------------------------- */
        leaveRoom() {
            if (!this.stompClient) return;

            this.stompClient.publish({
                destination: "/app/chat.leave",
                headers: { Authorization: "Bearer " + this.token },
                body: JSON.stringify({ roomId: this.roomId }),
            });

            this.subscription?.unsubscribe();

            this.stompClient.deactivate(); // ⭐ 최신 문법
            console.log("🔻 WebSocket 종료");
        },
    },
});
